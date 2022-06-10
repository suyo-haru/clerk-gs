return {
  computed: {
    finance() {
      return store.state.income.finance;
    }
  },
  setup () {
    return {
      current: Vue.ref(1)
    }
  }
}