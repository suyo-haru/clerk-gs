return {
    computed: {
        sumOfPlaning () {
            return store.state.prepare.goodies.reduce((pre,now) => pre + Number(now.price), 0)
        },
        billPerStudent () {
            return Math.ceil((this.sumOfPlaning - Number(this.otherBill)) / Number(this.numberOfStudent))
        },
        surplusBill () {
            return (this.billPerStudent * Number(this.numberOfStudent)) - (this.sumOfPlaning - Number(this.otherBill))
        },
        budgetSum () {
            return Number(this.billPerStudent) * Number(this.numberOfStudent) - this.surplusBill
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
                    summaryBill: Number(Math.ceil((store.state.prepare.goodies.reduce((pre,now) => pre + Number(now.price), 0) - Number(otherBill.value)) / Number(numberOfStudent.value))) * Number(numberOfStudent.value) - (Math.ceil((store.state.prepare.goodies.reduce((pre,now) => pre + Number(now.price), 0) - Number(otherBill)) / Number(numberOfStudent.value)) * Number(numberOfStudent.value)) - (store.state.prepare.goodies.reduce((pre,now) => pre + Number(now.price), 0) - Number(otherBill.value)),
                    studentBill: Math.ceil((store.state.prepare.goodies.reduce((pre,now) => pre + Number(now.price), 0) - Number(otherBill).vaule) / Number(numberOfStudent.value)),
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