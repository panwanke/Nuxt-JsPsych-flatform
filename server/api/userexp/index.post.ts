import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
    // 获取请求体中的数据
    const { userId, experimentId} = await readBody(event);

    // 添加 UserExperiment记录
    try {
        const userExperiment = await prisma.userExperiment.create({
          data: {
            userId,
            experimentId,
          },
        });
    
        return { 
            success: true, 
            message: 'UserExperiment added successfully',
            data: userExperiment 
        };
    } catch (error) {
        return { 
            success: false, 
            error: "Error adding UserExperiment: ",
        };
    }
});
