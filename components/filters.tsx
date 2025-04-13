'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function ArtworkFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="flex gap-4">
      <Select
        onValueChange={(value) => handleFilterChange('category', value)}
        defaultValue={searchParams.get('category')?.toString()}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="painting">Painting</SelectItem>
          <SelectItem value="sculpture">Sculpture</SelectItem>
          <SelectItem value="photography">Photography</SelectItem>
          <SelectItem value="digital">Digital Art</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>

      <Select
        onValueChange={(value) => handleFilterChange('sort', value)}
        defaultValue={searchParams.get('sort')?.toString()}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
          <SelectItem value="price_asc">Price: Low to High</SelectItem>
          <SelectItem value="price_desc">Price: High to Low</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
} 