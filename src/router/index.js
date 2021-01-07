import Vue from 'vue';
import Router from 'vue-router';
// import SystemRouter from './systemSetting';
import ViewIndex from '@/views';
import {GWI_ROUTER} from '@gwi/bi-common';

Vue.use(Router);

/**
 * 重写路由的push方法
 * 解决NavigationDuplicated问题
 */
const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error);
};

const initRouter = (authRoutes, basePath = '/') => {
  console.log('router base path is :', basePath);
  let router = new Router({
    mode: "history",
    base: window.__POWERED_BY_QIANKUN__ ? basePath : "/",
    routes: GWI_ROUTER.generateRoute(ViewIndex, authRoutes)
  });
  return router;
};

export default initRouter;
