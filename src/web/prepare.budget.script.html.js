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
                function B_sumOfPlaning () {
                    return store.state.prepare.goodies.reduce((pre,now) => pre + Number(now.price), 0)
                }
                function B_billPerStudent () {
                    return Math.ceil((B_sumOfPlaning() - Number(otherBill.value)) / Number(numberOfStudent.value))
                }
                function B_surplusBill () {
                    return (B_billPerStudent() * Number(numberOfStudent.value)) - (B_sumOfPlaning() - Number(otherBill.value))
                }
                function B_budgetSum () {
                    return Number(B_billPerStudent()) * Number(numberOfStudent.value) - B_surplusBill()
                }
                store.dispatch('setBudget', {
                    summaryBill: B_budgetSum(),
                    studentBill: B_billPerStudent(),
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