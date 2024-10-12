import useQuery from '~/composables/useQuery';
import prisma from '~/lib/prisma'


export default defineEventHandler(async (event) => {
    // 从请求中获取 id, userId, 和 experimentId 参数
    const { id, userId, experimentId } = getQuery(event) as { id?: string, userId?: string, experimentId?: string };

    let userExperiment
    try {
        // 根据 id 查询
        if (id) {
            if (isNaN(parseInt(id))) {
                return {
                    error: true,
                    message: `Invalid ID ${id}`,
                };
            }
            userExperiment = await prisma.userExperiment.findUnique({
                where: {
                    id: parseInt(id),
                },
            });

            if (!userExperiment) {
                return {
                    error: true,
                    message: `UserExperiment with ID ${id} not found`,
                };
            }

            return {
                error: false,
                data: userExperiment,
            };
        }
        // 根据 userId 和 experimentId 联合查询
        else if (userId && experimentId) {
            if (isNaN(parseInt(userId)) || isNaN(parseInt(experimentId))) {
                return {
                    error: true,
                    message: `Invalid User ID ${userId} or Experiment ID${experimentId}`,
                };
            }
            userExperiment = await prisma.userExperiment.findUnique({
                where: {
                    userId_experimentId: {
                        userId: parseInt(userId),
                        experimentId: parseInt(experimentId),
                    },
                },
            });

            if (!userExperiment) {
                return {
                    error: true,
                    message: `UserExperiment with User ID ${userId} and Experiment ID${experimentId} not found`,
                };
            }

            return {
                error: false,
                message: `UserExperiment id ${userExperiment.id} found from User ID ${userId} and Experiment ID${experimentId}`,
                data: userExperiment,
            };
        }
        // 如果没有提供任何参数
        else {
            return {
                error: true,
                message: 'No ID or User ID and Experiment ID provided',
            };
        }
    } catch (error: any) {
        // 处理其他错误
        console.error(error);
        return {
            error: true,
            message: `An unknowed error occurred: ${error.message}`,
        };
    }
});
