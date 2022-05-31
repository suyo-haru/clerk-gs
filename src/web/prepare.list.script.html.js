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
      return store.state.prepare.goodies;
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
        store.commit('addPreOutgoGoods', {
          no: store.state.prepare.goodies.length,
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
      deleteItem(item) {
        Quasar.Dialog.create({
          title: '確認 ',
          message: '「 ' + item.name + ' 」を消去してもよろしいですか？',
          cancel: true,
          persistent: true,
        }).onOk(() => {
          console.log();
        });
      },
      onReset() {
        currentGoodsName.value = null;
        currentGoodsAmount.value = null;
        currentGoodsPrice.value = null;
      },
    };
  },
};
