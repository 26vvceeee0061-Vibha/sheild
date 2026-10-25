// ─────────────────────────────────────────────────────────
// SHEild — ImgBB Image Upload Helper
//
// Get a free API key at: https://api.imgbb.com/
// Add it to your .env:  VITE_IMGBB_API_KEY=your_key_here
// ─────────────────────────────────────────────────────────

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY as string | undefined

export interface ImgBBResult {
  url: string          // direct image URL
  deleteUrl: string    // URL to delete the image later
  thumbUrl: string     // thumbnail URL
  size: number         // file size in bytes
}

/**
 * Upload a File object to ImgBB and return the hosted URL.
 */
export async function uploadImageToImgBB(file: File): Promise<ImgBBResult> {
  if (!IMGBB_API_KEY) {
    throw new Error('VITE_IMGBB_API_KEY is not set. Add it to your .env file.')
  }

  const formData = new FormData()
  formData.append('image', file)
  formData.append('name', `sheild_evidence_${Date.now()}`)

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
    { method: 'POST', body: formData }
  )

  if (!response.ok) {
    throw new Error(`ImgBB upload failed: ${response.statusText}`)
  }

  const data = await response.json()

  if (!data.success) {
    throw new Error(`ImgBB error: ${data.error?.message || 'Unknown error'}`)
  }

  return {
    url: data.data.url,
    deleteUrl: data.data.delete_url,
    thumbUrl: data.data.thumb?.url || data.data.url,
    size: data.data.size,
  }
}
