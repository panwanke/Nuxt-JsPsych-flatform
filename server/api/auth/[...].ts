import crypto from 'crypto'
import bcrypt from 'bcrypt'
import prisma from '~/lib/prisma'

import { NuxtAuthHandler } from '#auth'

// import GithubProvider from 'next-auth/providers/github'
// import DiscordProvider from 'next-auth/providers/discord'
import CredentialsProvider from 'next-auth/providers/credentials'

async function getUserByEmail(email: string | null | undefined) {
    try {
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                email: email as string
            }
        })
        return user
    }
    catch(e) { 
        throw createError({
            statusCode: 500,
            statusMessage: 'We couldn\'t find that account.'
        })
    }
}

async function createUser(data: any) {
    await prisma.user.create({
        data: {
            name: data.name,
            photoUrl: data.image,
            email: data.email,
            password: bcrypt.hashSync(crypto.randomBytes(32).toString('hex'), 10),
        }
    })
}

export default NuxtAuthHandler({
    secret: process.env.AUTH_SECRET,
    callbacks: {
        async signIn({ user, account, profile }) {
            try {
                // console.log('user3',user, account, profile)
                await getUserByEmail(user.email)
            }
            catch(e) {
                if (account?.provider !== 'credentials') {
                    if (account?.provider === 'discord')
                        user.name = (profile as any).global_name
                    await createUser(user)
                }
            }

            return true
        },
        async redirect({ url, baseUrl }) {
            // console.log('redirect to', url)
            return url.replace(':3001', ':3000');
        },
        async jwt({ token, user }) {
            if (user) {
                // 确保 user.role 存在，并且是合法的值
                token.role = user.role || 'user';  // 默认赋值为 'user'，如果角色未定义
            }
            return token;
        },
        async session({ session, token }) {
            // 将 JWT 中的 role 传递到 session 中
            session.user.role = (token.role as 'admin' | 'manager' | 'user') || 'user';  // 默认值为 'user'
            return session;
        }
    },
    providers: [
        // // @ts-expect-error
        // GithubProvider.default({
        //     clientId: process.env.GITHUB_CLIENT_ID,
        //     clientSecret: process.env.GITHUB_CLIENT_SECRET
        // }),
        // // @ts-expect-error
        // DiscordProvider.default({
        //     clientId: process.env.DISCORD_CLIENT_ID,
        //     clientSecret: process.env.DISCORD_CLIENT_SECRET
        // }),
        // @ts-expect-error
        CredentialsProvider.default({
            name: 'Credentials',
            // credentials: {
            //     email: { label: 'email', type: 'text' },
            //     password: { label: 'password', type: 'password' },
            //     role: { label: 'role', type: 'text' }
            // },            
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
                        // console.log('user1', credentials?.email)
                        const user = await getUserByEmail(credentials?.email)
                        // console.log('user2',user, credentials?.email)
                        if (bcrypt.compareSync(credentials?.password, user.password as string)) {
                            if (credentials.role === "user" || credentials.role === user.role) {
                              return user;
                            } else {
                              throw createError({
                                statusCode: 500,
                                statusMessage: 'You are not authorized to access this page.',
                              });
                            }
                          } else {
                            throw createError({
                              statusCode: 500,
                              statusMessage: 'Your password was incorrect.',
                            });
                          }
                    }
                    catch(e) {
                        throw createError({
                            statusCode: 500,
                            statusMessage: 'These credentials don\'t match our records.'
                        })
                    }
                }
            }
        })
    ],
    pages: {
        signIn: '/auth/login',
        // signOut: '/',
        newUser: '/',
        error: '/error',
        verifyRequest: '/'
    }
})