import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface ArtworkEmailProps {
  userEmail: string
  userName: string | null
  artworkTitle: string
  artworkImage: string
  artworkUrl: string
  artistName: string | null
  category: string
}

export async function sendNewArtworkEmail({
  userEmail,
  userName,
  artworkTitle,
  artworkImage,
  artworkUrl,
  artistName,
  category,
}: ArtworkEmailProps) {
  try {
    await resend.emails.send({
      from: 'Art Gallery <notifications@yourdomain.com>',
      to: userEmail,
      subject: `New ${category} Artwork: ${artworkTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">New Artwork You Might Like</h1>
          <p>Hi ${userName || 'there'},</p>
          <p>We found a new artwork that matches your interests in ${category}:</p>
          
          <div style="margin: 24px 0;">
            <img src="${artworkImage}" alt="${artworkTitle}" style="max-width: 100%; border-radius: 8px;" />
          </div>
          
          <h2 style="color: #1a1a1a;">${artworkTitle}</h2>
          <p>By ${artistName || 'Unknown Artist'}</p>
          
          <a href="${artworkUrl}" style="
            display: inline-block;
            background-color: #2563eb;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 16px;
          ">
            View Artwork
          </a>
          
          <p style="margin-top: 32px; color: #666;">
            You're receiving this email because you've subscribed to notifications for ${category} artworks.
            <br>
            <a href="[unsubscribe_url]" style="color: #2563eb;">Manage your preferences</a>
          </p>
        </div>
      `,
    })
  } catch (error) {
    console.error('Error sending email:', error)
  }
} 