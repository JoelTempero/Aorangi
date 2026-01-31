import { useState, useEffect, useCallback, useRef } from 'react'

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'KeyB',
  'KeyA',
]

export function useKonamiCode(): boolean {
  const [activated, setActivated] = useState(false)
  const sequenceRef = useRef<string[]>([])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.code
    const newSequence = [...sequenceRef.current, key].slice(-KONAMI_CODE.length)
    sequenceRef.current = newSequence

    if (newSequence.join(',') === KONAMI_CODE.join(',')) {
      setActivated(true)
      sequenceRef.current = []
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return activated
}
