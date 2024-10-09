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
            success: true, 
            message: 'UserExperiment updated successfully',
            data: userExperiment 
        };
    } catch (error) {
        return { 
            success: false, 
            error: "Error updating UserExperiment: ",
        };
    }

})
