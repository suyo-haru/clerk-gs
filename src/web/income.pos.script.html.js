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
      const currentItemIndex = Vue.ref(null);
      const currentClerk = Vue.ref(0);
      const currentClerk2 = Vue.ref(0);
      const goodsItems = Vue.ref([]);
      const altGoodies = Vue.ref(JSON.parse(JSON.stringify(store.state.income.goodies.slice())));
      const itemCount = Vue.ref([]);
      const customItem = Vue.ref({
        name: "その他",
        price: 0
      });
      const mode = Vue.ref(null);

      Vue.watch(currentClerk, (newPrice) => {
        if (currentItemIndex.value == -1) {
          customItem.value.price = newPrice
        } else if(currentItemIndex.value != null){
          altGoodies.value[currentItemIndex.value].price = newPrice
        }
      });

      return {
        formComp,
        listRef,
        currentItemIndex,
        currentClerk,
        currentClerk2,
        goodsItems,
        altGoodies,
        customItem,
        itemCount,
        mode,
        listEl: Vue.computed(() => listRef.value ? listRef.value.$el : null),
        getDigit() {
          if (mode.value == null){
            return currentClerk
          } else {
            return currentClerk2
          }
        },
        addDigit(num) {
          if (mode.value == null){
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
          } else {
            if (String(currentClerk2.value).length >= 9) {
              return
            }
            if (num === 0){
                if (currentClerk2.value === 0){
                    return
                }
            }
            if (currentClerk2.value === 0) {
                currentClerk2.value = num
                return
            }
            currentClerk2.value = Number(String(currentClerk2.value) + String(num))
          }
          
        },
        deleteDigit() {
          if (mode.value != null) {
            currentClerk2.value = Number(String(currentClerk2.value).slice(0,-1))
          } else {
            currentClerk.value = Number(String(currentClerk.value).slice(0,-1))
          }
        },
        reverseSign() {
          if (mode.value != null) {
            currentClerk2.value = currentClerk2.value * -1
          } else {
            currentClerk.value = currentClerk.value * -1
          }
        },
        setMode(newMode) {
          mode.value = newMode;
        },
        getCurrentItemName() {
          if(currentItemIndex.value == null){
            return ""
          } else if (currentItemIndex.value == -1) {
            return customItem.value.name
          } else {
            return altGoodies.value[currentItemIndex.value].name
          }
        },
        setCurrentItem(index){
          currentItemIndex.value = index
          if(index == null){
            this.resetDigit()
          }
          if(index == -1){
            currentClerk.value = customItem.value.price
          } else {
            currentClerk.value = altGoodies.value[index].price
          }
          
        },
        calcDigit() {
          currentClerk.value = parseInt(String(new Function(`return ${String(currentClerk.value)} ${mode.value} ${String(currentClerk2.value)}`)()));
          mode.value = null
          currentClerk2.value = 0
        },
        resetDigit() {
          mode.value = null;
          currentClerk.value = 0
          currentClerk2.value = 0
        },
        restorePrice() {
          if(currentItemIndex.value == -1){
            this.resetDigit()
            currentClerk.value = 0;
          } else {
            this.resetDigit()
            currentClerk.value = store.state.income.goodies[currentItemIndex.value].price;
          }
          
        },
        getModeText() {
          switch(mode.value) {
            case "+":
              return "＋";
            case "-":
              return "―";
            case "*":
              return "×";
            case "/":
              return "÷";
            default:
              return "";
          }
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
        total(){
          let sum = 0;
          for (const index in goodsItems.value){
            sum += goodsItems.value[index].price * itemCount.value[index]
          }
          sum += customItem.value.price
          return sum
        },
        registClerk() {
          let allItems = []
          for (const index in goodsItems.value){
            allItems.push({goods: goodsItems.value[index], amount: itemCount.value[index]})
          }
          if(customItem.value.price !== 0){
            allItems.push({goods: customItem.value, amount: 1})
          }
          let sum = 0;
          for (const index in goodsItems.value){
            sum += goodsItems.value[index].price * itemCount.value[index]
          }
          sum += customItem.value.price
          const confirmText = allItems.map((value) => {
            return `${value.goods.name} ${value.amount > 1 ? "× " + value.amount : ""} : ¥ ${value.goods.price * value.amount}`
          }).join("<br>");
          const dialog = Quasar.Dialog.create({
            title: '確認',
            html: true,
            message: `${confirmText}<br>合計: ¥ ${sum}`,
            persistent: true, // we want the user to not be able to close it
            cancel: true
          }).onOk(() => {
            const dialog = Quasar.Dialog.create({
              title: null,
              message: '保存中...',
              progress: true, // we enable default settings
              ok: false, // we want the user to not be able to close it
              cancel : false
            })
            
            const query = { date: new Date(), data: allItems}
            store.dispatch('addIncomeFinance', query).then(() => {
              currentItemIndex.value = null
              currentClerk.value = 0
              currentClerk2.value = 0
              goodsItems.value = []
              altGoodies.value = JSON.parse(JSON.stringify(store.state.income.goodies.slice()));
              itemCount.value = []
              customItem.value.price = 0
              dialog.update({
                title: 'Done!',
                message: 'Upload completed successfully',
                progress: false,
                ok: true
              })
              dialog.hide()
            })
          })
        }
      };
    },
  };
  