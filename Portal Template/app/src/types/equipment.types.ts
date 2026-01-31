import type { FirestoreTimestamp } from './common.types'

export type EquipmentCategory = 'camera' | 'lens' | 'computer' | 'storage' | 'networking' | 'audio' | 'lighting' | 'camping' | 'other'
export type EquipmentCondition = 'excellent' | 'good' | 'fair' | 'needs_repair' | 'out_of_service'

export interface Equipment {
  id: string
  name: string
  description: string
  category: EquipmentCategory
  value: number
  ownerId: string
  photoURL?: string
  serialNumber?: string
  purchaseDate?: FirestoreTimestamp
  insuranceVerified: boolean
  insurancePolicyNumber?: string
  condition: EquipmentCondition
  currentHolder?: string
  checkedOutAt?: FirestoreTimestamp
  expectedReturnAt?: FirestoreTimestamp
  location?: string
  notes: string
  maintenanceHistory: MaintenanceRecord[]
  createdAt: FirestoreTimestamp
  updatedAt: FirestoreTimestamp
}

export interface MaintenanceRecord {
  id: string
  date: FirestoreTimestamp
  description: string
  performedBy: string
  cost?: number
}

export interface EquipmentCheckout {
  id: string
  equipmentId: string
  userId: string
  checkedOutAt: FirestoreTimestamp
  expectedReturnAt?: FirestoreTimestamp
  returnedAt?: FirestoreTimestamp
  condition: EquipmentCondition
  returnCondition?: EquipmentCondition
  notes?: string
}

export const EQUIPMENT_CATEGORY_LABELS: Record<EquipmentCategory, string> = {
  camera: 'Camera',
  lens: 'Lens',
  computer: 'Computer',
  storage: 'Storage',
  networking: 'Networking',
  audio: 'Audio',
  lighting: 'Lighting',
  camping: 'Camping',
  other: 'Other'
}

export const EQUIPMENT_CATEGORY_ICONS: Record<EquipmentCategory, string> = {
  camera: 'Camera',
  lens: 'Aperture',
  computer: 'Monitor',
  storage: 'HardDrive',
  networking: 'Wifi',
  audio: 'Mic',
  lighting: 'Lightbulb',
  camping: 'Tent',
  other: 'Package'
}

export const EQUIPMENT_CONDITION_LABELS: Record<EquipmentCondition, string> = {
  excellent: 'Excellent',
  good: 'Good',
  fair: 'Fair',
  needs_repair: 'Needs Repair',
  out_of_service: 'Out of Service'
}

export const EQUIPMENT_CONDITION_COLORS: Record<EquipmentCondition, string> = {
  excellent: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  good: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  fair: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  needs_repair: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  out_of_service: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
}
