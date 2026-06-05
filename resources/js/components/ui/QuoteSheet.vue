<template>
    <div class="quote-sheet-wrapper">
        <div class="quote-sheet indie-flower-regular">
            <div class="hole-wrapper">
                <div class="hole"></div>
                <div class="hole"></div>
            </div>
            <p class="quote text-center">
                Evolution has a destination. Not to combat nature, but to
                supersede it. The final glorious evolution
            </p>
            <p class="author">Viktor</p>
        </div>
    </div>
</template>

<script></script>

<style lang="scss" scoped>
@use "@scss/token" as *;

.quote-sheet-wrapper {
    filter: drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.5));
}

.quote-sheet {
    background: repeating-linear-gradient(
        to bottom,
        #f9eeb1 0px,
        #f9eeb1 29px,
        #d8d3ba 29px,
        #d8ccba 30px
    );
    width: 500px;
    height: 500px;
    padding: $space-lg;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: relative;
    clip-path: polygon(
        0% 0%,
        100% 0%,
        100% 88%,
        97% 92%,
        94% 89%,
        91% 93%,
        87% 88%,
        83% 91%,
        79% 87%,
        75% 92%,
        71% 88%,
        67% 93%,
        63% 89%,
        59% 92%,
        55% 87%,
        51% 91%,
        47% 88%,
        43% 93%,
        39% 89%,
        35% 92%,
        31% 87%,
        27% 91%,
        23% 88%,
        19% 93%,
        15% 89%,
        11% 92%,
        7% 88%,
        3% 91%,
        0% 88%
    );
}

.hole-wrapper {
    display: flex;
    width: 100%;
    justify-content: space-around;
    align-items: center;
    position: absolute;
    top: 20px;
}

.hole {
    background: $ivory !important;
    height: 20px;
    width: 20px;
    border-radius: 99px;
    box-shadow: -1px -1px 1px 1px #00000079 inset;
}

.quote {
    font-size: 36px;
    color: $text-dark;
    line-height: 1.5;
}

.author {
    font-size: 24px;
    line-height: 1.5;
    color: $text-muted;
    align-self: flex-end;
    transform: rotate(-25deg);
    margin-right: 1em;
}
</style>
