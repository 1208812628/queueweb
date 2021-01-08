import initRoute from "./router";

import "./public-path";
import biCommon from '@gwi/bi-common';

import Vue from 'vue';

console.log("bicommon", biCommon)

import '@gwi/bi-common/lib/bi-common.css';
import langRes from '@/lang';
import i18n from '@/lang';

import store from '@/store';
import Vuex from "vuex";

import ElementUI from 'element-ui';

// const VueSet = biCommon.initVue(langRes);
// const Vue = VueSet.Vue;
Vue.use(biCommon);

// console.log('biCommon i18n', VueSet.i18n);

Vue.use(Vuex);
Vue.use(ElementUI, {
  size: 'mini', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
});

Vue.config.productionTip = false;

// import components from './components'
// Vue.use(components)

let instance = null;
let router = null;

/**
 * 渲染函数
 * 两种情况：主应用生命周期钩子中运行 / 微应用单独启动时运行
 */
async function render(props) {
  // 在 render 中创建 VueRouter，可以保证在卸载微应用时，移除 location 事件监听，防止事件污染
  //console.log('$route', router);
  const roleSystem = await releResourceMgr.commit(props.appName);

  // const roleStore = initStore({

  // });
  //roleSystem.views
  router = initRoute(null, '/' + props.appName);

  let initStore = biCommon.initStore({
    token: props.loginToken,
    userInfo: props.userInfo,
    routes: roleSystem.views,
    roleButtons: roleSystem.buttons
  });

  store.registerModule("initStore", initStore);

  // 挂载应用
  instance = new Vue({
    router,
    i18n,
    store,
    render: (h) => {
      return h(biCommon.components.AppContainer, {
        props: {
          appName: props.appName
        }
      });
    }
  }).$mount("#app");
  biCommon.registeIns(instance)
}

// 独立运行时，直接挂载应用
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

// const releResourceMgr = new biCommon.GWI_API.resourseRole();
const releResourceMgr = new biCommon.GWI_API.RoleSystem();

/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap(props) {
  Vue.prototype.$beeper = props.beeper;
  props.beeper.subscribe(v => {
    if (v.appName === props.appName) {
      console.log(props.appName + '接受到消息', v);
      if (router) {
        biCommon.GWI_MSG.receiveMsg({type: v.type, params: v.params}, router);
      }
    }
  });
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) {
  console.log("VueMicroApp mount", props);
  render(props);
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount() {
  console.log("VueMicroApp unmount");
  store.unregisterModule("initStore");
  instance.$destroy();
  instance = null;
  router = null;
}
