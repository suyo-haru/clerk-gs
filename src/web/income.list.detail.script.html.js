//import { useRoute } from VueRouter

const EditComp = Vue.defineAsyncComponent({
  // ファクトリ関数
  loader: () => getComponent('web/list.detail'),
  // 非同期コンポーネントが読み込み中に使うコンポーネント
  loadingComponent: PageLoading,
  // 読み込み中のコンポーネントを表示するまでの時間。デフォルト: 200ms.
  delay: 50,
  // タイムアウトが指定されていて、それを超えた場合、
  // エラーコンポーネントが表示されます。デフォルト: Infinity.
  timeout: 3000
});

return {
  components: {
    EditComp
  }
};
