import { PrismaClient } from '@prisma/client'
// import prisma from "~/lib/prisma";
import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'

// const prisma = usePrismaClient()
const prisma = new PrismaClient()


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
            institution: 'Test Institution',
            age: 20,
            gender: 'male',
        },
    })
    
    // 创建用户
    const users = Array.from({ length: 30 }, () => ({
        name: faker.system.fileName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: 'user',
        institution: faker.company.name(),
        age: faker.number.int({ min: 18, max: 65 }),
        gender: "female",
    }));
    
    const createdUsers = await prisma.user.createMany({ data: users });
    
    // 创建实验
    // await prisma.experiment.upsert({
    //     where: {
    //       id: 1, 
    //     },
    //     create: {
    //         name: "知觉决策任务",
    //         description: "匹配任务1, 包含两个 session，一个session判断中间刺激的属性，另一个session判断中间刺激和周边刺激的匹配关系。",
    //         photoUrl: "/img/items/matching-task1.webp",
    //         slug: "matching-task1", // 由于我们需要固定的 slug，我们可以直接使用实验任务的名称
    //         remuneration: 10,
    //         startDate: faker.date.past(),
    //         endDate: faker.date.future(),
    //     },
    //     update: {},
    //   });
    // const experiments = Array.from({ length: 5 }, () => ({
    //     name: faker.commerce.productName(),
    //     description: faker.commerce.productDescription(),
    //     // photoUrl: faker.image.imageUrl(),
    //     photoUrl: "/img/items/slipknot_cap.webp",
    //     slug: faker.helpers.slugify(faker.commerce.product()),
    //     remuneration: parseFloat(faker.finance.amount()),
    //     startDate: faker.date.past(),
    //     endDate: faker.date.future(),
    // }));
    const experiments = [{
        name: "知觉决策任务",
        description: "匹配任务1, 包含两个 session，一个session判断中间刺激的属性，另一个session判断中间刺激和周边刺激的匹配关系。",
        photoUrl: "/img/items/matching-task1.webp",
        slug: "matching-task1", // 由于我们需要固定的 slug，我们可以直接使用实验任务的名称
        remuneration: 10,
        startDate: faker.date.past(),
        endDate: faker.date.future(),
    }]
    
    const createdExperiments = await prisma.experiment.createMany({ data: experiments });
    
    // 创建用户和实验的关联
    // const userExperiments = createdUsers.count.toString().split('').flatMap((_: any, index: number) => {
    //     // 每个用户随机参与 1 到 3 个实验
    //     const experimentsForUser = faker.helpers.arrayElements(
    //         Array.from({ length: createdExperiments.count }, (_, i) => i + 1), // 实验 ID 列表
    //         faker.number.int({ min: 1, max: 3 }) // 随机选择 1 到 3 个实验
    //     );
    
    //     // 为该用户生成 userExperiment 关联数据
    //     return experimentsForUser.map(experimentId => ({
    //         userId: index + 1, // 用户 ID
    //         experimentId, // 实验 ID
    //         isDone: faker.datatype.boolean(), // 随机是否已完成实验
    //         DeviceInfo: JSON.stringify({
    //             browser: faker.internet.userAgent(),
    //             ip: faker.internet.ip(),
    //     }), // 随机生成浏览器信息
    //     expData: JSON.stringify({
    //         score: faker.number.int({ min: 0, max: 100 }), // 随机生成实验数据
    //         duration: faker.number.int({ min: 5, max: 60 }), // 随机生成实验时长（分钟）
    //     }),
    //     }));
    // });
    
    // await prisma.userExperiment.createMany({ data: userExperiments });
    
    // 创建评论
    // const reviews = createdUsers.count
    //     .toString()
    //     .split('')
    //     .map((_: any, index: number) => ({
    //         rating: faker.number.int({ min: 1, max: 5 }),
    //         content: faker.lorem.sentence(),
    //         verified: faker.datatype.boolean(),
    //         experimentId: faker.number.int({ min: 1, max: createdExperiments.count }),
    //         authorId: index + 1,
    //     }));
    
    // await prisma.review.createMany({ data: reviews });
    
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
    