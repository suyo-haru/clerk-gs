//import { useRoute } from VueRouter

const EditComp = Vue.defineAsyncComponent(() => getComponent('web/list.detail'));

return {
  components: {
    EditComp
  }
};
