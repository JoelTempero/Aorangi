import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type WidgetType =
  | 'tasks'
  | 'schedule'
  | 'announcements'
  | 'countdown'
  | 'content'
  | 'team'
  | 'achievements'
  | 'quickActions'

export interface WidgetConfig {
  id: string
  type: WidgetType
  title: string
  enabled: boolean
  order: number
  size: 'small' | 'medium' | 'large'
}

interface WidgetState {
  widgets: WidgetConfig[]
  setWidgets: (widgets: WidgetConfig[]) => void
  toggleWidget: (id: string) => void
  reorderWidgets: (sourceIndex: number, destinationIndex: number) => void
  resetToDefaults: () => void
}

const DEFAULT_WIDGETS: WidgetConfig[] = [
  { id: 'tasks', type: 'tasks', title: 'My Tasks', enabled: true, order: 0, size: 'medium' },
  { id: 'schedule', type: 'schedule', title: "Today's Schedule", enabled: true, order: 1, size: 'medium' },
  { id: 'announcements', type: 'announcements', title: 'Announcements', enabled: true, order: 2, size: 'medium' },
  { id: 'countdown', type: 'countdown', title: 'Camp Countdown', enabled: true, order: 3, size: 'small' },
  { id: 'content', type: 'content', title: 'Recent Content', enabled: true, order: 4, size: 'medium' },
  { id: 'team', type: 'team', title: 'Team Status', enabled: false, order: 5, size: 'small' },
  { id: 'achievements', type: 'achievements', title: 'Achievements', enabled: false, order: 6, size: 'small' },
  { id: 'quickActions', type: 'quickActions', title: 'Quick Actions', enabled: true, order: 7, size: 'small' }
]

export const useWidgetStore = create<WidgetState>()(
  persist(
    (set) => ({
      widgets: DEFAULT_WIDGETS,

      setWidgets: (widgets) => set({ widgets }),

      toggleWidget: (id) =>
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, enabled: !w.enabled } : w
          )
        })),

      reorderWidgets: (sourceIndex, destinationIndex) =>
        set((state) => {
          const enabledWidgets = state.widgets
            .filter((w) => w.enabled)
            .sort((a, b) => a.order - b.order)

          const [removed] = enabledWidgets.splice(sourceIndex, 1)
          enabledWidgets.splice(destinationIndex, 0, removed)

          // Update order for enabled widgets
          const newWidgets = state.widgets.map((widget) => {
            const enabledIndex = enabledWidgets.findIndex((w) => w.id === widget.id)
            if (enabledIndex !== -1) {
              return { ...widget, order: enabledIndex }
            }
            return widget
          })

          return { widgets: newWidgets }
        }),

      resetToDefaults: () => set({ widgets: DEFAULT_WIDGETS })
    }),
    {
      name: 'ec-widget-layout'
    }
  )
)
