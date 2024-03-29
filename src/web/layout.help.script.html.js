const LeftHelpMenu = Vue.defineAsyncComponent(
  {
    // ファクトリ関数
    loader: () => getComponent("web/leftMenu.help"),
    // 非同期コンポーネントが読み込み中に使うコンポーネント
    loadingComponent: PageLoading,
    // 読み込み中のコンポーネントを表示するまでの時間。デフォルト: 200ms.
    delay: 50
  }
);

return {
  components: { LeftHelpMenu },
  setup() {
    router.push('/help');
    const leftDrawerOpen = Vue.ref(true);

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
};
