export interface Timestamp {
  seconds: number
  nanoseconds: number
}

export type FirestoreTimestamp = Timestamp | Date | null

export interface BaseEntity {
  id: string
  createdAt: FirestoreTimestamp
  updatedAt: FirestoreTimestamp
}

export interface PaginatedResult<T> {
  items: T[]
  hasMore: boolean
  lastDoc: unknown
}

export type SortDirection = 'asc' | 'desc'

export interface SortConfig {
  field: string
  direction: SortDirection
}

export interface FilterConfig {
  field: string
  operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'in'
  value: unknown
}
