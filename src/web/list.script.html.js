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
    createBlobUrl() {
      if (this.currentGoodsImage != null) {
        return URL.createObjectURL(this.currentGoodsImage);
      } else {
        return null;
      }
    },
  },
  setup(props) {
    const formComp = Vue.ref(null);
    const listRef = Vue.ref(null);
    const currentGoodsPrice = Vue.ref(null);
    const currentGoodsName = Vue.ref(null);
    const currentGoodsImage = Vue.ref(null);
    const isOpened = Vue.ref(true);
    const currentPagePath = VueRouter.useRoute().path;
    store.dispatch('get' + props.commitFunction);

    return {
      formComp,
      listRef,
      listEl: Vue.computed(() => listRef.value ? listRef.value.$el : null),
      currentGoodsName,
      currentGoodsPrice,
      currentGoodsImage,
      isOpened,
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
            store.dispatch('add' + props.commitFunction, {
              name: currentGoodsName.value,
              price: currentGoodsPrice.value,
              image: url
            });
            
            Quasar.Notify.create({
              color: 'green-4',
              textColor: 'white',
              icon: 'cloud_done',
              message: '追加しました。'
            });
  
            currentGoodsName.value = null;
            currentGoodsPrice.value = null;
            currentGoodsImage.value = null;
  
            formComp.value.resetValidation();
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
          store.dispatch('add' + props.commitFunction, {
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
          currentGoodsImage.value = null;

          formComp.value.resetValidation();
        }
      },
      deleteItem(index) {
        Quasar.Dialog.create({
          title: '確認',
          message: '「 ' + this.goodies[index].name  + ' 」を消去してもよろしいですか？',
          cancel: true,
          persistent: true
        }).onOk(() => {
          store.dispatch('delete' + props.commitFunction, index);
          router.push(currentPagePath);
        });
        
      },
      onReset() {
        currentGoodsName.value = null;
        currentGoodsPrice.value = null;
        currentGoodsImage.value = null;
      }
    };
  },
};
