<template>
    <PageLayout>
        <template #content>
            <div class="d-flex gap-5 mt-4" style="justify-content: space-around">
                <quote-sheet />
                <terminal-shell :date="now" :username="username" />
            </div>
            <service-grid />
        </template>
    </PageLayout>
</template>

<script>
import PageLayout from "@/layouts/PageLayout.vue";
import TerminalShell from "@/components/ui/terminal/TerminalShell.vue";
import QuoteSheet from "@/components/ui/QuoteSheet.vue";
import ServiceGrid from "@/components/ui/ServiceGrid.vue";

export default {
    name: "HomeView",
    components: { PageLayout, TerminalShell, QuoteSheet, ServiceGrid },
    data() {
        return {
            now: new Date(),
            username: "pioneer",
        };
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
