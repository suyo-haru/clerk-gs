return {
  computed: {
    menuState() {
      return store.state.menuState;
    },
  },

  setup() {
    const mail = Vue.ref('読み込み中...');
    const className = Vue.ref('');
    google.script.run
      .withSuccessHandler((data) => {
        mail.value = data;
      })
      .getUserMail();
    google.script.run
      .withSuccessHandler((data) => {
        if (data == undefined) {
          className.value = store.state.classID;
        } else {
          className.value = data.className;
        }
      })
      .getClassItem(store.state.classID);

    return {
      setMenuState(state) {
        if (state != store.state.menuState) {
          store.commit('setMenuState', state);
          router.push('/' + state);
        }
      },
      confirmLogout() {
        Quasar.Dialog.create({
          title: 'ログアウトしますか？',
          message: '個人の Google アカウントに紐づいたデータは消去されます。',
          cancel: true,
          persistent: true,
        })
          .onOk(() => {
            // console.log('OK')
            store.commit('resetState');
          })
          .onCancel(() => {
            // console.log('Cancel')
          })
          .onDismiss(() => {
            // console.log('I am triggered on both OK and Cancel')
          });
      },
      mail,
      className,
    };
  },
};
