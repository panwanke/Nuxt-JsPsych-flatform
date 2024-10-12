import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
    // 获取请求体中的数据
    const { userId, experimentId} = await readBody(event);

    // 添加 UserExperiment记录
    try{
        const userExperiment = await prisma.userExperiment.create({
            data: {
                userId:userId,
                experimentId:experimentId,
            },
        });

        return {
            data: userExperiment,
            error: false,
            message: `user ${userId} with exp ${experimentId} has been created successfully for id ${userExperiment.id}`
        }
    }catch(e){
        return {
            error: true,
            message: `fail to create user ${userId} with exp ${experimentId}`
        }
    }
});
