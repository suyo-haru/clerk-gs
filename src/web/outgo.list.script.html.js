const TipsBanner = Vue.defineAsyncComponent(() => getComponent('web/tutorialBanner'));

return {
  components: {
    TipsBanner,
  },
  computed: {
    isDemoMode() {
      return store.state.demoMode;
    },
    goodies() {
      return store.state.outgo.goodies;
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
        store.commit('addOutgoGoods', {
          no: store.state.outgo.goodies.length,
          name: currentGoodsName.value,
          amount: currentGoodsAmount.value,
          price: currentGoodsPrice.value,
        });
        isDialogOpened.value = false;

        Quasar.Notify.create({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: '追加しました。',
        });

        currentGoodsName.value = null;
        currentGoodsAmount.value = null;
        currentGoodsPrice.value = null;
      },
      deleteItem(item) {
        Quasar.Dialog.create({
          title: '確認 ',
          message: '「 ' + item.name + ' 」を消去してもよろしいですか？',
          cancel: true,
          persistent: true,
        }).onOk(() => {});
      },
      onReset() {
        currentGoodsName.value = null;
        currentGoodsAmount.value = null;
        currentGoodsPrice.value = null;
      },
    };
  },
};
