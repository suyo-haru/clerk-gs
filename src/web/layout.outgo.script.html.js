return {
  components: { LeftMenu },
  computed: {
    sum() {
      return store.state.outgo.goodies.reduce((sum, obj) => Number(obj.price) + sum, 0);
    },
  },
  setup() {
    router.push('/outgo');
    const leftDrawerOpen = Vue.ref(true);

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
};
