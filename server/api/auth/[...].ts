import GithubProvider from 'next-auth/providers/github'
import DiscordProvider from 'next-auth/providers/discord'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import { getByEmail } from '@/prisma/user'


import { NuxtAuthHandler } from '#auth'

export default NuxtAuthHandler({
    providers: [
        // @ts-expect-error
        GithubProvider.default({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET
        }),
        // @ts-expect-error
        DiscordProvider.default({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET
        }),
        // @ts-expect-error
        CredentialsProvider.default({
            name: 'Credentials',
            async authorize(credentials: any) {
                if (!credentials?.email)
                    throw createError({
                        statusCode: 400,
                        statusMessage: 'The email field is required.'
                    })
                else if (!credentials?.password)
                    throw createError({
                        statusCode: 400,
                        statusMessage: 'The password field is required.'
                    })
                else {
                    try {
                        const user = await getByEmail(credentials?.email)
                            if (bcrypt.compareSync(credentials?.password, user.password))
                                return user
                            else 
                                throw createError({
                                    statusCode: 400,
                                    statusMessage: 'Invalid credentials.'
                                })
                    }
                    catch (e) {
                        throw createError({
                            statusCode: 400,
                            statusMessage: 'Invalid credentials.'
                        })
                    }

                }
            }
        })
    ],
    pages: {
        signIn: '/auth/login'
    }
})
