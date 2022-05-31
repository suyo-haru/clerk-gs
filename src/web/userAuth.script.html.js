return {
  setup() {
    const classCode = Vue.ref(null);
    const passCode = Vue.ref(null);
    const classDatas = Vue.ref(null);
    const classList = Vue.ref([
      {
        value: '999',
        label: 'デモ',
        description: 'デバッグ・テスト用',
        category: '3',
      },
    ]);

    google.script.run
      .withSuccessHandler((datas) => {
        classDatas.value = datas;
        for (const classItem of datas) {
          classList.value.push({
            value: String(classItem.classID),
            label: classItem.className,
            category: '3',
          });
        }
      })
      .getClassList();

    return {
      classCode,
      passCode,
      classList,
      classDatas,

      onSubmit() {
        if (classCode.value == null) {
          Quasar.Notify.create({
            message: 'クラスを選択してください。',
            type: 'negative',
            timeout: 1000,
            position: 'center',
            closeBtn: true,
          });
          return;
        }
        if (classCode.value.value == 999) {
          store.commit('enterDemoMode');
          return;
        }
        if (classDatas.value.find((item) => item.classID == classCode.value.value) == undefined) {
          Quasar.Notify.create({
            message: 'クラスが存在しません。ほかのクラスを選択してください。',
            type: 'negative',
            timeout: 1000,
            position: 'center',
            closeBtn: true,
          });
          return;
        }
        if (
          passCode.value !==
          String(classDatas.value.find((item) => item.classID == classCode.value.value).pass)
        ) {
          Quasar.Notify.create({
            message: 'パスワードが正しくありません。',
            type: 'negative',
            timeout: 2000,
            position: 'center',
            closeBtn: true,
          });
        } else {
          store.commit('setClassID', classCode.value.value);
        }
      },
      onReset() {
        classCode.value = null;
        passCode.value = null;
      },
    };
  },
};
