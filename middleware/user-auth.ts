// 一个类似的 auth 中间件逻辑示例

export default defineNuxtRouteMiddleware(async (to, from) => {

  const { status } = useAuth();
  const router = useRouter();
  
  console.log('user-auth.ts', status.value, to?.path, from?.path)
  if (status.value === 'authenticated') {
    return
  };
  return router.push({
    path: '/auth/login',
    query: { callbackUrl: to?.path || '/' }
  });
  
  // const { getSession } = useAuth();
  // const session = await getSession();
  // console.log('redirect', !session)
  // console.log('redirect', Object.keys(session).length === 0)
  
  // 没有登陆信息，去 login 页面
  // if (Object.keys(session).length === 0) {
  //     if(to.path !== "/auth/login"){
  //       console.log('navigateTo /auth/login')
  //       await callWithNuxt(nuxtApp, signIn, [undefined, { callbackUrl: to.path }]);
  //     }
  // }
  // else {
  //     // 有登陆信息，且目标是 login 页面
  //     if (to.path == "/auth/login" && from.path != '/auth/login'){
  //       console.log('navigateTo:',from.path)
  //       return navigateTo(from.path);
  //     }
  // }
});
