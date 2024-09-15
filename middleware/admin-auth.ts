// 一个类似的 auth 中间件逻辑示例
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { getSession } = useAuth();
  const session = await getSession();
  // const userinfo = { 
  //     name: 'Test Account', 
  //     email: 'test@theheavyshop.com', 
  //     role: 'user' 
  // }
  // const session = { user: userinfo }
  console.log('admin-auth session', session)
  // console.log('redirect', !session)
  // console.log('redirect', Object.keys(session).length === 0)
  
  // 如果没有 session，则重定向到登录页
  if (Object.keys(session).length === 0 && to.path !== "/auth/admin-login") {
    return navigateTo('/auth/admin-login');
  }else{
    if(session?.user && session.user.role =="user"){
      console.log('detect a user log in dashboard', session)
      throw createError({
        statusCode: 500,
        statusMessage: 'User not allowed to access this page',
        message: 'User not allowed to access this page'
      })
    }
    else if (to.path !== "/dashboard"){
      return navigateTo('/dashboard');
    }
  }
});
