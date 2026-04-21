<template>
    <AppNavbar :time="time" :date="now" :username="username" />

    <div class="centered gap-5 mt-4" style="justify-content: space-around">
        <quote-sheet />
        <terminal-shell :date="now" :username="username" />
    </div>
</template>

<script>
import AppNavbar from "../components/ui/AppNavbar.vue";
import TerminalShell from "../components/ui/terminal/TerminalShell.vue";
import QuoteSheet from "../components/QuoteSheet.vue";

export default {
    name: "HomeView",
    components: { AppNavbar, TerminalShell, QuoteSheet },
    data() {
        return {
            now: new Date(),
            username: "pioneer",
        };
    },
    computed: {
        time() {
            return this.now.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });
        },
    },
    mounted() {
        this.timer = setInterval(() => {
            this.now = new Date();
        }, 1000);
    },
    beforeUnmount() {
        clearInterval(this.timer);
    },
};
</script>
