return {
  computed: {
    finance() {
      return store.state.income.finance;
    }
  },
  setup () {
    return {
      current: Vue.ref(1),
      deleteIncomeFinance(i1,i2) {
        const 
        store.dispatch('deleteIncomeFinance',{index: [i1, i2]}).then(() => {

        })
      }
    }
  }
}