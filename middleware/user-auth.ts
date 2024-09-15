// 一个类似的 auth 中间件逻辑示例
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { getSession } = useAuth();
  const session = await getSession();
  console.log('user-auth session', session, to?.path, from?.path)
  // console.log('redirect', !session)
  // console.log('redirect', Object.keys(session).length === 0)
  
  // 没有登陆信息，去 login 页面
  if (Object.keys(session).length === 0 && to.path !== "/auth/login") {
      navigateTo('/auth/login');
  }
  // 有登陆信息，且目标不是 login 页面
  else if (Object.keys(session).length > 0 && to.path !== "/auth/login") {
      // 如果有登录信息且不是去登录页面，则返回之前页面
      if (to.path == "/user/account" && from.path != '/user/account'){
        navigateTo("/user/account");
      }else{
        navigateTo(from.path);
      }
  }
  // 用户已登录，但尝试访问登录页面
  else if (to.path === "/auth/login") {
      // 重定向到账户页面或其他合适的页面
      navigateTo('/user/account');
  }
  // 如果以上条件都不满足（理论上不应该发生），则可能不需要执行任何操作
  // 但为了代码的健壮性，可以添加一个日志或默认行为
  else {
      console.log('Unexpected navigation scenario. Staying on current page.');
  }
});
