<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" :class="{alarm:isOnTime}">
      <Timer v-on:cur-time="onTimeChange"/>
      <button @click="toggleHide">{{hideTodos ? '지난 일정 보기' : '지난 일정 숨기기'}}</button>
      <TodoList :cur-time="curTime"
                :hide-todos="hideTodos"
                v-on:next-todo="setNextTodo"/>
  </div>
</template>

<script>
import Timer from "./components/Timer";
import TodoList from "./components/TodoList";

export default {
   name: 'app',
   components: {
       Timer,
       TodoList,
   },
    data() {
        return {
            curTime: Date.now(),
            nextTodo: null,
            isOnTime: false,
            hideTodos: false,
        }
    },
    methods: {
        onTimeChange(time) {
            this.curTime = time;
        },
        setNextTodo(nextTodo) {
            if (this.nextTodo !== nextTodo) {
                if (this.nextTodo) this.shakeImage(60, nextTodo);
                this.nextTodo = nextTodo;
            }
        },
        shakeImage(duration, curTodo) {
            this.isOnTime = true;
            setTimeout(() => {
                if (this.nextTodo === curTodo) this.isOnTime = false;
            }, duration * 1000);
        },
        toggleHide() {
            this.hideTodos = !this.hideTodos;
        },
    }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
img.alarm {
    /* Start the shake animation and make the animation last for 0.5 seconds */
    animation: shake 0.5s;

    /* When the animation is finished, start again */
    animation-iteration-count: infinite;
}

@keyframes shake {
    0% { transform: translate(1px, 1px) rotate(0deg); }
    10% { transform: translate(-1px, -2px) rotate(-1deg); }
    20% { transform: translate(-3px, 0px) rotate(1deg); }
    30% { transform: translate(3px, 2px) rotate(0deg); }
    40% { transform: translate(1px, -1px) rotate(1deg); }
    50% { transform: translate(-1px, 2px) rotate(-1deg); }
    60% { transform: translate(-3px, 1px) rotate(0deg); }
    70% { transform: translate(3px, 1px) rotate(-1deg); }
    80% { transform: translate(-1px, -1px) rotate(1deg); }
    90% { transform: translate(1px, 2px) rotate(0deg); }
    100% { transform: translate(1px, -2px) rotate(-1deg); }
}
</style>
