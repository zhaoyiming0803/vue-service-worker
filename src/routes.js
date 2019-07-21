import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const indexPage = () => import('@/pages/index');
const listPage = () => import('@/pages/list');

export default new Router({
  // https://router.vuejs.org/zh/guide/essentials/history-mode.html
  mode: 'history',
  base: 'vue-sw',
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      name: 'Index',
			path: '/index',
			component: indexPage
    },
    {
      name: 'List',
      path: '/list',
      component: listPage
    }
  ]
});