return {
  components: { LeftMenu },
  computed: {
    sum() {
      return store.state.income.goodies.reduce((sum, obj) => Number(obj.price) + sum, 0);
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
