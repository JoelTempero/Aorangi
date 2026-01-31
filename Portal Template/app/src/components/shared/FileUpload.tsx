import { useState, useRef, type DragEvent, type ChangeEvent } from 'react'
import { cn } from '../../utils/cn'
import { Upload, X, File, Image, FileText, Film, Music } from 'lucide-react'
import { Button } from '../ui'

interface FileUploadProps {
  onFiles: (files: File[]) => void
  accept?: string
  multiple?: boolean
  maxSize?: number // in bytes
  maxFiles?: number
  className?: string
  disabled?: boolean
}

export function FileUpload({
  onFiles,
  accept,
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 10,
  className,
  disabled
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled) return

    const files = Array.from(e.dataTransfer.files)
    validateAndSubmit(files)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files)
    validateAndSubmit(files)
  }

  const validateAndSubmit = (files: File[]) => {
    setError(null)

    // Check file count
    if (!multiple && files.length > 1) {
      setError('Only one file allowed')
      return
    }

    if (files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`)
      return
    }

    // Check file sizes
    const oversized = files.filter((f) => f.size > maxSize)
    if (oversized.length > 0) {
      setError(`File(s) exceed maximum size of ${formatBytes(maxSize)}`)
      return
    }

    onFiles(files)
  }

  const openFilePicker = () => {
    inputRef.current?.click()
  }

  return (
    <div className={className}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFilePicker}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all',
          isDragging
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-surface-300 dark:border-surface-700 hover:border-primary-400 dark:hover:border-primary-600',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />

        <Upload className={cn(
          'h-10 w-10 mx-auto mb-4 transition-colors',
          isDragging ? 'text-primary-500' : 'text-surface-400'
        )} />

        <p className="text-surface-600 dark:text-surface-400 mb-1">
          <span className="font-medium text-primary-600 dark:text-primary-400">
            Click to upload
          </span>
          {' '}or drag and drop
        </p>
        <p className="text-sm text-surface-500">
          {accept ? accept.replace(/\./g, '').toUpperCase() : 'Any file type'} up to {formatBytes(maxSize)}
        </p>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}

// File preview card
interface FilePreviewProps {
  file: File
  onRemove?: () => void
  uploadProgress?: number
  error?: string
  className?: string
}

export function FilePreview({ file, onRemove, uploadProgress, error, className }: FilePreviewProps) {
  const Icon = getFileIcon(file.type)

  return (
    <div className={cn(
      'flex items-center gap-3 p-3 bg-surface-50 dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700',
      error && 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20',
      className
    )}>
      <div className={cn(
        'p-2 rounded-lg',
        error
          ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
          : 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
      )}>
        <Icon className="h-5 w-5" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-surface-500">
          {formatBytes(file.size)}
          {error && <span className="text-red-600 ml-2">{error}</span>}
        </p>

        {uploadProgress !== undefined && uploadProgress < 100 && (
          <div className="mt-1 h-1 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>

      {onRemove && (
        <button
          onClick={onRemove}
          className="p-1 text-surface-400 hover:text-red-500 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

// Multi-file upload manager
interface FileUploadManagerProps {
  files: File[]
  onFilesChange: (files: File[]) => void
  accept?: string
  maxSize?: number
  maxFiles?: number
  className?: string
}

export function FileUploadManager({
  files,
  onFilesChange,
  accept,
  maxSize,
  maxFiles = 10,
  className
}: FileUploadManagerProps) {
  const handleNewFiles = (newFiles: File[]) => {
    const combined = [...files, ...newFiles].slice(0, maxFiles)
    onFilesChange(combined)
  }

  const handleRemove = (index: number) => {
    const updated = files.filter((_, i) => i !== index)
    onFilesChange(updated)
  }

  return (
    <div className={cn('space-y-4', className)}>
      <FileUpload
        onFiles={handleNewFiles}
        accept={accept}
        multiple
        maxSize={maxSize}
        maxFiles={maxFiles - files.length}
        disabled={files.length >= maxFiles}
      />

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <FilePreview
              key={`${file.name}-${index}`}
              file={file}
              onRemove={() => handleRemove(index)}
            />
          ))}
        </div>
      )}

      <p className="text-xs text-surface-500 text-center">
        {files.length} / {maxFiles} files selected
      </p>
    </div>
  )
}

// Helper functions
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) return Image
  if (mimeType.startsWith('video/')) return Film
  if (mimeType.startsWith('audio/')) return Music
  if (mimeType.includes('pdf')) return FileText
  return File
}
