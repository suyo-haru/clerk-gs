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
        return URL.createObjectURL(this.currentGoodsImage[0]);
      } else {
        return null;
      }
    },
  },
  setup(props) {
    const route = VueRouter.useRoute();
    const goods = store.state[props.menuMode].goodies[route.params.goodsid];
    const currentGoodsPrice = Vue.ref(goods.price);
    const currentGoodsName = Vue.ref(goods.name);
    const currentGoodsImage = Vue.ref(null);
    const isChanged = Vue.ref(false);
    return {
      currentGoodsName,
      currentGoodsPrice,
      currentGoodsImage,
      isChanged,
      onSubmit() {
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
