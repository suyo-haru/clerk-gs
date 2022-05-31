return {
  props: ['tips-id', 'tips-button'],
  emits: ['detailClick'],
  setup() {
    const display = Vue.ref(true);
    const display2 = Vue.ref(true);
    return {
      display,
      display2,
      closeTips() {
        display.value = false;
      },
    };
  },
};
