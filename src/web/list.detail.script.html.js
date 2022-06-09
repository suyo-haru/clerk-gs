//import { useRoute } from VueRouter

const TipsBanner = Vue.defineAsyncComponent(() => getComponent('web/tutorialBanner'));

return {
  props: { menuMode: String, acceptImage: Boolean, backUrl: String, commitFunction: String},
  components: {
    TipsBanner,
  },
  watch: {
    currentGoodsPrice(_1, _2) {
      this.isChanged = true;
    },
    currentGoodsName(_1, _2) {
      this.isChanged = true;
    },
    currentGoodsImage(val, _2) {
      if (val !== null) {
        this.isChanged = true;
      }
    },
  },
  computed: {
    isDemoMode() {
      return store.state.demoMode;
    },
    goodies() {
      return store.state[this.$props.menuMode].goodies;
    },
    createBlobUrl() {
      if (this.currentGoodsImage != null) {
        return URL.createObjectURL(this.currentGoodsImage);
      } else {
        return null;
      }
    },
  },
  setup(props) {
    const formComp = Vue.ref(null)
    const route = VueRouter.useRoute();
    const goods = store.state[props.menuMode].goodies[route.params.goodsid];
    const currentGoodsPrice = Vue.ref(goods.price);
    const currentGoodsName = Vue.ref(goods.name);
    const currentGoodsImage = Vue.ref(null);
    const isChanged = Vue.ref(false);
    return {
      formComp,
      currentGoodsName,
      currentGoodsPrice,
      currentGoodsImage,
      isChanged,
      onSubmit() {
        if (props.acceptImage) {
          const dialog = Quasar.Dialog.create({
            message: '画像のアップロード中...',
            progress: true, // we enable default settings
            persistent: true, // we want the user to not be able to close it
            ok: false // we want the user to not be able to close it
          })
          google.script.run.withSuccessHandler((url) => {
            dialog.hide()
            store.dispatch('edit' + props.commitFunction, {
              index: route.params.goodsid,
              item: {
                name: currentGoodsName.value,
                price: currentGoodsPrice.value,
                image: url
              }
            }).then(() => {
              Quasar.Notify.create({
                color: 'green-4',
                textColor: 'white',
                icon: 'cloud_done',
                message: '設定しました。',
              });
              isChanged.value = false;
            });
          }).withFailureHandler(() => {
            dialog.hide()
            Quasar.Notify.create({
              color: 'negative',
              textColor: 'white',
              icon: 'remove',
              message: 'エラー。'
            });
          }).uploadImage(formComp.value.$el)
        } else {
          store.dispatch('edit' + props.commitFunction, {
            index: route.params.goodsid,
            item: {
              name: currentGoodsName.value,
              price: currentGoodsPrice.value,
            }
          }).then(() => {
            Quasar.Notify.create({
              color: 'green-4',
              textColor: 'white',
              icon: 'cloud_done',
              message: '設定しました。',
            });
            isChanged.value = false;
          });
        }
        

      },
      onReset() {
        currentGoodsPrice.value = goods.price;
        currentGoodsName.value = goods.name;
        currentGoodsImage.value = goods.image;
        isChanged.value = false;
      },
    };
  },
};
