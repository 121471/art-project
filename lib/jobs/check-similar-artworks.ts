import prisma from '@/lib/prisma'
import { sendNewArtworkEmail } from '@/lib/email'

export async function checkSimilarArtworks() {
  try {
    // Get all art preferences with user and category details
    const preferences = await prisma.artPreference.findMany({
      include: {
        user: true,
        category: {
          include: {
            parent: true,
          },
        },
      },
    })

    // For each preference
    for (const preference of preferences) {
      // Find new artworks in the preferred category from the last 24 hours
      const newArtworks = await prisma.artwork.findMany({
        where: {
          categoryId: preference.categoryId,
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
        include: {
          artist: true,
          category: {
            include: {
              parent: true,
            },
          },
        },
      })

      // For each new artwork, create a notification and send an email
      for (const artwork of newArtworks) {
        const existingNotification = await prisma.notification.findFirst({
          where: {
            userId: preference.userId,
            artworkId: artwork.id,
            type: 'NEW_SIMILAR_ARTWORK',
          },
        })

        if (!existingNotification) {
          // Create notification in database
          await prisma.notification.create({
            data: {
              userId: preference.userId,
              artworkId: artwork.id,
              type: 'NEW_SIMILAR_ARTWORK',
            },
          })

          // Send email notification
          const categoryName = artwork.category.parent
            ? `${artwork.category.parent.name} - ${artwork.category.name}`
            : artwork.category.name

          await sendNewArtworkEmail({
            userEmail: preference.user.email || '',
            userName: preference.user.name,
            artworkTitle: artwork.title,
            artworkImage: artwork.imageUrl,
            artworkUrl: `${process.env.NEXT_PUBLIC_APP_URL}/artwork/${artwork.id}`,
            artistName: artwork.artist.name,
            category: categoryName,
          })

          console.log(
            `Notification sent to ${preference.user.email} for artwork: ${artwork.title}`
          )
        }
      }
    }
  } catch (error) {
    console.error('Error checking similar artworks:', error)
  }
} 