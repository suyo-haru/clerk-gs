const TipsBanner = Vue.defineAsyncComponent(() => getComponent('web/tutorialBanner'));

return {
  props: {
    'menuMode': String,
    'listTitle': String,
    'acceptImage': Boolean,
    'detailUrl': String,
    'commitFunction': String
  },
  components: {
    TipsBanner,
  },
  computed: {
    isDemoMode() {
      return store.state.demoMode;
    },
    goodies() {
      return store.state[this.$props.menuMode].goodies;
    },
  },
  setup(props) {
    const formComp = Vue.ref(null)
    const currentGoodsPrice = Vue.ref(null);
    const currentGoodsName = Vue.ref(null);
    const currentGoodsImage = Vue.ref(null);
    const isOpened = Vue.ref(true);
    const currentPagePath = VueRouter.useRoute().path;

    return {
      formComp,
      currentGoodsName,
      currentGoodsPrice,
      currentGoodsImage,
      isOpened,
      onSubmit() {
        store.commit('add' + props.commitFunction, {
          name: currentGoodsName.value,
          price: currentGoodsPrice.value
        });
        
        Quasar.Notify.create({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: '追加しました。'
        });

        currentGoodsName.value = null;
        currentGoodsPrice.value = null;

        formComp.resetValidation();
      },
      deleteItem(index) {
        Quasar.Dialog.create({
          title: '確認',
          message: '「 ' + this.goodies[index].name  + ' 」を消去してもよろしいですか？',
          cancel: true,
          persistent: true
        }).onOk(() => {
          store.commit('delete' + props.commitFunction, index);
          router.push(currentPagePath);
        });
        
      },
      onReset() {
        currentGoodsName.value = null;
        currentGoodsPrice.value = null;
      },
    };
  },
};
