const ListComp = Vue.defineAsyncComponent(() => getComponent('web/list'));

return {
  components: {
    ListComp,
  },
};
