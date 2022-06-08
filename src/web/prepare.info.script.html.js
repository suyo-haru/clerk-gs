//import { useRoute } from VueRouter

const TipsBanner = Vue.defineAsyncComponent(() => getComponent('web/tutorialBanner'));

return {
  components: {
    TipsBanner,
  },
  watch: {
    currentShopDetail(val, _2) {
      if (val !== store.state.prepare.info.shopDetail) {
        this.isChanged = true;
      }
    },
    currentShopName(val, _2) {
      if (val !== store.state.prepare.info.shopName) {
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
    info() {
      return store.state.prepare.info;
    },
  },
  setup() {
    const currentShopName = Vue.ref(store.state.prepare.info.shopName);
    const currentShopDetail = Vue.ref(store.state.prepare.info.shopDetail);
    const imageFile = Vue.ref(null);
    const isChanged = Vue.ref(false);

    store.dispatch('getShopInfo')
    return {
      currentShopName,
      currentShopDetail,
      imageFile,
      isChanged,
      onSubmit() {
        store.dispatch('setShopInfo', {
          shopName: currentShopName.value,
          shopDetail: currentShopDetail.value,
        });

        isChanged.value = false;
      },
      onReset() {
        currentShopName.value = store.state.prepare.info.shopName;
        currentShopDetail.value = store.state.prepare.info.shopDetail;
        imageFile.value = null;
        isChanged.value = false;
      },
    };
  },
};
