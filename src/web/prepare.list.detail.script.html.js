//import { useRoute } from VueRouter

const TipsBanner = Vue.defineAsyncComponent(() => getComponent('web/tutorialBanner'));

return {
  components: {
    TipsBanner,
  },
  watch: {
    currentGoodsPrice(val, _2) {
      if (val != goods.price) {
        this.isChanged = true;
      }
    },
    currentGoodsName(val, _2) {
      if (val != goods.name) {
        this.isChanged = true;
      }
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
      return store.state.prepare.goodies;
    },
    createBlobUrl() {
      if (this.imageFile != null) {
        return URL.createObjectURL(this.imageFile[0]);
      } else {
        return null;
      }
    },
  },
  setup() {
    const route = VueRouter.useRoute();
    const goods = store.state.prepare.goodies.find((item) => item.no == route.params.goodsid);
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
        store.commit('editPreOutgoGoods', {
          no: route.params.goodsid,
          name: currentGoodsName.value,
          amount: currentGoodsAmount.value,
          price: currentGoodsPrice.value,
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
        currentGoodsAmount.value = goods.amount;
        imageFile.value = null;
        isChanged.value = false;
      },
    };
  },
};