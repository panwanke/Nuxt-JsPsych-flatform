// server/api/userexp/index.delete.ts
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const { id, userId, experimentId } = await readBody(event);
  console.log("delete:",id, userId, experimentId)

  let deletedUserExperiment;

  // 根据 id 删除 UserExperiment 记录
  if (id) {
    deletedUserExperiment = await prisma.userExperiment.delete({
      where: { id: parseInt(id) },
    });
  } 
  // 根据 userId 和 experimentId 删除 UserExperiment 记录
  // else if (userId && experimentId) {
  //   deletedUserExperiment = await prisma.userExperiment.delete({
  //     where: { 
  //       userId: parseInt(userId), 
  //       experimentId: parseInt(experimentId)
  //     },
  //   });
  // } 
  else {
    return {
      error: true, 
      message: `id or userId and experimentId is required`
    }
  }

  return {
    error: false, 
    message: `remove userExp ${id} successfully`,
    data: deletedUserExperiment
  }
});
