import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: 'image',
          folder: 'art-project',
          transformation: [
            { width: 1200, height: 1200, crop: 'limit' }, // Limit maximum dimensions
            { quality: 'auto' }, // Automatic quality optimization
            { fetch_format: 'auto' }, // Automatic format selection
          ],
        },
        (error, result) => {
          if (error) {
            reject(error)
          } else if (result) {
            resolve(result.secure_url)
          }
        }
      )
      .end(buffer)
  })
}

export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    // Extract public_id from the URL
    const publicId = imageUrl.split('/').pop()?.split('.')[0]
    if (!publicId) {
      throw new Error('Invalid image URL')
    }

    await cloudinary.uploader.destroy(`art-project/${publicId}`)
  } catch (error) {
    console.error('Error deleting image:', error)
    throw error
  }
} 