return {
    computed: {
        sumOfPlaning () {
            return store.state.prepare.goodies.reduce((pre,now) => pre + Number(now.price), 0);
        },
        perStudentBill () {
            return Math.ceil(Number(this.studentBill) / Number(this.numberOfStudent))
        },
        surplusBill () {
            return (this.perStudentBill * Number(this.numberOfStudent)) - Number(this.studentBill)
        },
        budgetSum () {
            return (this.perStudentBill * Number(this.numberOfStudent)) + Number(this.surplusBill) + Number(this.otherBill)
        }
    },
    data () {
        return {
            studentBill: store.state.prepare.goodies.reduce((pre,now) => pre + Number(now.price), 0),
            numberOfStudent: 1,
            otherBill: 0,
            dbg: false
        }
    },
    watch: {
        studentBill() {
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
        const studentBill = Vue.ref(store.state.prepare.goodies.reduce((pre,now) => pre + Number(now.price), 0));
        const numberOfStudent = Vue.ref(store.state.prepare.budget.numberOfStudent);
        const otherBill = Vue.ref(store.state.prepare.budget.otherBill);
        store.commit('setTemporaryBill',studentBill.value)
        return {
            studentBill,
            numberOfStudent,
            otherBill,
            applytemporary : debounce(function(){
                store.commit('setTemporaryBill',this.budgetSum)
            }, 500),
            onsubmit () {
                store.commit('setBudget', {
                    summaryBill: this.budgetSum,
                    studentBill: this.studentBill,
                    numberOfStudent: this.numberOfStudent,
                    otherBill: this.otherBill
                });

                Quasar.Notify.create({
                    color: 'green-4',
                    textColor: 'white',
                    icon: 'cloud_done',
                    message: '設定しました。'
                });
            }
        }
    }
}