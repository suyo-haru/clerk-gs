return {
    computed: {
      isDemoMode() {
        return store.state.demoMode;
      },
      goodies() {
        return store.state.income.goodies;
      },
    },
    setup(props) {
      const formComp = Vue.ref(null);
      const listRef = Vue.ref(null);
      const currentClerk = Vue.ref(0);
      const goodsItems = Vue.ref([]);
  
      return {
        formComp,
        listRef,
        currentClerk,
        goodsItems,
        listEl: Vue.computed(() => listRef.value ? listRef.value.$el : null),
        addDigit(num) {
          if (String(currentClerk.value).length >= 9) {
            return
          }
          if (num === 0){
              if (currentClerk.value === 0){
                  return
              }
          }
          if (currentClerk.value === 0) {
              currentClerk.value = num
              return
          }
          currentClerk.value = Number(String(currentClerk.value) + String(num))
        },
        deleteDigit() {
          currentClerk.value = Number(String(currentClerk.value).slice(0,-1))
        },
        reverseSign() {
          currentClerk.value = currentClerk.value * -1
        }
      };
    },
  };
  