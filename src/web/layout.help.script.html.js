return {
  components: { LeftMenu },
  setup() {
    router.push('/help');
    const leftDrawerOpen = Vue.ref(true);

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
};
