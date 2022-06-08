return {
    computed: {
        sumOfPlaning () {
            return store.state.prepare.goodies.reduce((pre,now) => pre + Number(now.price), 0);
        },
        studentBill () {
            return Math.ceil(Number(this.studentPerBill) / Number(this.numberOfStudent))
        },
        surplusBill () {
            return (this.perStudentBill * Number(this.numberOfStudent)) - Number(this.studentPerBill)
        },
        budgetSum () {
            return (Number(this.perStudentBill) * Number(this.numberOfStudent)) + Number(this.otherBill)
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
        const studentPerBill = Vue.ref(store.state.prepare.budget.studentBill == 0 ? store.state.prepare.goodies.reduce((pre,now) => pre + Number(now.price), 0) : store.state.prepare.budget.studentBill);
        const numberOfStudent = Vue.ref(store.state.prepare.budget.numberOfStudent);
        const otherBill = Vue.ref(store.state.prepare.budget.otherBill);
        store.commit('setTemporaryBill',(Math.ceil(Number(studentPerBill.value) / Number(numberOfStudent.value)) * Number(numberOfStudent.value)) + Number(otherBill.value));
        return {
            studentPerBill,
            numberOfStudent,
            otherBill,
            applytemporary : debounce(function(){
                store.commit('setTemporaryBill',this.budgetSum)
            }, 500),
            onSubmit () {
                store.commit('setBudget', {
                    summaryBill: (Math.ceil(Number(studentPerBill.value) / Number(numberOfStudent.value)) * Number(numberOfStudent.value)) + Number(otherBill.value),
                    studentBill: (Math.ceil(Number(studentPerBill.value) / Number(numberOfStudent.value)) * Number(numberOfStudent.value)),
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