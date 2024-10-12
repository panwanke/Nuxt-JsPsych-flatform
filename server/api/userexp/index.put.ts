import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {

    // 获取请求体中的数据
    const { id, ...updateData } = await readBody(event)
    console.log('updateData',updateData)

    // 检查是否提供了必要的id
    if (!id) {
        throw createError({
        statusCode: 400,
        statusMessage: 'UserExperiment ID is required'
        })
    }

    try {
        // 使用Prisma更新UserExperiment记录
        const updatedUserExperiment = await prisma.userExperiment.update({
        where: {
            id: parseInt(id)
        },
        data: {
            ...updateData, 
            updatedAt: new Date(), 
        }
        })

        // 返回更新后的记录
        return {
            error: false, 
            message: `UserExperiment with id ${id} update successfully.`,
            data: updatedUserExperiment
        }
    } catch (error) {
        // 处理错误
        return {
            error: true, 
            message: `An error occurred while updating UserExperiment with id ${id}`
        }
    }
})
