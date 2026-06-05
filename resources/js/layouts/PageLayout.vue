<template>
    <div class="page-layout">
        <AppNavbar :time="time" :date="now" :username="username" />
        <main class="page-layout__content">
            <slot name="content" />
        </main>
    </div>
</template>

<script>
import AppNavbar from "@/components/ui/AppNavbar.vue";

export default {
    name: "PageLayout",
    components: { AppNavbar },
    props: {
        username: {
            type: String,
            default: "pioneer",
        },
    },
    data() {
        return {
            now: new Date(),
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
        this._timer = setInterval(() => {
            this.now = new Date();
        }, 1000);
    },
    beforeUnmount() {
        clearInterval(this._timer);
    },
};
</script>

<style lang="scss" scoped>
.page-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;

    &__content {
        flex: 1;
    }
}
</style>
