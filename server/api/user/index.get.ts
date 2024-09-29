import { getUserByEmail } from '~/server/utils'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)
    // const session = {user: {email: 'test@psyexp.com'}}
    // console.log('get session',session)
    const user = await getUserByEmail(session?.user?.email)
    // console.log('get user',user)
    return user
})
