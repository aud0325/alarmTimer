<template>
    <div>
        <button @click="initTodoList">일정 갱신</button>
        <table>
            <tr v-for="(todo, index) in todoList" v-bind:key="index" :class="todoClass(todo)">
                <td class="dateInfo"> {{todo.moment.format('YYYY.MM.DD (dd)')}} </td>
                <td class="timeInfo"> {{todo.moment.format('HH시 mm분')}} </td>
                <td class="todoName"> {{todo.name}} </td>
            </tr>
        </table>
    </div>
    
</template>

<script>
    import moment from 'moment';

    export default {
        name: "TodoList",
        props: {
            curTime: Number,
            hideTodos: Boolean,
        },
        data() {
            return {
                todoList: [],
            }
        },
        computed: {
            curMoment() {
                return moment(this.curTime);
            },
            date() {
                return this.curMoment.format('YYYY.MM.DD');
            },
            time() {
                return this.curMoment.format('HH시 mm분');
            },
            nextTodo() {
                return this.todoList.find((todo) => {
                    return (Number(todo.date + todo.time) - Number(this.curMoment.format('YYYYMMDDHHmm'))) > 0;
                });
            },
        },
        mounted() {
            this.initTodoList();
        },
        watch: {
            nextTodo(nextTodo) {
                this.$emit('next-todo', nextTodo);
            },
        },
        methods: {
            initTodoList() {
                this.readFile()
                    .then(this.setTodoList);
            },
            async readFile() {
                let result = '';
                try {
                    result = await import('raw-loader!../assets/data.txt');
                } catch (e) {
                    console.error('cant get data');
                }
                return result.default;
            },
            setTodoList(data) {
                if (!data || 'string' !== typeof data) {
                    console.error('');
                    return;
                }
                this.todoList = data
                    .split('\n')
                    .filter(todo => !!todo) // 빈 값을 제거하기 위한 필터
                    .map(this.parseTodoList)
                    .filter(this.validTodo)
                    .map(this.setMoment)
                    .sort(this.compareTodo);
            },
            parseTodoList(todoString) {
                const array = todoString.split(' ');
                return {
                    date: this.getDate(array.splice(0,1)[0]),
                    time: array.splice(0,1)[0]||'',
                    name: array.join(' ')||''
                }
            },
            compareTodo(firstTodo, secondTodo) {
                const dateDiff = Number(firstTodo.date) - Number(secondTodo.date);
                return dateDiff === 0 ? Number(firstTodo.time) - Number(secondTodo.time) : dateDiff;
            },
            validTodo(todo) {
                if (todo.date.length !== 8 || todo.time.length !== 4){
                    console.error('invalidTodo!', todo);
                    return false
                }
                return true;
            },
            setMoment(todo) {
                todo.moment = moment(todo.date + ' ' + todo.time);
                return todo;
            },
            todoClass(todo) {
                const diff = Number(todo.date + todo.time) - Number(this.curMoment.format('YYYYMMDDHHmm'));
                return {
                    isPassed: diff <= 0,
                    isSoon: diff > 0 && diff < 100,
                    isVerySoon: diff > -10 && diff < 5,
                    hide: diff < 0 && this.hideTodos,
                }
            },
            getDate(date) {
                if (date.length === 8) return date;
                else if (date.includes('요일')) return this.getNextDay(date);
                return '';
            },
            getNextDay(date) {
                return moment().day(date).format('YYYYMMDD');
            },

        },
    }
</script>

<style scoped>
    table {
        width:100%;
        max-width: 600px;
        margin: auto;
    }
    td {
        border-bottom: 1px solid #ddd;
    }
    .dateInfo {
        font-size: 12px;
        width:90px;
    }
    .timeInfo {
        font-size: 16px;
        width:90px;
    }
    .todoName {
        font-size: 20px;
    }
    .isPassed {
        text-decoration: line-through;
        background-color: gainsboro;
    }
    .isSoon {
        font-weight: bold;
    }
    .hide {
        display: none;
    }
    .isVerySoon{
        text-decoration: blink;
        -webkit-animation-name: highlight;
        -webkit-animation-duration: 0.6s;
        -webkit-animation-iteration-count:infinite;
        -webkit-animation-timing-function:ease-in-out;
        -webkit-animation-direction: alternate;
    }
    @-webkit-keyframes highlight {
        from {color: red;}
        to {color: black;}
    }
</style>