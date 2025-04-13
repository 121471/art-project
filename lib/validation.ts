interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export function validateArtwork(data: {
  title: string
  description: string
  price: number
  category: string
}): ValidationResult {
  const errors: Record<string, string> = {}

  if (!data.title.trim()) {
    errors.title = 'Title is required'
  } else if (data.title.length > 100) {
    errors.title = 'Title must be less than 100 characters'
  }

  if (!data.description.trim()) {
    errors.description = 'Description is required'
  } else if (data.description.length > 1000) {
    errors.description = 'Description must be less than 1000 characters'
  }

  if (isNaN(data.price) || data.price < 0) {
    errors.price = 'Price must be a positive number'
  }

  if (!data.category) {
    errors.category = 'Category is required'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
} 