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
      },
      fetchAll() {
        const dialog = Quasar.Dialog.create({
          title: null,
          message: '読み込み中...',
          progress: true, // we enable default settings
          ok: false, // we want the user to not be able to close it
        })
        Promise.all([
          store.dispatch('getShopInfo'),
          store.dispatch('getPreOutgoGoods'),
          store.dispatch('getBudget'),
          store.dispatch('getIncomeGoods'),
          store.dispatch('getIncomeFinance'),
          store.dispatch('getOutgoGoods')
        ]).then(() => {
          dialog.hide()
        })
      }
    };
  },
};
