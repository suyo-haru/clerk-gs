return {
    computed: {
        sumOfPlaning () {
            return store.state.prepare.goodies.reduce((pre,now) => pre + Number(now.price), 0)
        },
        billPerStudent () {
            return Math.ceil((this.sumOfPlaning - this.otherBill) / this.numberOfStudent)
        },
        surplusBill () {
            return (this.billPerStudent * this.numberOfStudent) - (this.sumOfPlaning - this.otherBill)
        },
        budgetSum () {
            return this.studentPerBill * this.numberOfStudent - this.surplusBill
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
        //const studentPerBill = Vue.ref(store.state.prepare.budget.studentBill == 0 ? store.state.prepare.goodies.reduce((pre,now) => pre + Number(now.price), 0) : store.state.prepare.budget.studentBill);
        const numberOfStudent = Vue.ref(store.state.prepare.budget.numberOfStudent);
        const otherBill = Vue.ref(store.state.prepare.budget.otherBill);
        store.commit('setTemporaryBill', 0);
        store.dispatch('getBudget');
        return {
            numberOfStudent,
            otherBill,
            applytemporary : debounce(function(){
                store.commit('setTemporaryBill',this.budgetSum)
            }, 500),
            onSubmit () {
                store.dispatch('setBudget', {
                    summaryBill: this.budgetSum,
                    studentBill: this.billPerStudent,
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
            }
        }
    }
}