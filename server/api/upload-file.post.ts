import { getUserByEmail } from '~/server/utils'
import { getServerSession } from '#auth'
import { put } from '@vercel/blob'

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)
    const user = await getUserByEmail(session?.user?.email)

    const files = await readMultipartFormData(event)

    if (files?.length) {
        const file = files[0]

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type as string))
            throw createError({
                statusCode: 400,
                statusMessage: 'The file type is not supported.'
            })
        
            // 读取环境变量中的 Vercel Blob 存储令牌
        const token = process.env.VERCEL_BLOB_TOKEN

        // 确保令牌存在
        if (!token) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Blob storage token is not configured.'
            })
        }

        const { url } = await put(
            `avatars/${user?.id}.png`, 
            file.data, 
            { 
                access: 'public',
                token: token

            }
        )

        return {
            message: 'File uploaded succesfully!',
            path: url
        }
    }
})
