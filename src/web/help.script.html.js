return {
    setup() {
        return {
            setMenuState(state) {
                if (state != store.state.menuState) {
                    store.commit('setMenuState', state);
                    router.push('/' + state);
                }
            }
        }
    }
}