<template>
    <div class="quote-sheet">
        <p class="quote">
            Evolution has a destination. Not to combat nature, but to supersede
            it. The final glorious evolution
        </p>
        <p class="author">- Viktor</p>
    </div>
</template>

<script></script>

<style lang="scss" scoped>
@use "@scss/token" as *;

.quote-sheet {
    background: repeating-linear-gradient(
        to bottom,
        #f9eeb1 0px,
        #f9eeb1 29px,
        #d8d3ba 29px,
        #d8ccba 30px
    );
    width: 500px;
    padding: $space-lg;
    margin-top: $space-sm;
}

.quote {
    font-family: $font-mono;
    font-size: 14px;
    color: $text-dark;
    line-height: 1.5;
}

.author {
    font-family: $font-mono;
    font-size: 12px;
    color: $text-muted;
    text-align: right;
}
</style>
