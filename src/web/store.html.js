{
  modules: {
    prepare: {
      state: () => ({
        budget: {
          temporaryBill: 0,
          summaryBill: 0,
          studentBill: 0,
          numberOfStudent: 1,
          otherBill: 0
        },
        goodies: [],
        info: {shopName: null, shopDetail: null}
      }),
      mutations: {
        setTemporaryBill(state, value) {
          state.budget.temporaryBill = value
        },
        setBudget(state, item) {
          state.budget.temporaryBill = item.summaryBill
          state.budget.summaryBill = item.summaryBill
          state.budget.studentBill = item.studentBill
          state.budget.numberOfStudent = item.numberOfStudent
          state.budget.otherBill = item.otherBill
        },
        addPreOutgoGoods(state, item) {
          state.goodies.push(item)
        },
        editPreOutgoGoods(state, item){
          state.goodies[item.index] = item.item
        },
        deletePreOutgoGoods(state, index){
          state.goodies.splice(index, 1)
        },
        setShopInfo (state, info){
          state.info = info
        }
      },
      actions: {

      }
    },
    income: {
      state: () => ({
        goodies: []
      }),
      mutations: {
        addIncomeGoods(state, item) {
          state.goodies.push(item)
        },
        editIncomeGoods(state, item){
          state.goodies[item.index] = item.item
        },
        deleteIncomeGoods(state, index){
          state.goodies.splice(index, 1)
        }
      },
      actions: {

      }
    },
    outgo: { 
      state: () => ({
        goodies: []
      }),
      mutations: {
        addOutgoGoods(state, item) {
          state.goodies.push(item)
        },
        editOutgoGoods(state, item){
          state.goodies[item.index] = item.item
        },
        deleteOutgoGoods(state, index){
          state.goodies.splice(index, 1)
        }
      },
      actions: {

      }
    }
  },
  state () {
    return {
      count1: 0,
      count2: 0,
      gooddies : [],
      isLoggedIn: false,
      classID: null,
      menuState: 'prepare',
      demoMode: false
    }
  },
  mutations: {
    increment1 (state) {
      state.count1++
    },
    increment2 (state) {
      state.count2++
    },
    addGooddies (state, item) {
      state.gooddies.push(item)
    },
    deleteGoodies (state, index) {
      state.gooddies.pop(index)
    },
    setMenuState (state, stateID) {
      state.menuState = stateID
    },
    setClassID (state, classID) {
      state.classID = classID
      state.isLoggedIn = true
    },
    enterDemoMode (state) {
      state.isLoggedIn = true;
      state.classID = 999;
      state.demoMode = true;
    },
    resetState (state) {
      state.isLoggedIn = false
      state.classID = null
      state.demoMode = false
      removeAllUserProperty()
    }
  },
  plugins: [window.createPersistedState({ 
    storage: {
      getItem: (key) => userProperty[key],
      setItem: setUserProperty,
      removeItem: removeUserProperty
    } 
  })]
}
