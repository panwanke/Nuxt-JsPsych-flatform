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
  // const session = {}
  console.log('admin-auth session', session, to?.path, from?.path)
  
  // 没有登陆信息，去 login 页面
  if (Object.keys(session).length === 0) {
    // 去 dashboard 等需要管理员权限的页面
    if (to.path !== "/auth/admin-login"){
      console.log('navigateTo /auth/admin-login')
      return navigateTo('/auth/admin-login');
    }
  }
  else{
    // 有登陆信息，且是用户权限
    if(session?.user && session.user.role ==="user"){
      console.log('detect a user log in dashboard', session)
      throw createError({
        statusCode: 500,
        statusMessage: 'User not allowed to access this page',
        message: 'User not allowed to access this page'
      })
    }
    // 有登陆信息，且是管理员
    else if (from.path !== "/dashboard"){
        console.log('navigateTo /dashboard')
        return navigateTo("/dashboard");
    }
    // else{
    //   console.log('Unexpected navigation scenario. Staying on current page.');
    // }
  }
});
