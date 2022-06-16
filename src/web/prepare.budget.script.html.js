return {
    computed: {
        sumOfPlaning () {
            return store.state.prepare.goodies.reduce((pre,now) => pre + Number(now.price), 0)
        },
        budgetSum () {
            return Number(this.billPerStudent) * Number(this.numberOfStudent) + Number(this.otherBill)
        }

    },
    watch: {
        studentPerBill() {
            this.applytemporary()
        },
        numberOfStudent() {
            this.applytemporary()
        },
        otherBill() {
            this.applytemporary()
        }
    },
    setup (){
        const { debounce } = Quasar
        const billPerStudent = Vue.ref(store.state.prepare.budget.billPerStudent == 0 ? store.state.prepare.goodies.reduce((pre,now) => pre + Number(now.price), 0) : store.state.prepare.budget.billPerStudent);
        const numberOfStudent = Vue.ref(store.state.prepare.budget.numberOfStudent);
        const otherBill = Vue.ref(store.state.prepare.budget.otherBill);
        store.commit('setTemporaryBill', Number(billPerStudent.value) * Number(numberOfStudent.value) + Number(otherBill.value))
        store.dispatch('getBudget');
        return {
            billPerStudent,
            numberOfStudent,
            otherBill,
            applytemporary : debounce(function(){
                store.commit('setTemporaryBill',this.budgetSum)
            }, 500),
            onSubmit () {
                store.dispatch('setBudget', {
                    summaryBill: Number(billPerStudent.value) * Number(numberOfStudent.value) + Number(otherBill.value),
                    billPerStudent: billPerStudent.value,
                    numberOfStudent: numberOfStudent.value,
                    otherBill: otherBill.value
                }).then(() => {
                    Quasar.Notify.create({
                        color: 'green-4',
                        textColor: 'white',
                        icon: 'cloud_done',
                        message: '設定しました。'
                    });
                });
                return;
            },
            
        }
    }
}