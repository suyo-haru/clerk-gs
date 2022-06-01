const LeftMenu = Vue.defineAsyncComponent({
  // ファクトリ関数
  loader: () => getComponent('web/leftMenu'),
  // 非同期コンポーネントが読み込み中に使うコンポーネント
  loadingComponent: PageLoading,
  // 読み込み中のコンポーネントを表示するまでの時間。デフォルト: 200ms.
  delay: 50,
  // タイムアウトが指定されていて、それを超えた場合、
  // エラーコンポーネントが表示されます。デフォルト: Infinity.
  timeout: 3000,
});

const IncomeLayout = Vue.defineAsyncComponent({
  // ファクトリ関数
  loader: () => getComponent('web/layout.income'),
  // 非同期コンポーネントが読み込み中に使うコンポーネント
  loadingComponent: PageLoading,
  // 読み込み中のコンポーネントを表示するまでの時間。デフォルト: 200ms.
  delay: 50,
  // タイムアウトが指定されていて、それを超えた場合、
  // エラーコンポーネントが表示されます。デフォルト: Infinity.
  timeout: 3000,
});

const OutgoLayout = Vue.defineAsyncComponent({
  // ファクトリ関数
  loader: () => getComponent('web/layout.outgo'),
  // 非同期コンポーネントが読み込み中に使うコンポーネント
  loadingComponent: PageLoading,
  // 読み込み中のコンポーネントを表示するまでの時間。デフォルト: 200ms.
  delay: 50,
  // タイムアウトが指定されていて、それを超えた場合、
  // エラーコンポーネントが表示されます。デフォルト: Infinity.
  timeout: 3000,
});

const PrepareLayout = Vue.defineAsyncComponent({
  // ファクトリ関数
  loader: () => getComponent('web/layout.prepare'),
  // 非同期コンポーネントが読み込み中に使うコンポーネント
  loadingComponent: PageLoading,
  // 読み込み中のコンポーネントを表示するまでの時間。デフォルト: 200ms.
  delay: 50,
  // タイムアウトが指定されていて、それを超えた場合、
  // エラーコンポーネントが表示されます。デフォルト: Infinity.
  timeout: 3000,
});

const GeneralLayout = defineAsyncComponent({
  loader: () => getComponent('web/layout.help'),
  loadingComponent: PageLoading,
  delay: 50,
});

const Testing = defineAsyncComponent({
  loader: () => getComponent(''),
  loadingComponent: PageLoading,
  delay: 50,
});

const MainView = {
  props: ['menu'],
  components: {
    IncomeLayout,
    OutgoLayout,
    PrepareLayout,
    GeneralLayout,
  },
  template: `
    <income-layout v-if="menu == 'income'" />
    <outgo-layout v-if="menu == 'outgo'" />
    <prepare-layout v-if="menu == 'prepare'" />
    <general-layout v-if="menu == 'help'" />
    `,
};

return {
  components: {
    LeftMenu,
    MainView,
    Testing,
  },
  computed: {
    menuState() {
      return store.state.menuState;
    },
  },
};
