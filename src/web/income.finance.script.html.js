return {
  computed: {
    finance() {
      return store.state.income.finance;
    }
  },
  setup () {
    store.dispatch('getIncomeFinance');
    return {
      current: Vue.ref(1),
      deleteIncomeFinance(i1,i2) {
        Quasar.Dialog.create({
          title: "消去",
          message: `${store.state.income.finance[i1].data[i2].goods.name} を消去してもよろしいですか？`,
          ok: true, // we want the user to not be able to close it
          cancel : true
        }).onOk(() => {
          const dialog = Quasar.Dialog.create({
            title: null,
            message: '消去中...',
            progress: true, // we enable default settings
            ok: false, // we want the user to not be able to close it
          })
          store.dispatch('deleteIncomeFinance',[i1, i2]).then(() => {
            dialog.hide();
          })
        })
      }
    }
  }
}