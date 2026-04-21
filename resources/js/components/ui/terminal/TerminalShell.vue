<template>
    <div class="screen_wrapper">
        <div class="terminal__wrapper">
            <div class="screw tl"></div>
            <div class="screw tr"></div>
            <div class="screw bl"></div>
            <div class="screw br"></div>
            <div
                class="terminal"
                :key="toggleKey"
                :class="{ 'is-on': isOn, 'is-off': !isOn && wasOn }"
            >
                <div class="terminal__header centered">
                    <div>MISSION BRIEF</div>
                </div>
                <div class="terminal__body mt-2">
                    <span class="comment"
                        >// DAWN-01 · shell placeholder — xterm.js + Laravel
                        WebSocket
                    </span>
                    <span class="comment">
                        // connect: wss://dawn-01.local/ws/shell
                    </span>
                    <span class="color--orange"
                        >@{{ username }} <span class="comment">~$</span>
                        <span class="color--ivory"> whoami </span>
                    </span>
                    <span class="color--green-crt"> operator </span>
                    <span class="color--orange"
                        >@{{ username }}<span class="comment">~$</span
                        ><span class="color--ivory">
                            systemctl status dawn.target
                        </span></span
                    >
                    <span class="comment">
                        <span class="status-dot status-dot--online"></span>
                        - local infratstructure <br />
                        loaded . active . running since 2024-06-01 12:00:00
                        <br />
                        12 units up . 1
                        <span class="color--green-crt">online</span>
                        (plex.service)
                    </span>
                    <span class="color--orange"
                        >@{{ username }}<span class="comment">~$</span
                        ><span class="color--ivory"
                            >&nbsp;{{ typedCommand }}</span
                        ><span class="cursor">▋</span></span
                    >
                </div>
                <div class="terminal__footer">
                    <div class="d-flex align-items-center gap-3">
                        <span>MODEL CRT-800 AV INPUT </span>
                    </div>
                </div>
            </div>
        </div>
        <terminal-controls :is-on="isOn" @toggle="toggle" />
    </div>
</template>

<script>
import TerminalControls from "./TerminalControls.vue";

export default {
    name: "TerminalShell",
    components: { TerminalControls },
    props: ["username"],
    data() {
        return {
            typedCommand: "",
            isOn: false,
            wasOn: false,
            toggleKey: 0,
            commands: [
                "systemctl restart plex.service",
                "htop",
                "journalctl -u plex",
                "tail -f /var/log/dawn.log",
                'docker ps --format "{{.Names}}"',
                "df -h /mnt/media",
                "ping -c 4 dawn-01.local",
            ],
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.isOn = true;
            this.wasOn = true;
            this._running = true;
            this._cmdIndex = 0;
            this._type();
        });
    },
    beforeUnmount() {
        this._running = false;
        clearTimeout(this._timer);
    },
    methods: {
        toggle() {
            if (this.isOn) {
                this.isOn = false;
                this._running = false;
                clearTimeout(this._timer);
                this.typedCommand = "";
            } else {
                this.wasOn = false;
                this.toggleKey++;
                this.$nextTick(() => {
                    this.isOn = true;
                    this.wasOn = true;
                    this._running = true;
                    this._cmdIndex = 0;
                    this._type();
                });
            }
        },
        _type() {
            const cmd = this.commands[this._cmdIndex];
            let i = 0;
            this.typedCommand = "";

            const erase = () => {
                if (!this._running) return;
                if (this.typedCommand.length > 0) {
                    this.typedCommand = this.typedCommand.slice(0, -1);
                    this._timer = setTimeout(erase, 30);
                } else {
                    this._cmdIndex =
                        (this._cmdIndex + 1) % this.commands.length;
                    this._timer = setTimeout(() => this._type(), 250);
                }
            };

            const tick = () => {
                if (!this._running) return;
                if (i < cmd.length) {
                    this.typedCommand += cmd[i++];
                    this._timer = setTimeout(tick, 75);
                } else {
                    this._timer = setTimeout(erase, 1200);
                }
            };

            tick();
        },
    },
};
</script>

<style lang="scss" scoped>
@use "@scss/token" as *;

$ease-out-quint: cubic-bezier(0.23, 1, 0.32, 1);
$ease-in-quint: cubic-bezier(0.755, 0.05, 0.855, 0.06);
$screen-bg: #121010;

@keyframes flicker {
    $steps: 50;
    @for $i from 0 through $steps {
        #{percentage($i * (1 / $steps))} {
            opacity: random();
        }
    }
}

@keyframes turn-on {
    0% {
        animation-timing-function: $ease-out-quint;
        transform: scale(0, 0.0001) translate3d(0, 0, 0);
        filter: brightness(50);
    }
    40% {
        transform: scale(0.9, 0.001) translate3d(0, 0, 0);
        filter: brightness(10);
    }
    100% {
        transform: scale(1, 1) translate3d(0, 0, 0);
        filter: brightness(1);
        opacity: 1;
    }
}

@keyframes turn-off {
    0% {
        transform: scale(1, 0.9) translate3d(0, 0, 0);
        filter: brightness(1);
        opacity: 1;
    }
    60% {
        transform: scale(0.9, 0.001) translate3d(0, 0, 0);
        filter: brightness(10);
    }
    100% {
        animation-timing-function: $ease-in-quint;
        transform: scale(0, 0.0001) translate3d(0, 0, 0);
        filter: brightness(50);
    }
}

@keyframes blink {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0;
    }
}

.screen_wrapper {
    border: $border-light;
    border-radius: $radius-lg;
    padding: $space-md;
    box-shadow: 5px 5px 10px 1px rgba(#000000, 0.5);
}
.terminal__wrapper {
    background: $anthracite;
    padding: $space-xl;
    border-radius: $radius-lg;
    position: relative;
}

.terminal {
    background: $screen-bg;
    color: $ivory;
    padding: $space-lg;
    border-radius: 15px;
    position: relative;
    overflow: hidden;

    &::before {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background:
            linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
            linear-gradient(
                90deg,
                rgba(255, 0, 0, 0.06),
                rgba(0, 255, 0, 0.02),
                rgba(0, 0, 255, 0.06)
            );
        background-size:
            100% 2px,
            3px 100%;
        z-index: 2;
        pointer-events: none;
    }

    &::after {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: rgba($screen-bg, 0.1);
        opacity: 0;
        z-index: 2;
        pointer-events: none;
    }

    .comment {
        color: $text-subtle;
    }

    &.is-on {
        animation: turn-on 0.55s $ease-in-quint forwards;

        &::after {
            animation: flicker 0.15s infinite;
        }
    }

    &.is-off {
        animation: turn-off 0.55s $ease-out-quint forwards;
    }
}

.terminal__header {
    background: $ivory;
    color: $text-dark;
    border-radius: $radius-md;
    padding: $space-xs $space-sm;
    box-shadow: $ivory 0px 0px 5px 2px;
}

.terminal__body {
    display: flex;
    flex-direction: column;
}

.terminal__footer {
    display: flex;
    justify-content: flex-end;
    margin-top: $space-md;
    color: $text-muted;
    font-size: 10px;
    opacity: 0.5;
}

.terminal__controls {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-top: $space-sm;
    gap: $space-sm;

    .btn_power {
        display: flex;
        align-items: center;
        gap: $space-sm;
        width: 15px;
        height: 15px;
        background-color: #ff0000;
    }
}

.cursor {
    color: $green-crt;
    animation: blink 1s step-end infinite;
}

.screw {
    position: absolute;
    width: 14px;
    height: 14px;
    background: linear-gradient(45deg, #555, #111);
    border-radius: 50%;
    border: 1px solid #000;
    box-shadow: inset 1px 1px 2px rgba(255, 255, 255, 0.2);
}
.screw::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 10px;
    height: 2px;
    background: #000;
    transform: translate(-50%, -50%) rotate(45deg);
}
.tl {
    top: 15px;
    left: 15px;
}
.tr {
    top: 15px;
    right: 15px;
    transform: rotate(90deg);
}
.bl {
    bottom: 15px;
    left: 15px;
    transform: rotate(180deg);
}
.br {
    bottom: 15px;
    right: 15px;
    transform: rotate(270deg);
}
</style>
