<template>
    <div class="timer">
        <span>{{hour}}</span>
        <span>:</span>
        <span>{{min}}</span>
        <span>:</span>
        <span>{{sec}}</span>
    </div>
</template>

<script>
    export default {
        name: "Timer",
        data() {
            return {
                currentTime: Date.now()
            };
        },
        computed: {
            curTime() {
                return new Date(this.currentTime);
            },
            hour() {
                return `${this.curTime.getHours()}`.padStart(2,'0');
            },
            min() {
                return `${this.curTime.getMinutes()}`.padStart(2,'0');
            },
            sec() {
                return `${this.curTime.getSeconds()}`.padStart(2,'0');
            },
        },
        mounted() {
            this.getNextSec();
        },
        methods: {
            getNextSec() {
                this.currentTime = Date.now();
                this.$emit('cur-time', this.currentTime);
                const timeUntilNext = 1000 - this.currentTime % 1000;
                setTimeout(this.getNextSec, timeUntilNext);
            },
        },
    }
</script>

<style scoped>
    .timer {
        font-size: 40px;
    }
</style>