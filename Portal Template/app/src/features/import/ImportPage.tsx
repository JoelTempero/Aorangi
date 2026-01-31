import { useState, useCallback } from 'react'
import { PageLayout } from '../../components/layout'
import { Card, CardHeader, Button, Badge, Select, EmptyState } from '../../components/ui'
import { useAuth } from '../../hooks/useAuth'
import { importService, type ImportResult } from '../../services/import.service'
import { cn } from '../../utils/cn'
import toast from 'react-hot-toast'
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  X,
  ArrowRight,
  Download
} from 'lucide-react'

type ImportType = 'equipment' | 'schedule' | 'content'

export function ImportPage() {
  const { user } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<{ sheets: string[]; data: Record<string, unknown[][]> } | null>(null)
  const [selectedSheet, setSelectedSheet] = useState<string>('')
  const [importType, setImportType] = useState<ImportType>('equipment')
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setResult(null)

    try {
      const parsed = await importService.parseFile(selectedFile)
      setParsedData(parsed)
      if (parsed.sheets.length > 0) {
        setSelectedSheet(parsed.sheets[0])
      }
    } catch (error) {
      toast.error('Failed to parse file')
      setFile(null)
      setParsedData(null)
    }
  }, [])

  const handleImport = async () => {
    if (!parsedData || !selectedSheet || !user) return

    setImporting(true)
    setResult(null)

    try {
      const data = parsedData.data[selectedSheet]

      let importResult: ImportResult

      switch (importType) {
        case 'equipment':
          // Basic column mapping - in production this would be configurable
          const headers = importService.getHeaders(data)
          const mapping = headers.map((h) => {
            const lower = h.toLowerCase()
            if (lower.includes('name') || lower.includes('item')) return { sourceColumn: h, targetField: 'name' }
            if (lower.includes('desc')) return { sourceColumn: h, targetField: 'description' }
            if (lower.includes('value') || lower.includes('price') || lower.includes('cost')) return { sourceColumn: h, targetField: 'value' }
            if (lower.includes('category') || lower.includes('type')) return { sourceColumn: h, targetField: 'category' }
            if (lower.includes('condition')) return { sourceColumn: h, targetField: 'condition' }
            if (lower.includes('serial')) return { sourceColumn: h, targetField: 'serialNumber' }
            if (lower.includes('owner')) return { sourceColumn: h, targetField: 'ownerId' }
            return { sourceColumn: h, targetField: h }
          })
          importResult = await importService.importEquipment(data, mapping, user.id)
          break

        case 'schedule':
          importResult = await importService.importSchedule(data, 'ec25', 'day1')
          break

        case 'content':
          importResult = await importService.importContentPlayout(data, 'ec25')
          break

        default:
          throw new Error('Invalid import type')
      }

      setResult(importResult)

      if (importResult.success) {
        toast.success(`Imported ${importResult.imported} items`)
      } else {
        toast.error(`Imported ${importResult.imported} items with ${importResult.errors.length} errors`)
      }
    } catch (error) {
      toast.error('Import failed')
      setResult({
        success: false,
        imported: 0,
        skipped: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      })
    } finally {
      setImporting(false)
    }
  }

  const clearFile = () => {
    setFile(null)
    setParsedData(null)
    setSelectedSheet('')
    setResult(null)
  }

  return (
    <PageLayout
      title="Import Data"
      description="Import data from Excel or CSV files"
    >
      <div className="max-w-3xl mx-auto">
        {/* Upload Area */}
        <Card className="mb-6">
          <CardHeader
            title="Upload File"
            description="Supported formats: .xlsx, .xls, .csv"
          />

          {!file ? (
            <label className="mt-4 flex flex-col items-center justify-center h-48 border-2 border-dashed border-surface-300 dark:border-surface-600 rounded-xl cursor-pointer hover:border-primary-400 dark:hover:border-primary-600 transition-colors">
              <Upload className="h-10 w-10 text-surface-400 mb-3" />
              <p className="text-sm text-surface-600 dark:text-surface-400">
                Drag and drop or click to upload
              </p>
              <p className="text-xs text-surface-400 mt-1">
                Max file size: 10MB
              </p>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          ) : (
            <div className="mt-4 flex items-center gap-4 p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
              <FileSpreadsheet className="h-10 w-10 text-green-600" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-sm text-surface-500">
                  {(file.size / 1024).toFixed(1)} KB
                  {parsedData && ` - ${parsedData.sheets.length} sheet(s)`}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={clearFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </Card>

        {/* Configuration */}
        {parsedData && (
          <Card className="mb-6">
            <CardHeader
              title="Configuration"
              description="Select what to import"
            />

            <div className="mt-4 space-y-4">
              <Select
                label="Import Type"
                value={importType}
                onChange={(e) => setImportType(e.target.value as ImportType)}
                options={[
                  { value: 'equipment', label: 'Equipment / Inventory' },
                  { value: 'schedule', label: 'Schedule / Shifts' },
                  { value: 'content', label: 'Content Playout' }
                ]}
              />

              {parsedData.sheets.length > 1 && (
                <Select
                  label="Sheet"
                  value={selectedSheet}
                  onChange={(e) => setSelectedSheet(e.target.value)}
                  options={parsedData.sheets.map((s) => ({ value: s, label: s }))}
                />
              )}
            </div>

            {/* Preview */}
            {selectedSheet && parsedData.data[selectedSheet] && (
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-3">Preview (first 5 rows)</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-surface-200 dark:border-surface-700">
                        {(parsedData.data[selectedSheet][0] as string[])?.map((header, i) => (
                          <th key={i} className="px-3 py-2 text-left font-medium text-surface-500">
                            {header || `Column ${i + 1}`}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {parsedData.data[selectedSheet].slice(1, 6).map((row, i) => (
                        <tr key={i} className="border-b border-surface-100 dark:border-surface-800">
                          {(row as unknown[]).map((cell, j) => (
                            <td key={j} className="px-3 py-2 truncate max-w-[200px]">
                              {String(cell || '')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-surface-400 mt-2">
                  {parsedData.data[selectedSheet].length - 1} total rows
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleImport}
                loading={importing}
                disabled={!selectedSheet}
                leftIcon={<ArrowRight className="h-4 w-4" />}
              >
                Import Data
              </Button>
            </div>
          </Card>
        )}

        {/* Results */}
        {result && (
          <Card>
            <CardHeader
              title={result.success ? 'Import Complete' : 'Import Completed with Errors'}
            />

            <div className="mt-4 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">{result.imported}</span>
                <span className="text-surface-500">imported</span>
              </div>

              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <span className="font-medium">{result.skipped}</span>
                <span className="text-surface-500">skipped</span>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <h4 className="text-sm font-medium text-red-800 dark:text-red-300 mb-2">
                  Errors ({result.errors.length})
                </h4>
                <ul className="text-sm text-red-600 dark:text-red-400 space-y-1 max-h-32 overflow-y-auto">
                  {result.errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        )}

        {/* Help */}
        {!file && (
          <Card className="mt-6">
            <CardHeader
              title="Import Tips"
              description="For best results, format your data like these examples"
            />

            <div className="mt-4 space-y-4">
              <div className="p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                <h4 className="font-medium mb-2">Equipment Import</h4>
                <p className="text-sm text-surface-600 dark:text-surface-400">
                  Include columns: Name, Description, Category, Value, Condition, Serial Number, Owner
                </p>
              </div>

              <div className="p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                <h4 className="font-medium mb-2">Schedule Import</h4>
                <p className="text-sm text-surface-600 dark:text-surface-400">
                  Include columns: Time Slot, Role, Assignee Name, Notes
                </p>
              </div>

              <div className="p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                <h4 className="font-medium mb-2">Content Import</h4>
                <p className="text-sm text-surface-600 dark:text-surface-400">
                  Include columns: Title, Type, Platform, Duration, Shooter, Editor
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </PageLayout>
  )
}
