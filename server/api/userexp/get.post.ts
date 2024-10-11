import useQuery from '~/composables/useQuery';
import prisma from '~/lib/prisma'


export default defineEventHandler(async (event) => {
    // 从请求中获取 id 参数
    const { id } = useQuery(event);

    // 检查 id 是否存在并且是数字
    if (!id || isNaN(parseInt(id))) {
        return {
            error: true,
            message: `Invalid or missing ID ${id}`,
        };
    }

    try {
        // 使用 Prisma 查询 UserExperiment 记录
        const userExperiment = await prisma.userExperiment.findUnique({
            where: {
                id: parseInt(id),
            },
        });

        // 如果没有找到记录，则返回 404 错误
        if (!userExperiment) {
            return {
                error: true,
                message: `ID ${id} UserExperiment not found`,
            };
        }

        // 返回找到的 UserExperiment 记录
        return {
            error: false,
            message: `ID ${id} UserExperiment not found`,
            data: userExperiment,
        };
    } catch (error: any) {
        // 处理其他错误
        console.error(error);
        return {
            error: true,
            message: `UserExperiment error: ${error.message}`,
        };
    }
});