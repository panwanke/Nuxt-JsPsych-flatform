import { PrismaClient } from '@prisma/client'
// import prisma from "~/lib/prisma";
import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'

// const prisma = usePrismaClient()
const prisma = new PrismaClient()


async function main() {
    // 清除数据库中的现有数据
    // await prisma.user.deleteMany({});
    // await prisma.experiment.deleteMany({});
    // await prisma.userExperiment.deleteMany({});
    // await prisma.review.deleteMany({});

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
            institution: 'Test Institution',
            age: 20,
            gender: 'male',
        },
    })
    
    enum Gender {
        male = 'male',
        female = 'female',
        other = 'other',
      }
    // 创建用户
    const users = Array.from({ length: 10 }, () => ({
        name: faker.system.fileName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: 'user',
        institution: faker.company.name(),
        age: faker.number.int({ min: 18, max: 65 }),
        gender: faker.helpers.arrayElement(Object.values(Gender)),
    }));
    
    const createdUsers = await prisma.user.createMany({ data: users });
    
    // 创建实验
    const experiments = Array.from({ length: 5 }, () => ({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        // photoUrl: faker.image.imageUrl(),
        photoUrl: "/img/avatar.webp",
        price: parseFloat(faker.commerce.price()),
        slug: faker.helpers.slugify(faker.commerce.product()),
        remuneration: parseFloat(faker.finance.amount()),
        startDate: faker.date.past(),
        endDate: faker.date.future(),
    }));
    
    const createdExperiments = await prisma.experiment.createMany({ data: experiments });
    
    // 创建用户和实验的关联
    const userExperiments = createdUsers.count
        .toString()
        .split('')
        .map((_, index) => ({
        userId: index + 1,
        experimentId: faker.number.int({ min: 1, max: createdExperiments.count }),
        isAdded: faker.datatype.boolean(),
        isDone: faker.datatype.boolean(),
        }));
    
    await prisma.userExperiment.createMany({ data: userExperiments });
    
    // 创建评论
    const reviews = createdUsers.count
        .toString()
        .split('')
        .map((_, index) => ({
        rating: faker.number.int({ min: 1, max: 5 }),
        content: faker.lorem.sentence(),
        verified: faker.datatype.boolean(),
        experimentId: faker.number.int({ min: 1, max: createdExperiments.count }),
        authorId: index + 1,
        }));
    
    await prisma.review.createMany({ data: reviews });
    
    console.log('Seeding complete.');
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
    