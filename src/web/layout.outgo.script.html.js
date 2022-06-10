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
