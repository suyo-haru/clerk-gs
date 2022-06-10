return {
  components: { LeftMenu },
  computed: {
    sum() {
      //return store.state.income.finance.reduce((sum, obj) => obj.reduce((sum2, obj2) => {obj2.goods.price * obj2.amount}, 0) + sum, 0);
      return 400;
    },
  },
  setup() {
    router.push('/income');
    const leftDrawerOpen = Vue.ref(true);

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
};
