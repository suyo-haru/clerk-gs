const HelpList = Vue.defineAsyncComponent(
  {
    // ファクトリ関数
    loader: () => getComponent("web/help"),
    // 非同期コンポーネントが読み込み中に使うコンポーネント
    loadingComponent: PageLoading,
    // 読み込み中のコンポーネントを表示するまでの時間。デフォルト: 200ms.
    delay: 50
  }
);

return {
  components: {
    HelpList
  },
  setup() {
    return {

    }
  },
};
