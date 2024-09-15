import { getUserByEmail } from '~/server/utils'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)
    // const session = {user: {email: 'test@theheavyshop.com'}}
    console.log('session',session)
    const user = await getUserByEmail(session?.user?.email)
    console.log('user',user)
    return user
})
