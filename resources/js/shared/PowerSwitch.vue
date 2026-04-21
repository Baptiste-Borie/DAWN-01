<template>
    <label class="switch">
        <input type="checkbox" :checked="isOn" @change="$emit('toggle')" />
        <div class="button">
            <div class="light"></div>
            <div class="dots"></div>
            <div class="characters"></div>
            <div class="shine"></div>
            <div class="shadow"></div>
        </div>
    </label>
</template>

<script>
export default {
    name: "PowerSwitch",
    props: ["isOn"],
    emits: ["toggle"],
};
</script>

<style lang="scss" scoped>
.switch {
    --scale: 0.3;

    display: block;
    background-color: black;
    width: calc(150px * var(--scale));
    height: calc(195px * var(--scale));

    box-shadow:
        0 0 calc(10px * var(--scale)) calc(2px * var(--scale))
            rgba(0, 0, 0, 0.2),
        0 0 calc(1px * var(--scale)) calc(2px * var(--scale)) black,
        inset 0 calc(2px * var(--scale)) calc(2px * var(--scale))
            calc(-2px * var(--scale)) white,
        inset 0 0 calc(2px * var(--scale)) calc(15px * var(--scale)) #47434c,
        inset 0 0 calc(2px * var(--scale)) calc(22px * var(--scale)) black;

    border-radius: calc(5px * var(--scale));
    padding: calc(20px * var(--scale));
    perspective: calc(700px * var(--scale));
}

.switch input {
    display: none;
}

.switch input:checked + .button {
    transform: translateZ(calc(20px * var(--scale))) rotateX(25deg);
    box-shadow: 0 calc(-10px * var(--scale)) calc(20px * var(--scale)) #ff1818;
}

.switch input:checked + .button .light {
    animation: flicker 0.2s infinite 0.3s;
}

.switch input:checked + .button .shine {
    opacity: 1;
}

.switch input:checked + .button .shadow {
    opacity: 0;
}

.switch .button {
    display: block;
    transition: all 0.3s cubic-bezier(1, 0, 1, 1);
    transform-origin: center center calc(-20px * var(--scale));
    transform: translateZ(calc(20px * var(--scale))) rotateX(-25deg);
    transform-style: preserve-3d;
    background-color: #9b0621;
    height: 100%;
    position: relative;
    cursor: pointer;
    background: linear-gradient(
        #980000 0%,
        #6f0000 30%,
        #6f0000 70%,
        #980000 100%
    );
    background-repeat: no-repeat;
}

.switch .button::before {
    content: "";
    background:
        linear-gradient(
                rgba(255, 255, 255, 0.8) 10%,
                rgba(255, 255, 255, 0.3) 30%,
                #650000 75%,
                #320000
            )
            50% 50%/97% 97%,
        #b10000;
    background-repeat: no-repeat;
    width: 100%;
    height: calc(50px * var(--scale));
    transform-origin: top;
    transform: rotateX(-90deg);
    position: absolute;
    top: 0;
}

.switch .button::after {
    content: "";
    background-image: linear-gradient(#650000, #320000);
    width: 100%;
    height: calc(50px * var(--scale));
    transform-origin: top;
    transform: translateY(calc(50px * var(--scale))) rotateX(-90deg);
    position: absolute;
    bottom: 0;
    box-shadow:
        0 calc(50px * var(--scale)) calc(8px * var(--scale)) 0px black,
        0 calc(80px * var(--scale)) calc(20px * var(--scale)) 0px
            rgba(0, 0, 0, 0.5);
}

.switch .light {
    opacity: 0;
    animation: light-off 1s;
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(#ffc97e, #ff1818 40%, transparent 70%);
}

.switch .dots {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(
        transparent 30%,
        rgba(101, 0, 0, 0.7) 70%
    );
    background-size: calc(10px * var(--scale)) calc(10px * var(--scale));
}

.switch .characters {
    position: absolute;
    width: 100%;
    height: 100%;
    background:
        linear-gradient(white, white) 50% 20% / calc(5%) calc(20%),
        radial-gradient(
                circle,
                transparent 50%,
                white 52%,
                white 70%,
                transparent 72%
            )
            50% 80% / calc(33%) calc(25%);
    background-repeat: no-repeat;
}

.switch .shine {
    transition: all 0.3s cubic-bezier(1, 0, 1, 1);
    opacity: 0.3;
    position: absolute;
    width: 100%;
    height: 100%;
    background:
        linear-gradient(white, transparent 3%) 50% 50%/97% 97%,
        linear-gradient(
                rgba(255, 255, 255, 0.5),
                transparent 50%,
                transparent 80%,
                rgba(255, 255, 255, 0.5)
            )
            50% 50%/97% 97%;
    background-repeat: no-repeat;
}

.switch .shadow {
    transition: all 0.3s cubic-bezier(1, 0, 1, 1);
    opacity: 1;
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(transparent 70%, rgba(0, 0, 0, 0.8));
    background-repeat: no-repeat;
}

@keyframes flicker {
    0% {
        opacity: 1;
    }
    80% {
        opacity: 0.8;
    }
    100% {
        opacity: 1;
    }
}

@keyframes light-off {
    0% {
        opacity: 1;
    }
    80% {
        opacity: 0;
    }
}
</style>
