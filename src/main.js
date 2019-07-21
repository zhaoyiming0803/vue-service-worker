/**
 * 打包入口配置
 * @author zhaoyiming
 * @since  2019/07/21
 */

import Vue from 'vue';
import router from './routes';
import App from './pages/App';

// 关闭生产模式下浏览器开发者工具栏提示
Vue.config.productionTip = false;

new Vue({
	el: '#app',
	router,
	render: h => h(App)
});
