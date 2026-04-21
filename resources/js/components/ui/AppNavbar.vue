<template>
    <nav>
        <div class="navbar__logo p-2">
            <div class="border-right pe-4 text-uppercase">
                <h1>DAWN<span class="color--orange">-</span>01</h1>
                <div class="opacity-75 d-flex align-items-center gap-3">
                    <span>// local infrastructure</span>
                    <span class="step">·</span>
                    <span>node 01</span>
                    <span class="step">·</span>
                    <span>Mission active</span>
                </div>
            </div>
        </div>

        <div class="navbar__metrics centered gap-4">
            <div class="metric">
                <div class="metric__label">HOSTNAME</div>
                <div class="metric__value">dawn.local</div>
            </div>
            <div class="metric">
                <div class="metric__label">UPTIME</div>
                <div class="metric__value">{{ uptime }}</div>
            </div>
            <div class="metric">
                <div class="metric__label">SERVICES</div>
                <div class="metric__value">
                    {{ servicesOnline }} ONLINE <span class="step">·</span>
                    {{ servicesDown }} DOWN
                </div>
            </div>
        </div>

        <div class="navbar__control gap-4">
            <div class="navbar__clock border-right pe-4">
                <h2>
                    <span>
                        {{ time }}
                    </span>
                    <div class="input-orange"></div>
                </h2>
                <div class="navbar__date opacity-75">{{ formattedDate }}</div>
            </div>
            <div class="navbar__status pe-4">
                <div>nominal</div>
                <div class="status-dot status-dot--online"></div>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    name: "AppNavbar",
    props: ["time", "date", "username"],
    data() {
        return {
            // TODO: hériter du back
            uptime: "14d 06h",
            servicesOnline: 8,
            servicesDown: 0,
        };
    },
    computed: {
        formattedDate() {
            if (!this.date) return "";
            const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
            const months = [
                "JAN",
                "FEB",
                "MAR",
                "APR",
                "MAY",
                "JUN",
                "JUL",
                "AUG",
                "SEP",
                "OCT",
                "NOV",
                "DEC",
            ];
            const day = days[this.date.getDay()];
            const d = String(this.date.getDate()).padStart(2, "0");
            const month = months[this.date.getMonth()];
            const year = this.date.getFullYear();
            const offsetH = -this.date.getTimezoneOffset() / 60;
            const tz = `UTC${offsetH >= 0 ? "+" : ""}${offsetH}`;
            return `${day} . ${d} ${month} ${year} . ${tz}`;
        },
    },
};
</script>

<style lang="scss" scoped>
@use "../../../scss/token" as *;

nav {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    border-bottom: $border-light;
}

.navbar__logo {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

.navbar__clock {
    display: flex;
    flex-direction: column;
    align-items: stretch;

    h2 {
        align-self: flex-end;
        display: flex;
        align-items: center;
        gap: $space-sm;
    }
}

.navbar__date {
    font-family: $font-mono;
    font-size: $size-label;
    letter-spacing: $tracking-mono;
}

.navbar__metrics {
    border-right: $border-light;
    padding-right: $space-2xl;
    padding-left: $space-2xl;
}

.navbar__control {
    display: flex;
    align-items: center;
    justify-self: end;
}
.metric {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: $space-xs;

    &__label {
        font-family: $font-mono;
        font-size: $size-label;
        letter-spacing: $tracking-label;
        color: $text-muted;
        margin-bottom: $space-sm;
        text-transform: uppercase;
    }

    &__value {
        font-family: $font-mono;
        font-size: $size-body;
        letter-spacing: $tracking-mono;
        display: flex;
        align-items: center;
        gap: $space-xs;
    }
}

.navbar__status {
    display: flex;
    align-items: center;
    text-transform: uppercase;
    gap: $space-sm;
}

.input-orange {
    width: 15px;
    height: 1em;
    background-color: $orange;
    animation: blink 1s step-end infinite;
}

@keyframes blink {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0;
    }
}
</style>
