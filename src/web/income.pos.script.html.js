return {
    computed: {
      isDemoMode() {
        return store.state.demoMode;
      },
      goodies() {
        return store.state.income.goodies;
      },
    },
    setup() {
      const formComp = Vue.ref(null);
      const listRef = Vue.ref(null);
      const currentClerk = Vue.ref(0);
      const goodsItems = Vue.ref([]);
      const itemCount = Vue.ref([]);
      const customItems = Vue.ref([]);

      return {
        formComp,
        listRef,
        currentClerk,
        goodsItems,
        customItems,
        itemCount,
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
        },
        addItem(item) {
          if (goodsItems.value.includes(item)) {
            itemCount.value[goodsItems.value.indexOf(item)] = itemCount.value[goodsItems.value.indexOf(item)] + 1;
          } else {
            goodsItems.value.push(item);
            itemCount.value.push(1);
          }
        },
        removeItem(item) {
          if (goodsItems.value.includes(item)) {
            itemCount.value[goodsItems.value.indexOf(item)] += -1;
            if (itemCount.value[goodsItems.value.indexOf(item)] <= 0) {
              const i = goodsItems.value.indexOf(item)
              goodsItems.value.splice(i,1)
              itemCount.value.splice(i,1)
            }
          }
        },
        checkCurrentCount(item){
          if (goodsItems.value.includes(item)) {
            return itemCount.value[goodsItems.value.indexOf(item)]
          } else {
            return -1
          }
        },
        createItem(price) {
          const itemObject = { name: "その他", price: Number(price)};
          customItems.value.push(itemObject);
          goodsItems.value.push(itemObject);
          itemCount.value.push(1);
        },
        total(){
          let sum = 0;
          for (const index in goodsItems.value){
            sum += goodsItems.value[index].price * itemCount.value[index]
          }
          return sum
        }
      };
    },
  };
  