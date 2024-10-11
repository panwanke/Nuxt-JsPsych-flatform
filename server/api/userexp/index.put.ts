import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {

    const body = await readBody(event);
    const { id, updateData } = body;;
    console.log('updateData',updateData)

    // 更新 UserExperiment记录
    try {
        const userExperiment = await prisma.userExperiment.update({
            where: {
                id: id
            },
            data: updateData
        });
    
        return { 
            error: false, 
            message: 'UserExperiment updated successfully',
            data: userExperiment 
        };
    } catch (error:any) {
        console.error('update user exp error', error);
        return { 
            error: true, 
            message: `Error adding UserExperiment: ${error}`,
        };
    }

})
