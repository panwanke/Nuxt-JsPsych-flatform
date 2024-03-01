import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    await prisma.user.upsert({
        where: { email: 'admin@theheavyshop.com' },
        update: {},
        create: {
            email: 'admin@theheavyshop.com',
            name: 'Admin',
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
                    items: {
                        create: []
                    }
                },
            },
        },
    })

    for (let i = 1; i <= 50; i++) {
        const a = faker.number.int({ min: 1, max: 5 }), b = faker.number.int({ min: 1, max: 5 })
        console.log((a + b) / 2)
        await prisma.item.create({
            data: {
                name: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                price: faker.number.float({ min: 10, max: 500, precision: 0.01 }),
                photoUrl: faker.image.url(),
                rating: (a + b) / 2,
                reviews: {
                    create: [
                        {
                            rating: a,
                            content: faker.lorem.paragraph(),
                            userId: 1
                        },
                        {
                            rating: b,
                            content: faker.lorem.paragraph(),
                            userId: 1
                        }
                    ]
                }
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
    