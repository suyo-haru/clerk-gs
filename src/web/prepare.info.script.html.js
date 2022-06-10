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
    const currentShopName = Vue.ref(store.state.prepare.info ? store.state.prepare.info.shopName : "");
    const currentShopDetail = Vue.ref(store.state.prepare.info ? store.state.prepare.info.shopDetail : "");
    const isChanged = Vue.ref(false);
    const isFetching = Vue.ref(false);

    store.dispatch('getShopInfo').then(() => {
      currentShopName.value = store.state.prepare.info.shopName
      currentShopDetail.value = store.state.prepare.info.shopDetail
    })
    return {
      currentShopName,
      currentShopDetail,
      isChanged,
      isFetching,
      onSubmit() {
        isFetching.value = true
        store.dispatch('setShopInfo', {
          shopName: currentShopName.value,
          shopDetail: currentShopDetail.value,
        }).then(() => {
          Quasar.Notify.create({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: '設定しました。',
          });
          isChanged.value = false;
          isFetching.value = false;
        });
      },
      onReset() {
        currentShopName.value = store.state.prepare.info.shopName;
        currentShopDetail.value = store.state.prepare.info.shopDetail;
        isChanged.value = false;
      },
    };
  },
};
