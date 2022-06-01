const TipsBanner = Vue.defineAsyncComponent(() => getComponent('tutorialBanner'));

return {
  props: ['MenuMode', 'ListTitle', 'AcceptImage', 'DetailUrl', 'AddCommitFunction', 'DeleteCommitFunction'],
  components: {
    TipsBanner,
  },
  computed: {
    isDemoMode() {
      return store.state.demoMode;
    },
    goodies() {
      return store.state[this.$props.MenuMode].goodies;
    },
  },
  setup(props) {
    const currentGoodsPrice = Vue.ref(null);
    const currentGoodsName = Vue.ref(null);
    const currentGoodsImage = Vue.ref(null);
    const isOpened = Vue.ref(true);

    return {
      currentGoodsName,
      currentGoodsPrice,
      currentGoodsImage,
      isOpened,
      onSubmit() {
        store.commit(props.AddCommitFunction, {
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
          title: '確認',
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
