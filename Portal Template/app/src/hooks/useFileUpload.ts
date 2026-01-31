import { useState, useCallback } from 'react'
import { storageService, type UploadProgress, type UploadResult } from '../services/storage.service'

interface FileUploadState {
  uploading: boolean
  progress: number
  error: string | null
  results: UploadResult[]
}

interface UseFileUploadOptions {
  basePath: string
  onSuccess?: (results: UploadResult[]) => void
  onError?: (error: Error) => void
}

export function useFileUpload({ basePath, onSuccess, onError }: UseFileUploadOptions) {
  const [state, setState] = useState<FileUploadState>({
    uploading: false,
    progress: 0,
    error: null,
    results: []
  })

  const [fileProgress, setFileProgress] = useState<Record<number, UploadProgress>>({})

  const upload = useCallback(async (files: File[]) => {
    if (files.length === 0) return []

    setState((prev) => ({
      ...prev,
      uploading: true,
      progress: 0,
      error: null,
      results: []
    }))
    setFileProgress({})

    try {
      const results = await storageService.uploadFiles(
        files,
        basePath,
        (index, progress) => {
          setFileProgress((prev) => ({
            ...prev,
            [index]: progress
          }))

          // Calculate overall progress
          const totalProgress = Object.values({ ...fileProgress, [index]: progress })
            .reduce((sum, p) => sum + p.progress, 0) / files.length

          setState((prev) => ({
            ...prev,
            progress: totalProgress
          }))
        }
      )

      setState((prev) => ({
        ...prev,
        uploading: false,
        progress: 100,
        results
      }))

      onSuccess?.(results)
      return results
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      setState((prev) => ({
        ...prev,
        uploading: false,
        error: errorMessage
      }))
      onError?.(error instanceof Error ? error : new Error(errorMessage))
      return []
    }
  }, [basePath, fileProgress, onSuccess, onError])

  const uploadSingle = useCallback(async (file: File, customPath?: string) => {
    setState((prev) => ({
      ...prev,
      uploading: true,
      progress: 0,
      error: null
    }))

    try {
      const path = customPath || `${basePath}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const result = await storageService.uploadFile(file, path, (progress) => {
        setState((prev) => ({
          ...prev,
          progress: progress.progress
        }))
      })

      setState((prev) => ({
        ...prev,
        uploading: false,
        progress: 100,
        results: [result]
      }))

      onSuccess?.([result])
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      setState((prev) => ({
        ...prev,
        uploading: false,
        error: errorMessage
      }))
      onError?.(error instanceof Error ? error : new Error(errorMessage))
      return null
    }
  }, [basePath, onSuccess, onError])

  const reset = useCallback(() => {
    setState({
      uploading: false,
      progress: 0,
      error: null,
      results: []
    })
    setFileProgress({})
  }, [])

  return {
    ...state,
    fileProgress,
    upload,
    uploadSingle,
    reset
  }
}
