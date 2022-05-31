const TipsBanner = Vue.defineAsyncComponent(() => getComponent('tutorialBanner'));

return {
  components: {
    TipsBanner,
  },
  computed: {
    isDemoMode() {
      return store.state.demoMode;
    },
    goodies() {
      return store.state.income.goodies;
    },
  },
  setup() {
    const currentGoodsPrice = Vue.ref(null);
    const currentGoodsName = Vue.ref(null);
    const isOpened = Vue.ref(true);

    return {
      currentGoodsName,
      currentGoodsPrice,
      isOpened,
      onSubmit() {
        store.commit('addIncomeGoods', {
          no: store.state.income.goodies.length,
          name: currentGoodsName.value,
          price: currentGoodsPrice.value,
        });

        Quasar.Notify.create({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: '追加しました。',
        });

        currentGoodsName.value = null;
        currentGoodsPrice.value = null;
      },
      deleteItem(itemIndex) {
        router.push('/income/goodies');
        Quasar.Dialog.create({
          title: '確認',
          message: `「${goodies[itemIndex].name}」を消去してもよろしいですか?`,
          cancel: true,
          persistent: true,
        });
      },
      onReset() {
        currentGoodsName.value = null;
        currentGoodsPrice.value = null;
      },
    };
  },
};
