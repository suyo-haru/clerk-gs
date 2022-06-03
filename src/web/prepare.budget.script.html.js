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
        const studentBill = Vue.ref(store.state.prepare.budget.studentBill == 0 ? store.state.prepare.goodies.reduce((pre,now) => pre + Number(now.price), 0) : store.state.prepare.budget.studentBill);
        const numberOfStudent = Vue.ref(store.state.prepare.budget.numberOfStudent);
        const otherBill = Vue.ref(store.state.prepare.budget.otherBill);
        store.commit('setTemporaryBill',(Math.ceil(Number(studentBill.value) / Number(numberOfStudent.value)) * Number(numberOfStudent.value)) + Number((Math.ceil(Number(studentBill.value) / Number(numberOfStudent.value)) * Number(numberOfStudent.value)) - Number(studentBill.value)) + Number(otherBill.value))
        return {
            studentBill,
            numberOfStudent,
            otherBill,
            applytemporary : debounce(function(){
                store.commit('setTemporaryBill',this.budgetSum)
            }, 500),
            onSubmit () {
                store.commit('setBudget', {
                    summaryBill: (Math.ceil(Number(studentBill.value) / Number(numberOfStudent.value)) * Number(numberOfStudent.value)) + Number((Math.ceil(Number(studentBill.value) / Number(numberOfStudent.value)) * Number(numberOfStudent.value)) - Number(studentBill.value)) + Number(otherBill.value),
                    studentBill: studentBill.value,
                    numberOfStudent: numberOfStudent.value,
                    otherBill: otherBill.value
                });

                Quasar.Notify.create({
                    color: 'green-4',
                    textColor: 'white',
                    icon: 'cloud_done',
                    message: '設定しました。'
                });
                return;
            }
        }
    }
}