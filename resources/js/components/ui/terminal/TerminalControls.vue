<template>
    <div class="terminal__controls">
        <power-switch :is-on="isOn" @toggle="$emit('toggle')" />

        <div class="divider" />

        <div class="ctrl-group">
            <div class="status-row">
                <span
                    class="status-dot"
                    :class="isOn ? 'status-dot--online' : 'status-dot--offline'"
                />
                <span class="ctrl-value">{{
                    isOn ? "ONLINE" : "OFFLINE"
                }}</span>
            </div>
            <span class="ctrl-label">SYS STATUS</span>
        </div>

        <div class="divider" />

        <div class="ctrl-group">
            <span class="ctrl-label">S/N</span>
            <span class="ctrl-value">CRT-800-A1</span>
        </div>

        <div class="divider" />

        <div class="ctrl-group">
            <span class="ctrl-label">SIGNAL </span>
            <div class="vu">
                <div class="vu__bars">
                    <div
                        v-for="(bar, i) in bars"
                        :key="i"
                        class="vu__bar"
                        :style="{
                            height: bar.height + 'px',
                            background: bar.color,
                            opacity: bar.active ? 1 : 0.5,
                        }"
                    />
                </div>
                <div class="vu__labels">
                    <span>-∞</span>
                    <span>-12</span>
                    <span>-6</span>
                    <span>0</span>
                </div>
            </div>
        </div>

        <div class="divider ms-auto" />

        <div class="ctrl-group align-end">
            <span class="ctrl-value">DAWN-01</span>
            <span class="ctrl-label">© 1994 CORP SYSTEMS</span>
        </div>
    </div>
</template>

<script>
import PowerSwitch from "../../../shared/PowerSwitch.vue";

export default {
    name: "TerminalControls",
    components: { PowerSwitch },
    props: {
        isOn: { type: Boolean, default: false },
    },
    emits: ["toggle"],
    data() {
        return {
            colors: [
                "#39ff14",
                "#39ff14",
                "#39ff14",
                "#39ff14",
                "#39ff14",
                "#39ff14",
                "#39ff14",
                "#39ff14",
                "#e8a020",
                "#e8a020",
                "#cc1a1a",
                "#cc1a1a",
            ],
            maxH: [8, 10, 12, 14, 16, 18, 18, 18, 18, 18, 18, 18],
            inactive: "#d8ccba",
            bars: Array.from({ length: 12 }, () => ({
                height: 3,
                color: "#d8ccba",
                active: false,
            })),
            _target: 7,
            _current: 7,
            _timer: null,
        };
    },
    watch: {
        isOn(val) {
            if (val) {
                this._animate();
            } else {
                clearTimeout(this._timer);
                this.bars = this.bars.map(() => ({
                    height: 3,
                    color: this.inactive,
                    active: false,
                }));
            }
        },
    },
    mounted() {
        this._animate();
    },
    beforeUnmount() {
        clearTimeout(this._timer);
    },
    methods: {
        _animate() {
            if (!this.isOn) return;
            this._target += (Math.random() - 0.48) * 3;
            this._target = Math.max(0, Math.min(12, this._target));
            this._current += (this._target - this._current) * 0.4;

            const active = Math.round(this._current);
            this.bars = this.bars.map((_, i) => ({
                height: i < active ? this.maxH[i] : 3,
                color: i < active ? this.colors[i] : this.inactive,
                active: i < active,
            }));

            this._timer = setTimeout(this._animate, 80 + Math.random() * 60);
        },
    },
};
</script>

<style lang="scss" scoped>
@use "@scss/token" as *;

.terminal__controls {
    display: flex;
    align-items: center;
    gap: $space-md;
    background: $ivory;
    border-radius: $radius-lg;
    padding: $space-sm $space-lg;
    margin-top: $space-sm;
}

.divider {
    width: 1px;
    height: 44px;
    background: $ivory-border;
    flex-shrink: 0;
}

.ctrl-group {
    display: flex;
    flex-direction: column;
    gap: 4px;

    &.align-end {
        align-items: flex-end;
    }
}

.ctrl-label {
    font-family: $font-mono;
    font-size: 9px;
    color: $text-muted;
    letter-spacing: 2px;
    text-transform: uppercase;
}

.ctrl-value {
    font-family: $font-mono;
    font-size: 10px;
    color: $text-dark;
    letter-spacing: 1.5px;
}

.status-row {
    display: flex;
    align-items: center;
    gap: 6px;
}

.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;

    &--online {
        background: $green-crt;
        animation: pulse 2s ease-in-out infinite;
    }

    &--offline {
        background: $red-alert;
        opacity: 0.5;
    }
}

.vu {
    display: flex;
    flex-direction: column;
    gap: 3px;

    &__bars {
        display: flex;
        gap: 2px;
        align-items: flex-end;
        height: 18px;
    }

    &__bar {
        width: 5px;
        border-radius: 1px;
        transition:
            height 0.08s ease,
            background 0.08s ease;
    }

    &__labels {
        display: flex;
        justify-content: space-between;
        padding: 0 1px;

        span {
            font-family: $font-mono;
            font-size: 7px;
            color: $text-muted;
        }
    }
}

@keyframes pulse {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0.4;
    }
}
</style>
