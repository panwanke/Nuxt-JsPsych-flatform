import { getUserByEmail } from '~/server/utils'
import { getServerSession } from '#auth'
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
    // 获取请求体中的数据
    const { id, userId, experimentId, isDone, DeviceInfo, expData } = await readBody(event);
  
    // 检查是否提供了必要的ID
    if (!id) {
    throw createError({
        statusCode: 400,
        statusMessage: 'ID is required',
    });
    }

    // 更新UserExperiment记录
    const updatedUserExperiment = await prisma.userExperiment.update({
    where: {
        id: Number(id),
    },
    data: {
        userId: userId ? Number(userId) : undefined,
        experimentId: experimentId ? Number(experimentId) : undefined,
        isDone: isDone !== undefined ? isDone : undefined,
        DeviceInfo: DeviceInfo !== undefined ? DeviceInfo : undefined,
        expData: expData !== undefined ? expData : undefined,
    },
    });

    // 返回更新后的记录
    return {
    message: 'UserExperiment updated successfully',
    data: updatedUserExperiment,
    };
});

// export default defineEventHandler(async (event) => {
//     const session = await getServerSession(event)
//     const user = await getUserByEmail(session?.user?.email)

//     const query = getQuery(event)
//     // let ids = query.ids
//     let experimentId = query.experimentId
//     let userId = query.userID
//     // if (!Array.isArray(ids))
//     //     ids = Array.of(ids)
    
//     await prisma.userExperiment.update({
//         where: {
//             userId: userId as number,
//             experimentId: experimentId as number
//         },
//         data: {
//             items: { 
//                 connect: ids.map((id: any) => { 
//                     return { 
//                         id: id 
//                     } 
//                 })
//             }
//         }
//     })

//     return { 
//         message: 'Items added to favorites successfully!' 
//     }
// })
