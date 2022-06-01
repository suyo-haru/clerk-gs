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
    imageFile(val, _2) {
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
      return store.state.outgo.goodies;
    },
    createBlobUrl() {
      if (this.imageFile != null) {
        return URL.createObjectURL(this.imageFile[0]);
      } else {
        return null;
      }
    },
  },
  setup(props) {
    const route = VueRouter.useRoute();
    const goods = store.state.outgo.goodies[route.params.goodsid];
    const currentGoodsPrice = Vue.ref(goods.price);
    const currentGoodsName = Vue.ref(goods.name);
    const imageFile = Vue.ref(null);
    const isChanged = Vue.ref(false);
    return {
      currentGoodsName,
      currentGoodsPrice,
      isChanged,
      imageFile,
      onSubmit() {
        store.commit('edit' + props.commitFunction, {
          index: route.params.goodsid,
          item: {
            name: currentGoodsName.value,
            price: currentGoodsPrice.value,
          }
        });

        Quasar.Notify.create({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: '設定しました。',
        });
      },
      onReset() {
        currentGoodsPrice.value = goods.price;
        currentGoodsName.value = goods.name;
        imageFile.value = null;
        isChanged.value = false;
      },
    };
  },
};
