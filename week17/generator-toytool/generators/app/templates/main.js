import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;

new Vue({
  el: '#app',

  // 依赖模板编译的方式
  //template: '<App/>',
  //components: { App },

  // 不依赖模板编译
  render: (h) => h(App),
});
