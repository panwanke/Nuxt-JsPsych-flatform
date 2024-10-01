import { PrismaClient } from '@prisma/client'
// import prisma from "~/lib/prisma";
import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'

// const prisma = usePrismaClient()
const prisma = new PrismaClient()

const reviews = [
    { rating: 5, content: "Absolutely love it! The fit is perfect and the material is super soft." },
    { rating: 4, content: "Good quality, but I wish the color was a bit more vibrant." },
    { rating: 5, content: "Exceeded my expectations! Will definitely be buying more in different colors." },
    { rating: 3, content: "It’s comfortable, but the size runs a bit small." },
    { rating: 1, content: "Terrible fit. It was too tight and uncomfortable. Would not recommend." }
]
  
const products = [
    { name: 'Kreator men\'s T-Shirt',                   photoUrl: 'img/items/kreator.webp',          price: 19.99 },
    { name: 'Mayhem men\'s T-Shirt',                    photoUrl: 'img/items/mayhem.webp',           price: 19.99 }
]

async function main() {
    await prisma.user.upsert({
        where: {
            email: 'test@psyexp.com',
        },
        update: {

        },
        create: {
            email: 'test@psyexp.com',
            name: 'Test Account',
            role: 'admin',
            password: bcrypt.hashSync('password', 10),
            favorites: {
                create: {
                    items: {
                        create: []
                    }
                },
            },
            cart: {
                create: {
                    entries: {
                        create: []
                    }
                },
            },
        },
    })

    for (let i = 1; i <= 2; i++) {
        await prisma.user.create({
            data: {
                email: faker.internet.email(),
                name: faker.person.fullName(),
                password: bcrypt.hashSync('password', 10),
                photoUrl: "/img/avatar.webp",
                // photoUrl: faker.image.avatarGitHub(),
                favorites: {
                    create: {
                        items: {
                            create: []
                        }
                    },
                },
                cart: {
                    create: {
                        entries: {
                            create: []
                        }
                    },
                },
            },
        })
    }

    for (const product of products) {
        const n = faker.number.int({ min: 0, max: 2 })
        const template = () => {
            const index = faker.number.int({ min: 0, max: 1 })
        return {
                rating: reviews[index].rating,
                content: reviews[index].content,
                verified: faker.datatype.boolean(),
                authorId: faker.number.int({ min: 2, max: 100 })
            }
        }
        
        let itemReviews = []
        for (let j = 1; j <= n; j++)
            itemReviews.push(template() as any)
        
        await prisma.item.create({
            data: {
                name: product.name,
                description: `Officially licensed ${product.name} featuring an exclusive, high-quality design. Crafted with premium materials for superior comfort and durability.`,
                price: product.price,
                photoUrl: product.photoUrl,
                // reviews: {
                //     create: itemReviews
                // },
                sizes: (product as any).sizes ? (product as any).sizes : ['S', 'M', 'L', 'XL', '2XL']
            }
        })
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
    