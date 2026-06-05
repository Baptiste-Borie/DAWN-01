<template>
    <div class="service-grid-wrapper">
        <div class="service-bar">
            <div
                v-for="service in services"
                :key="service.id"
                class="slot"
                :class="[service.status, { active: activeSlot === service.id }]"
                @click="toggleSlot(service)"
            >
                <div class="slot-header">
                    <span class="slot-mod">{{ service.mod }}</span>
                    <div class="slot-dot" :class="service.status"></div>
                </div>

                <div class="slot-hublot">
                    <component
                        :is="service.icon"
                        v-if="service.icon"
                        class="slot-hublot-icon"
                        aria-hidden="true"
                    />
                </div>

                <span class="slot-name">{{ service.name }}</span>
            </div>
        </div>

        <Transition name="panel-slide">
            <div v-if="activeService" class="service-panel">
                <!-- future inline service panels -->
            </div>
        </Transition>
    </div>
</template>

<script>
export default {
    name: "ServiceGrid",
    data() {
        return {
            activeSlot: null,
            services: [
                {
                    id: "monitoring",
                    mod: "MOD · 01",
                    name: "Monitoring",
                    status: "offline",
                    icon: null,
                },
                {
                    id: "ytdl",
                    mod: "MOD · 02",
                    name: "YT Extractor",
                    status: "online",
                    icon: null,
                    route: "ytdl",
                },
                {
                    id: "slot3",
                    mod: "MOD · 03",
                    name: "Slot libre",
                    status: "unknown",
                    icon: null,
                },
                {
                    id: "slot4",
                    mod: "MOD · 04",
                    name: "Slot libre",
                    status: "unknown",
                    icon: null,
                },
                {
                    id: "slot5",
                    mod: "MOD · 05",
                    name: "Slot libre",
                    status: "unknown",
                    icon: null,
                },
            ],
        };
    },
    computed: {
        activeService() {
            return this.services.find((s) => s.id === this.activeSlot) ?? null;
        },
    },
    methods: {
        toggleSlot(service) {
            if (service.status === "unknown") return;
            if (service.route) {
                this.$router.push({ name: service.route });
                return;
            }
            this.activeSlot = this.activeSlot === service.id ? null : service.id;
        },
    },
};
</script>

<style lang="scss" scoped>
@use "@scss/token" as *;

.service-grid-wrapper {
    margin: $space-md $space-lg;
}

.service-bar {
    border: 0.5px solid #d8ccba;
    border-radius: 6px;
    display: flex;
    overflow: hidden;
}

.slot {
    flex: 1;
    border-right: 0.5px solid #d8ccba;
    padding: 10px 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    position: relative;
    transition: background 0.2s;
    cursor: pointer;

    &:last-child {
        border-right: none;
    }
    &:hover:not(.unknown) {
        background: rgba(201, 78, 30, 0.03);
    }
    &.active {
        background: rgba(201, 78, 30, 0.06);
    }
    &.unknown {
        opacity: 0.4;
        cursor: default;
    }

    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
    }
    &.online::before {
        background: $green-crt;
    }
    &.offline::before {
        background: $red-alert;
    }
}

.slot-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.slot-mod {
    font-family: $font-mono;
    font-size: 8px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #a89e92;
}

.slot-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;

    &.online {
        background: $green-crt;
        box-shadow: 0 0 5px $green-crt;
        animation: pulse 2s ease-in-out infinite;
    }
    &.offline {
        background: $red-alert;
    }
    &.unknown {
        background: #c8bcaa;
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

.slot-hublot {
    width: 80px;
    height: 80px;
    background: rgba(216, 204, 186, 0.2);
    border-radius: 50%;
    border: 0.5px dashed #d8ccba;
    display: flex;
    align-items: center;
    justify-content: center;
}

.slot-hublot-icon {
    font-size: 20px;
    opacity: 0.5;
}

.slot-name {
    font-family: $font-mono;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: $text-dark;
    text-align: center;
}

.service-panel {
    border: 0.5px solid #d8ccba;
    border-top: none;
    border-radius: 0 0 6px 6px;
    overflow: hidden;
}

.panel-slide-enter-active {
    transition:
        opacity 0.25s ease,
        transform 0.25s ease;
}
.panel-slide-leave-active {
    transition:
        opacity 0.2s ease,
        transform 0.2s ease;
}
.panel-slide-enter-from,
.panel-slide-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}
</style>
