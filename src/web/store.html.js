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
        // @type {{ name: string, price: number }}
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
        setPreOutgoGoods(state, items) {
          state.goodies = items
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
        getShopInfo({ state, rootState, commit }) {
          return new Promise((resolve) => {
            google.script.run.withSuccessHandler((info) => {
              commit('setShopInfo', info)
              resolve(info)
            }).getIncomeGoods(rootState.classID)
          })
        },
        setShopInfo({ state, rootState, commit }, info) {
          google.script.run.withSuccessHandler(() => {
            Quasar.Notify.create({
              color: 'green-4',
              textColor: 'white',
              icon: 'cloud_done',
              message: '設定しました。',
            });
            commit('setShopInfo', info)
          }).setShopInfo(rootState.classID,info)
        },
        // -----
        getPreOutgoGoods({ state, rootState, commit }, item) {
          return new Promise((resolve) => {
            google.script.run.withSuccessHandler((infos) => {
              commit('setPreOutgoGoods', infos)
              resolve(infos)
            }).getIncomeGoods(rootState.classID)
          })
        },
        addPreOutgoGoods({ state, rootState, commit }, item) {
          return new Promise((resolve) => {
            google.script.run.withSuccessHandler(() => {
              commit('addPreOutgoGoods', item)
              resolve(item)
            }).addIncomeGoods(rootState.classID, item)
          })
        },
        editPreOutgoGoods({ state, rootState, commit }, item) {
          return new Promise((resolve) => {
            google.script.run.withSuccessHandler(() => {
              commit('editPreOutgoGoods', item)
              resolve(item)
            }).editIncomeGoods(rootState.classID, item.index, item.item)
          })
        },
        deletePreOutgoGoods({ state, rootState, commit }, index){
          return new Promise((resolve) => {
            google.script.run.withSuccessHandler(() => {
              commit('editPreOutgoGoods', index)
              resolve(state.goodies)
            }).deleteIncomeGoods(rootState.classID, index)
          })
        },
      }
    },
    income: {
      state: () => ({
        // @type {{ name: string, price: number }}
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
        getIncomeGoods({ state, rootState, commit }) {
          return new Promise((resolve) => {
            google.script.run.withSuccessHandler((infos) => {
              commit('setIncomeGoods', infos)
              resolve(infos)
            }).getIncomeGoods(rootState.classID)
          })
        },
        addIncomeGoods({ state, rootState, commit }, item) {
          return new Promise((resolve) => {
            google.script.run.withSuccessHandler(() => {
              commit('addIncomeGoods', item)
              resolve(item)
            }).addIncomeGoods(rootState.classID, item)
          })
        },
        editIncomeGoods({ state, rootState, commit }, item) {
          return new Promise((resolve) => {
            google.script.run.withSuccessHandler(() => {
              commit('editIncomeGoods', item)
              resolve(item)
            }).editIncomeGoods(rootState.classID, item.index, item.item)
          })
        },
        deleteIncomeGoods({ state, rootState, commit }, index){
          return new Promise((resolve) => {
            google.script.run.withSuccessHandler(() => {
              commit('editIncomeGoods', index)
              resolve(state.goodies)
            }).deleteShopItems(rootState.classID, index)
          })
        },
      }
    },
    outgo: { 
      state: () => ({
        // @type {{ name: string, price: number, imageId: string}}
        goodies: []
      }),
      mutations: {
        setOutgoGoods(state, items) {
          state.goodies = items
        },
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
        getOutgoGoods({ state, rootState, commit }) {
          return new Promise((resolve) => {
            google.script.run.withSuccessHandler((infos) => {
              commit('setOutgoGoods', infos)
              resolve(infos)
            }).getOutgoGoods(rootState.classID)
          })
        },
        addOutgoGoods({ state, rootState, commit }, item) {
          return new Promise((resolve) => {
            google.script.run.withSuccessHandler(() => {
              commit('addOutgoGoods', item)
              resolve(item)
            }).addOutgoGoods(rootState.classID, item)
          })
        },
        editOutgoGoods({ state, rootState, commit }, item) {
          return new Promise((resolve) => {
            google.script.run.withSuccessHandler(() => {
              commit('editOutgoGoods', item)
              resolve(item)
            }).editOutgoGoods(rootState.classID, item.index, item.item)
          })
        },
        deleteOutgoGoods({ state, rootState, commit }, index){
          return new Promise((resolve) => {
            google.script.run.withSuccessHandler(() => {
              commit('editOutgoGoods', index)
              resolve(state.goodies)
            }).deleteOutgoGoods(rootState.classID, index)
          })
        },
      }
    }
  },
  state () {
    return {
      isLoggedIn: false,
      classID: null,
      menuState: 'prepare',
      demoMode: false
    }
  },
  mutations: {
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
