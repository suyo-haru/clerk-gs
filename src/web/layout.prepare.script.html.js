return {
  components: { LeftMenu },
  computed: {
    footerTitle () {
      if (this.path == "/prepare/budget"){
        return "（仮）予算"
      } else {
        return "予算"
      }
    },
    budget (){
      if (this.path == "/prepare/budget"){
        return store.state.prepare.budget.temporaryBill
      } else {
        return store.state.prepare.budget.summaryBill
      }
    }
  },
  setup() {
    router.push('/prepare');
    const leftDrawerOpen = Vue.ref(true);
    const path = Vue.ref(null);

    return {
      leftDrawerOpen,
      path,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      changePage(value) {
        path.value = value
      }
    };
  },
};
