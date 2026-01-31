import { Cloud, Wind, Droplets, Eye, Plane } from 'lucide-react'
import { useWeather, getFlightConditionColor, getFlightConditionBg } from '@/hooks/useWeather'
import { cn } from '@/lib/utils'

export function WeatherWidget() {
  const { data, isLoading, error } = useWeather()

  if (isLoading) {
    return (
      <div className="bg-dark-card/80 backdrop-blur-xl border border-dark-border rounded-xl p-4 animate-pulse">
        <div className="h-4 bg-dark-lighter rounded w-32 mb-3"></div>
        <div className="h-8 bg-dark-lighter rounded w-20 mb-2"></div>
        <div className="h-3 bg-dark-lighter rounded w-24"></div>
      </div>
    )
  }

  if (error || !data) {
    return null
  }

  return (
    <div className="bg-dark-card/80 backdrop-blur-xl border border-dark-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/60 text-xs font-medium uppercase tracking-wider">
          Christchurch Weather
        </h3>
        <div
          className={cn(
            'px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 border',
            getFlightConditionBg(data.flightConditions)
          )}
        >
          <Plane className={cn('w-3 h-3', getFlightConditionColor(data.flightConditions))} />
          <span className={getFlightConditionColor(data.flightConditions)}>
            {data.flightConditions.charAt(0).toUpperCase() + data.flightConditions.slice(1)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-2">
          <Cloud className="w-8 h-8 text-accent-blue" />
          <div>
            <span className="text-2xl font-bold text-white">{data.temperature}°C</span>
            <p className="text-white/60 text-xs">{data.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-white/60">
          <Wind className="w-3.5 h-3.5" />
          <span>{data.windSpeed} km/h {data.windDirection}</span>
        </div>
        <div className="flex items-center gap-1.5 text-white/60">
          <Droplets className="w-3.5 h-3.5" />
          <span>{data.humidity}%</span>
        </div>
        <div className="flex items-center gap-1.5 text-white/60">
          <Eye className="w-3.5 h-3.5" />
          <span>{data.visibility} km</span>
        </div>
      </div>
    </div>
  )
}
