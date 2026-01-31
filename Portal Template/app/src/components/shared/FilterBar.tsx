import { useState } from 'react'
import { cn } from '../../utils/cn'
import { Button, Badge } from '../ui'
import { Filter, X, ChevronDown, Search } from 'lucide-react'

export interface FilterOption {
  id: string
  label: string
  count?: number
}

export interface FilterGroup {
  id: string
  label: string
  type: 'single' | 'multi' | 'search'
  options?: FilterOption[]
  placeholder?: string
}

export interface ActiveFilter {
  groupId: string
  optionId?: string
  value?: string
}

interface FilterBarProps {
  groups: FilterGroup[]
  activeFilters: ActiveFilter[]
  onFilterChange: (filters: ActiveFilter[]) => void
  className?: string
}

export function FilterBar({ groups, activeFilters, onFilterChange, className }: FilterBarProps) {
  const [openGroup, setOpenGroup] = useState<string | null>(null)

  const handleSelectOption = (groupId: string, optionId: string, groupType: 'single' | 'multi') => {
    const existing = activeFilters.filter((f) => f.groupId === groupId)

    if (groupType === 'single') {
      // Replace any existing filter for this group
      const withoutGroup = activeFilters.filter((f) => f.groupId !== groupId)
      const isCurrentlySelected = existing.some((f) => f.optionId === optionId)

      if (isCurrentlySelected) {
        onFilterChange(withoutGroup)
      } else {
        onFilterChange([...withoutGroup, { groupId, optionId }])
      }
    } else {
      // Toggle the option in multi-select
      const hasOption = existing.some((f) => f.optionId === optionId)
      if (hasOption) {
        onFilterChange(activeFilters.filter((f) => !(f.groupId === groupId && f.optionId === optionId)))
      } else {
        onFilterChange([...activeFilters, { groupId, optionId }])
      }
    }

    setOpenGroup(null)
  }

  const handleSearchChange = (groupId: string, value: string) => {
    const withoutGroup = activeFilters.filter((f) => f.groupId !== groupId)
    if (value) {
      onFilterChange([...withoutGroup, { groupId, value }])
    } else {
      onFilterChange(withoutGroup)
    }
  }

  const clearAllFilters = () => {
    onFilterChange([])
  }

  const removeFilter = (groupId: string, optionId?: string) => {
    if (optionId) {
      onFilterChange(activeFilters.filter((f) => !(f.groupId === groupId && f.optionId === optionId)))
    } else {
      onFilterChange(activeFilters.filter((f) => f.groupId !== groupId))
    }
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Filter buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 text-sm text-surface-500">
          <Filter className="h-4 w-4" />
          <span>Filters:</span>
        </div>

        {groups.map((group) => {
          const groupFilters = activeFilters.filter((f) => f.groupId === group.id)
          const isActive = groupFilters.length > 0

          if (group.type === 'search') {
            return (
              <div key={group.id} className="relative">
                <input
                  type="text"
                  placeholder={group.placeholder || `Search ${group.label}...`}
                  value={groupFilters[0]?.value || ''}
                  onChange={(e) => handleSearchChange(group.id, e.target.value)}
                  className="h-8 px-3 pr-8 text-sm border border-surface-200 dark:border-surface-700 rounded-lg bg-white dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
              </div>
            )
          }

          return (
            <div key={group.id} className="relative">
              <button
                onClick={() => setOpenGroup(openGroup === group.id ? null : group.id)}
                className={cn(
                  'flex items-center gap-1.5 h-8 px-3 text-sm font-medium rounded-lg border transition-colors',
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300'
                    : 'bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 hover:border-primary-300'
                )}
              >
                {group.label}
                {isActive && (
                  <Badge variant="primary" size="sm">
                    {groupFilters.length}
                  </Badge>
                )}
                <ChevronDown className={cn('h-4 w-4 transition-transform', openGroup === group.id && 'rotate-180')} />
              </button>

              {/* Dropdown */}
              {openGroup === group.id && group.options && (
                <div className="absolute top-full left-0 mt-1 min-w-48 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg shadow-lg z-20 py-1">
                  {group.options.map((option) => {
                    const isSelected = groupFilters.some((f) => f.optionId === option.id)
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleSelectOption(group.id, option.id, group.type as 'single' | 'multi')}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-surface-100 dark:hover:bg-surface-700',
                          isSelected && 'bg-primary-50 dark:bg-primary-900/20'
                        )}
                      >
                        <span className={isSelected ? 'font-medium text-primary-700 dark:text-primary-300' : ''}>
                          {option.label}
                        </span>
                        {option.count !== undefined && (
                          <span className="text-xs text-surface-400">{option.count}</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        {activeFilters.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear all
          </Button>
        )}
      </div>

      {/* Active filter tags */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => {
            const group = groups.find((g) => g.id === filter.groupId)
            const option = group?.options?.find((o) => o.id === filter.optionId)
            const label = option?.label || filter.value || ''

            return (
              <Badge
                key={`${filter.groupId}-${filter.optionId || filter.value}`}
                variant="default"
                className="pl-2 pr-1 gap-1"
              >
                <span className="text-surface-400 text-xs">{group?.label}:</span>
                {label}
                <button
                  onClick={() => removeFilter(filter.groupId, filter.optionId)}
                  className="ml-1 p-0.5 hover:bg-surface-300 dark:hover:bg-surface-600 rounded"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}

// Quick filter pills for common use cases
interface QuickFilterProps {
  options: { id: string; label: string; count?: number }[]
  selected: string[]
  onChange: (selected: string[]) => void
  className?: string
  multiple?: boolean
}

export function QuickFilter({ options, selected, onChange, className, multiple = false }: QuickFilterProps) {
  const handleClick = (id: string) => {
    if (multiple) {
      if (selected.includes(id)) {
        onChange(selected.filter((s) => s !== id))
      } else {
        onChange([...selected, id])
      }
    } else {
      onChange(selected.includes(id) ? [] : [id])
    }
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((option) => {
        const isSelected = selected.includes(option.id)
        return (
          <button
            key={option.id}
            onClick={() => handleClick(option.id)}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded-full border transition-colors',
              isSelected
                ? 'bg-primary-500 border-primary-500 text-white'
                : 'bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 hover:border-primary-300'
            )}
          >
            {option.label}
            {option.count !== undefined && (
              <span className={cn('ml-1.5', isSelected ? 'text-primary-200' : 'text-surface-400')}>
                ({option.count})
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
