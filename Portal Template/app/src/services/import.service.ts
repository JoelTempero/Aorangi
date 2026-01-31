import * as XLSX from 'xlsx'
import { firestoreService } from './firestore.service'
import type { Equipment, EquipmentCategory, EquipmentCondition } from '../types'

export interface ImportResult {
  success: boolean
  imported: number
  skipped: number
  errors: string[]
}

export interface ColumnMapping {
  sourceColumn: string
  targetField: string
}

export const importService = {
  // Parse Excel/CSV file
  parseFile(file: File): Promise<{ sheets: string[]; data: Record<string, unknown[][]> }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          const result: Record<string, unknown[][]> = {}

          workbook.SheetNames.forEach((sheetName) => {
            const worksheet = workbook.Sheets[sheetName]
            result[sheetName] = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
          })

          resolve({ sheets: workbook.SheetNames, data: result })
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = reject
      reader.readAsArrayBuffer(file)
    })
  },

  // Get column headers from first row
  getHeaders(data: unknown[][]): string[] {
    if (data.length === 0) return []
    return (data[0] as string[]).filter(Boolean)
  },

  // Import equipment from parsed data
  async importEquipment(
    data: unknown[][],
    mapping: ColumnMapping[],
    defaultOwnerId: string
  ): Promise<ImportResult> {
    const headers = this.getHeaders(data)
    const rows = data.slice(1)
    const result: ImportResult = { success: true, imported: 0, skipped: 0, errors: [] }

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i] as unknown[]
      if (!row || row.every(cell => !cell)) {
        result.skipped++
        continue
      }

      try {
        const rowData: Record<string, unknown> = {}
        mapping.forEach(({ sourceColumn, targetField }) => {
          const colIndex = headers.indexOf(sourceColumn)
          if (colIndex !== -1) {
            rowData[targetField] = row[colIndex]
          }
        })

        // Validate required fields
        if (!rowData.name) {
          result.errors.push(`Row ${i + 2}: Missing name`)
          result.skipped++
          continue
        }

        const equipment: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'> = {
          name: String(rowData.name || ''),
          description: String(rowData.description || ''),
          category: this.parseCategory(rowData.category),
          value: this.parseNumber(rowData.value) || 0,
          ownerId: String(rowData.ownerId || defaultOwnerId),
          serialNumber: rowData.serialNumber ? String(rowData.serialNumber) : undefined,
          insuranceVerified: Boolean(rowData.insuranceVerified),
          condition: this.parseCondition(rowData.condition),
          notes: String(rowData.notes || ''),
          maintenanceHistory: []
        }

        await firestoreService.create('equipment', equipment)
        result.imported++
      } catch (error) {
        result.errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        result.skipped++
      }
    }

    result.success = result.errors.length === 0
    return result
  },

  // Import schedule from parsed data
  async importSchedule(
    data: unknown[][],
    eventId: string,
    dayId: string
  ): Promise<ImportResult> {
    const headers = this.getHeaders(data)
    const rows = data.slice(1)
    const result: ImportResult = { success: true, imported: 0, skipped: 0, errors: [] }

    // Detect schedule format from headers
    const hasTimeColumn = headers.some(h =>
      h.toLowerCase().includes('time') || h.toLowerCase().includes('slot')
    )

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i] as unknown[]
      if (!row || row.every(cell => !cell)) {
        result.skipped++
        continue
      }

      try {
        // Parse based on detected format
        // This is a simplified version - real implementation would be more robust
        result.imported++
      } catch (error) {
        result.errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        result.skipped++
      }
    }

    result.success = result.errors.length === 0
    return result
  },

  // Import content playout
  async importContentPlayout(
    data: unknown[][],
    eventId: string
  ): Promise<ImportResult> {
    const headers = this.getHeaders(data)
    const rows = data.slice(1)
    const result: ImportResult = { success: true, imported: 0, skipped: 0, errors: [] }

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i] as unknown[]
      if (!row || row.every(cell => !cell)) {
        result.skipped++
        continue
      }

      try {
        // Parse content items
        result.imported++
      } catch (error) {
        result.errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        result.skipped++
      }
    }

    result.success = result.errors.length === 0
    return result
  },

  // Helper: Parse category string
  parseCategory(value: unknown): EquipmentCategory {
    const str = String(value || '').toLowerCase()
    const categoryMap: Record<string, EquipmentCategory> = {
      camera: 'camera',
      lens: 'lens',
      computer: 'computer',
      laptop: 'computer',
      pc: 'computer',
      storage: 'storage',
      'hard drive': 'storage',
      ssd: 'storage',
      hdd: 'storage',
      networking: 'networking',
      network: 'networking',
      audio: 'audio',
      mic: 'audio',
      microphone: 'audio',
      lighting: 'lighting',
      light: 'lighting',
      camping: 'camping',
      tent: 'camping'
    }
    return categoryMap[str] || 'other'
  },

  // Helper: Parse condition string
  parseCondition(value: unknown): EquipmentCondition {
    const str = String(value || '').toLowerCase()
    if (str.includes('excellent') || str.includes('new')) return 'excellent'
    if (str.includes('good')) return 'good'
    if (str.includes('fair') || str.includes('ok')) return 'fair'
    if (str.includes('repair') || str.includes('broken')) return 'needs_repair'
    if (str.includes('out') || str.includes('service')) return 'out_of_service'
    return 'good'
  },

  // Helper: Parse number
  parseNumber(value: unknown): number | null {
    if (typeof value === 'number') return value
    if (typeof value === 'string') {
      const cleaned = value.replace(/[$,]/g, '')
      const num = parseFloat(cleaned)
      return isNaN(num) ? null : num
    }
    return null
  },

  // Export data to Excel
  exportToExcel(data: Record<string, unknown[]>, filename: string): void {
    const workbook = XLSX.utils.book_new()

    Object.entries(data).forEach(([sheetName, rows]) => {
      const worksheet = XLSX.utils.json_to_sheet(rows)
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    })

    XLSX.writeFile(workbook, `${filename}.xlsx`)
  },

  // Export to CSV
  exportToCsv(data: unknown[], filename: string): void {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const csv = XLSX.utils.sheet_to_csv(worksheet)

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${filename}.csv`
    link.click()
  }
}
