import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  type UploadTaskSnapshot
} from 'firebase/storage'
import { storage } from './firebase'

export interface UploadProgress {
  progress: number
  bytesTransferred: number
  totalBytes: number
  state: 'running' | 'paused' | 'success' | 'canceled' | 'error'
}

export interface UploadResult {
  url: string
  path: string
  filename: string
  mimeType: string
  size: number
}

export const storageService = {
  /**
   * Upload a file to Firebase Storage with progress tracking
   */
  async uploadFile(
    file: File,
    path: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult> {
    const fileRef = ref(storage, path)
    const uploadTask = uploadBytesResumable(fileRef, file, {
      contentType: file.type
    })

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot: UploadTaskSnapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          onProgress?.({
            progress,
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes,
            state: snapshot.state as UploadProgress['state']
          })
        },
        (error) => {
          reject(error)
        },
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref)
            resolve({
              url,
              path,
              filename: file.name,
              mimeType: file.type,
              size: file.size
            })
          } catch (error) {
            reject(error)
          }
        }
      )
    })
  },

  /**
   * Upload multiple files concurrently
   */
  async uploadFiles(
    files: File[],
    basePath: string,
    onProgress?: (index: number, progress: UploadProgress) => void
  ): Promise<UploadResult[]> {
    const results = await Promise.all(
      files.map(async (file, index) => {
        const timestamp = Date.now()
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        const path = `${basePath}/${timestamp}_${safeName}`
        return this.uploadFile(file, path, (progress) => onProgress?.(index, progress))
      })
    )
    return results
  },

  /**
   * Delete a file from storage
   */
  async deleteFile(path: string): Promise<void> {
    const fileRef = ref(storage, path)
    await deleteObject(fileRef)
  },

  /**
   * Get download URL for a file
   */
  async getDownloadUrl(path: string): Promise<string> {
    const fileRef = ref(storage, path)
    return getDownloadURL(fileRef)
  },

  /**
   * Generate a content asset path
   */
  getContentAssetPath(eventId: string, contentId: string, filename: string): string {
    const timestamp = Date.now()
    const safeName = filename.replace(/[^a-zA-Z0-9.-]/g, '_')
    return `events/${eventId}/content/${contentId}/${timestamp}_${safeName}`
  },

  /**
   * Format bytes to human readable string
   */
  formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }
}
