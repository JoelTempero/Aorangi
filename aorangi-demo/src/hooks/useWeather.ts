import { useQuery } from '@tanstack/react-query'

interface WeatherData {
  temperature: number
  description: string
  windSpeed: number
  windDirection: string
  humidity: number
  visibility: number
  icon: string
  flightConditions: 'excellent' | 'good' | 'marginal' | 'unfavorable'
}

// Simulated weather data for demo (Christchurch, NZ)
const fetchWeatherData = async (): Promise<WeatherData> => {
  // In production, this would call a real weather API
  // For demo, we'll simulate realistic Christchurch weather

  await new Promise((resolve) => setTimeout(resolve, 500))

  const conditions = [
    { temp: 18, desc: 'Partly cloudy', wind: 12, icon: '02d', flight: 'excellent' as const },
    { temp: 22, desc: 'Clear sky', wind: 8, icon: '01d', flight: 'excellent' as const },
    { temp: 15, desc: 'Light breeze', wind: 18, icon: '03d', flight: 'good' as const },
    { temp: 12, desc: 'Overcast', wind: 25, icon: '04d', flight: 'marginal' as const },
    { temp: 10, desc: 'Light rain', wind: 30, icon: '10d', flight: 'unfavorable' as const },
  ]

  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)]

  const windDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const windDirection = windDirections[Math.floor(Math.random() * windDirections.length)]

  return {
    temperature: randomCondition.temp,
    description: randomCondition.desc,
    windSpeed: randomCondition.wind,
    windDirection,
    humidity: Math.floor(Math.random() * 30) + 50,
    visibility: Math.floor(Math.random() * 5) + 8,
    icon: randomCondition.icon,
    flightConditions: randomCondition.flight,
  }
}

export function useWeather() {
  return useQuery({
    queryKey: ['weather', 'christchurch'],
    queryFn: fetchWeatherData,
    staleTime: 1000 * 60 * 30, // 30 minutes
    refetchInterval: 1000 * 60 * 30,
  })
}

export function getFlightConditionColor(condition: WeatherData['flightConditions']): string {
  switch (condition) {
    case 'excellent':
      return 'text-green-400'
    case 'good':
      return 'text-blue-400'
    case 'marginal':
      return 'text-yellow-400'
    case 'unfavorable':
      return 'text-red-400'
  }
}

export function getFlightConditionBg(condition: WeatherData['flightConditions']): string {
  switch (condition) {
    case 'excellent':
      return 'bg-green-400/10 border-green-400/30'
    case 'good':
      return 'bg-blue-400/10 border-blue-400/30'
    case 'marginal':
      return 'bg-yellow-400/10 border-yellow-400/30'
    case 'unfavorable':
      return 'bg-red-400/10 border-red-400/30'
  }
}
