<template>
    <PageLayout>
        <template #content>
            <div class="ytdl-page">
                <Ytdl />
            </div>
        </template>
    </PageLayout>
</template>

<script>
import PageLayout from "@/layouts/PageLayout.vue";
import Ytdl from "@/components/ui/terminal/Ytdl.vue";

export default {
    name: "YtdlView",
    components: { PageLayout, Ytdl },
};
</script>

<style lang="scss" scoped>
@use "@scss/token" as t;

.ytdl-page {
    max-width: 560px;
    margin: 2rem auto;
    padding: 0 1rem;
}
</style>
