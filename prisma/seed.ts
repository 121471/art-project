import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categories = [
  {
    name: 'Painting',
    slug: 'painting',
    subcategories: [
      { name: 'Oil', slug: 'oil-painting' },
      { name: 'Acrylic', slug: 'acrylic-painting' },
      { name: 'Watercolor', slug: 'watercolor-painting' },
      { name: 'Mixed Media', slug: 'mixed-media-painting' },
      { name: 'Digital Painting', slug: 'digital-painting' },
      { name: 'Abstract', slug: 'abstract-painting' },
      { name: 'Portrait', slug: 'portrait-painting' },
      { name: 'Landscape', slug: 'landscape-painting' },
    ],
  },
  {
    name: 'Sculpture',
    slug: 'sculpture',
    subcategories: [
      { name: 'Bronze', slug: 'bronze-sculpture' },
      { name: 'Stone', slug: 'stone-sculpture' },
      { name: 'Wood', slug: 'wood-sculpture' },
      { name: 'Metal', slug: 'metal-sculpture' },
      { name: 'Ceramic', slug: 'ceramic-sculpture' },
      { name: 'Glass', slug: 'glass-sculpture' },
      { name: 'Installation', slug: 'installation-sculpture' },
      { name: 'Kinetic', slug: 'kinetic-sculpture' },
    ],
  },
  {
    name: 'Photography',
    slug: 'photography',
    subcategories: [
      { name: 'Portrait', slug: 'portrait-photography' },
      { name: 'Landscape', slug: 'landscape-photography' },
      { name: 'Street', slug: 'street-photography' },
      { name: 'Fine Art', slug: 'fine-art-photography' },
      { name: 'Documentary', slug: 'documentary-photography' },
      { name: 'Architectural', slug: 'architectural-photography' },
      { name: 'Fashion', slug: 'fashion-photography' },
      { name: 'Abstract', slug: 'abstract-photography' },
    ],
  },
  {
    name: 'Digital Art',
    slug: 'digital-art',
    subcategories: [
      { name: '3D Art', slug: '3d-art' },
      { name: 'Digital Illustration', slug: 'digital-illustration' },
      { name: 'NFT Art', slug: 'nft-art' },
      { name: 'Motion Graphics', slug: 'motion-graphics' },
      { name: 'Generative Art', slug: 'generative-art' },
      { name: 'Digital Collage', slug: 'digital-collage' },
    ],
  },
  {
    name: 'Printmaking',
    slug: 'printmaking',
    subcategories: [
      { name: 'Lithography', slug: 'lithography' },
      { name: 'Etching', slug: 'etching' },
      { name: 'Screen Printing', slug: 'screen-printing' },
      { name: 'Woodcut', slug: 'woodcut' },
      { name: 'Linocut', slug: 'linocut' },
      { name: 'Monotype', slug: 'monotype' },
    ],
  },
  {
    name: 'Textile Art',
    slug: 'textile-art',
    subcategories: [
      { name: 'Weaving', slug: 'weaving' },
      { name: 'Embroidery', slug: 'embroidery' },
      { name: 'Quilting', slug: 'quilting' },
      { name: 'Fiber Art', slug: 'fiber-art' },
      { name: 'Tapestry', slug: 'tapestry' },
      { name: 'Batik', slug: 'batik' },
    ],
  },
  {
    name: 'African Art',
    slug: 'african-art',
    subcategories: [
      { name: 'Masks', slug: 'african-masks' },
      { name: 'Sculptures', slug: 'african-sculptures' },
      { name: 'Textiles', slug: 'african-textiles' },
      { name: 'Paintings', slug: 'african-paintings' },
      { name: 'Beadwork', slug: 'african-beadwork' },
      { name: 'Contemporary African', slug: 'contemporary-african' },
      { name: 'Traditional', slug: 'traditional-african' },
      { name: 'Tribal Art', slug: 'tribal-art' },
    ],
  },
  {
    name: 'Cultural Art',
    slug: 'cultural-art',
    subcategories: [
      { name: 'Indigenous Art', slug: 'indigenous-art' },
      { name: 'Folk Art', slug: 'folk-art' },
      { name: 'Ceremonial Art', slug: 'ceremonial-art' },
      { name: 'Religious Art', slug: 'religious-art' },
      { name: 'Traditional Crafts', slug: 'traditional-crafts' },
    ],
  },
]

async function main() {
  // Clear existing categories
  await prisma.category.deleteMany()

  // Create categories and subcategories
  for (const category of categories) {
    const parentCategory = await prisma.category.create({
      data: {
        name: category.name,
        slug: category.slug,
      },
    })

    for (const subcategory of category.subcategories) {
      await prisma.category.create({
        data: {
          name: subcategory.name,
          slug: subcategory.slug,
          parentId: parentCategory.id,
        },
      })
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 