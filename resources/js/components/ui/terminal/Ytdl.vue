<template>
    <div class="ytdl-service">
        <!-- Header -->
        <div class="ytdl-header">
            <div class="ytdl-title">
                <span class="ytdl-icon" aria-hidden="true">▶</span>
                YT EXTRACTOR
            </div>
            <div class="ytdl-status" :class="statusClass">
                <span class="ytdl-dot" />
                {{ statusLabel }}
            </div>
        </div>

        <!-- URL Input -->
        <div class="ytdl-input-row">
            <input
                v-model="url"
                type="text"
                class="ytdl-input"
                placeholder="https://youtube.com/watch?v=..."
                :disabled="isRunning"
                @paste="onPaste"
            />
        </div>

        <!-- Controls -->
        <div class="ytdl-controls">
            <div class="ytdl-format-tabs">
                <button
                    class="ytdl-tab"
                    :class="{ active: format === 'mp3' }"
                    :disabled="isRunning"
                    @click="format = 'mp3'"
                >
                    MP3
                </button>
                <button
                    class="ytdl-tab"
                    :class="{ active: format === 'mp4' }"
                    :disabled="isRunning"
                    @click="format = 'mp4'"
                >
                    MP4
                </button>
            </div>

            <Transition name="ytdl-fade">
                <select
                    v-if="format === 'mp4'"
                    v-model="quality"
                    class="ytdl-select"
                    :disabled="isRunning"
                >
                    <option value="best">BEST</option>
                    <option value="1080">1080p</option>
                    <option value="720">720p</option>
                    <option value="480">480p</option>
                </select>
            </Transition>

            <button
                class="ytdl-submit"
                :disabled="!canStart"
                @click="startDownload"
            >
                <template v-if="!isRunning">EXTRACT</template>
                <template v-else>
                    <span class="ytdl-spinner">RUNNING</span>
                </template>
            </button>
        </div>

        <!-- Progress -->
        <Transition name="ytdl-slide">
            <div v-if="job" class="ytdl-progress">
                <div v-if="job.title" class="ytdl-track-title">
                    {{ job.title }}
                </div>

                <div class="ytdl-bar-row">
                    <div class="ytdl-bar-track">
                        <div
                            class="ytdl-bar-fill"
                            :class="{
                                'ytdl-bar-done': job.status === 'done',
                                'ytdl-bar-error': job.status === 'error',
                            }"
                            :style="{ width: job.progress + '%' }"
                        />
                    </div>
                    <span class="ytdl-pct"
                        >{{ Math.round(job.progress) }}%</span
                    >
                </div>

                <div class="ytdl-meta">
                    <span v-if="job.speed">
                        <span class="ytdl-lbl">SPD</span> {{ job.speed }}
                    </span>
                    <span v-if="job.eta">
                        <span class="ytdl-lbl">ETA</span> {{ job.eta }}
                    </span>
                    <span v-if="job.status === 'error'" class="ytdl-error-msg">
                        ⚠ {{ job.error }}
                    </span>
                </div>

                <Transition name="ytdl-fade">
                    <div v-if="job.status === 'done'" class="ytdl-done-row">
                        <button class="ytdl-save-btn" @click="downloadFile">
                            ↓ SAVE {{ format.toUpperCase() }}
                        </button>
                        <button class="ytdl-reset-btn" @click="reset">
                            NEW
                        </button>
                    </div>
                </Transition>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from "vue";
import axios from "axios";

// ── State ──────────────────────────────────────────────────────────────────
const url = ref("");
const format = ref("mp3");
const quality = ref("best");
const job = ref(null);
const jobId = ref(null);
const pollTimer = ref(null);

// ── Computed ───────────────────────────────────────────────────────────────
const isRunning = computed(
    () => job.value && ["pending", "downloading"].includes(job.value.status),
);

const canStart = computed(() => url.value.trim() && !isRunning.value);

const statusLabel = computed(() => {
    if (!job.value) return "IDLE";
    return (
        {
            pending: "PENDING",
            downloading: "DOWNLOADING",
            done: "DONE",
            error: "ERROR",
        }[job.value.status] ?? "IDLE"
    );
});

const statusClass = computed(() => {
    if (!job.value) return "ytdl-idle";
    return (
        {
            pending: "ytdl-pending",
            downloading: "ytdl-running",
            done: "ytdl-done",
            error: "ytdl-error",
        }[job.value.status] ?? "ytdl-idle"
    );
});

// ── Methods ────────────────────────────────────────────────────────────────
async function startDownload() {
    if (!canStart.value) return;

    job.value = {
        status: "pending",
        progress: 0,
        speed: null,
        eta: null,
        title: null,
    };

    try {
        const res = await axios.post("/api/ytdl/start", {
            url: url.value.trim(),
            format: format.value,
            quality: quality.value,
        });
        jobId.value = res.data.job_id;
        startPolling();
    } catch (e) {
        job.value = {
            status: "error",
            progress: 0,
            error: e.response?.data?.error ?? "Request failed",
        };
    }
}

function startPolling() {
    pollTimer.value = setInterval(async () => {
        try {
            const res = await axios.get(`/api/ytdl/progress/${jobId.value}`);
            job.value = res.data;
            if (["done", "error"].includes(res.data.status)) {
                clearInterval(pollTimer.value);
            }
        } catch {
            clearInterval(pollTimer.value);
            if (job.value) job.value.status = "error";
        }
    }, 800);
}

function downloadFile() {
    window.location.href = `/api/ytdl/file/${jobId.value}`;
}

async function reset() {
    if (jobId.value) {
        await axios.delete(`/api/ytdl/${jobId.value}`).catch(() => {});
    }
    job.value = null;
    jobId.value = null;
    url.value = "";
}

function onPaste(e) {
    const text = e.clipboardData?.getData("text") ?? "";
    if (text.match(/youtube\.com|youtu\.be/)) {
        url.value = text;
        e.preventDefault();
    }
}

onUnmounted(() => clearInterval(pollTimer.value));
</script>

<style lang="scss" scoped>
@use "@scss/token" as t;

.ytdl-service {
    background: #0d0d0d;
    border: 1px solid rgba(201, 78, 30, 0.3);
    padding: 1.5rem;
    font-family: "IBM Plex Mono", monospace;
    color: #f5efe4;
    position: relative;

    // Corner bracket decoration
    &::before,
    &::after {
        content: "";
        position: absolute;
        width: 12px;
        height: 12px;
        border-color: #c94e1e;
        border-style: solid;
        pointer-events: none;
    }
    &::before {
        top: 6px;
        left: 6px;
        border-width: 1px 0 0 1px;
    }
    &::after {
        bottom: 6px;
        right: 6px;
        border-width: 0 1px 1px 0;
    }
}

.ytdl-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.25rem;
}

.ytdl-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    letter-spacing: 0.15em;
    color: #c94e1e;
    font-weight: 600;
}

.ytdl-icon {
    font-size: 10px;
}

.ytdl-status {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 10px;
    letter-spacing: 0.1em;

    &.ytdl-idle {
        color: rgba(245, 239, 228, 0.35);
    }
    &.ytdl-pending {
        color: #e8a020;
    }
    &.ytdl-running {
        color: #39ff14;
    }
    &.ytdl-done {
        color: #39ff14;
    }
    &.ytdl-error {
        color: #cc1a1a;
    }
}

.ytdl-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    flex-shrink: 0;

    .ytdl-running & {
        animation: ytdl-blink 1s step-end infinite;
    }
    .ytdl-pending & {
        animation: ytdl-blink 1.5s step-end infinite;
    }
}

@keyframes ytdl-blink {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0.2;
    }
}

.ytdl-input-row {
    margin-bottom: 0.75rem;
}

.ytdl-input {
    width: 100%;
    background: rgba(245, 239, 228, 0.04);
    border: 1px solid rgba(245, 239, 228, 0.15);
    color: #f5efe4;
    font-family: "IBM Plex Mono", monospace;
    font-size: 12px;
    padding: 0.6rem 0.75rem;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.2s;

    &::placeholder {
        color: rgba(245, 239, 228, 0.25);
    }
    &:focus {
        border-color: rgba(201, 78, 30, 0.6);
    }
    &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
}

.ytdl-controls {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
}

.ytdl-format-tabs {
    display: flex;
    border: 1px solid rgba(245, 239, 228, 0.15);
}

.ytdl-tab {
    background: transparent;
    border: none;
    color: rgba(245, 239, 228, 0.4);
    font-family: "IBM Plex Mono", monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    padding: 0.4rem 0.75rem;
    cursor: pointer;
    transition:
        background 0.15s,
        color 0.15s;

    &.active {
        background: #c94e1e;
        color: #f5efe4;
    }
    &:not(.active):not(:disabled):hover {
        background: rgba(201, 78, 30, 0.15);
        color: #f5efe4;
    }
    &:disabled {
        cursor: not-allowed;
        opacity: 0.4;
    }
}

.ytdl-select {
    background: rgba(245, 239, 228, 0.04);
    border: 1px solid rgba(245, 239, 228, 0.15);
    color: #f5efe4;
    font-family: "IBM Plex Mono", monospace;
    font-size: 11px;
    padding: 0.4rem 0.5rem;
    outline: none;
    cursor: pointer;

    &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
    option {
        background: #1a1a1a;
    }
}

.ytdl-submit {
    margin-left: auto;
    background: #c94e1e;
    border: none;
    color: #f5efe4;
    font-family: "IBM Plex Mono", monospace;
    font-size: 11px;
    letter-spacing: 0.12em;
    font-weight: 600;
    padding: 0.45rem 1.25rem;
    cursor: pointer;
    transition:
        background 0.15s,
        transform 0.1s;

    &:hover:not(:disabled) {
        background: #a83e16;
    }
    &:active:not(:disabled) {
        transform: scale(0.97);
    }
    &:disabled {
        opacity: 0.35;
        cursor: not-allowed;
    }
}

.ytdl-spinner::after {
    content: "...";
    display: inline-block;
    overflow: hidden;
    width: 1.5ch;
    animation: ytdl-dots 1.2s steps(4, end) infinite;
    vertical-align: bottom;
}

@keyframes ytdl-dots {
    0% {
        width: 0;
    }
    33% {
        width: 0.5ch;
    }
    66% {
        width: 1ch;
    }
    100% {
        width: 1.5ch;
    }
}

.ytdl-progress {
    border-top: 1px solid rgba(245, 239, 228, 0.08);
    padding-top: 1rem;
}

.ytdl-track-title {
    font-size: 12px;
    color: rgba(245, 239, 228, 0.7);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0.75rem;
}

.ytdl-bar-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
}

.ytdl-bar-track {
    flex: 1;
    height: 3px;
    background: rgba(245, 239, 228, 0.1);
    overflow: hidden;
}

.ytdl-bar-fill {
    height: 100%;
    background: #c94e1e;
    transition: width 0.4s ease;

    &.ytdl-bar-done {
        background: #39ff14;
    }
    &.ytdl-bar-error {
        background: #cc1a1a;
    }
}

.ytdl-pct {
    font-size: 11px;
    color: rgba(245, 239, 228, 0.5);
    min-width: 3ch;
    text-align: right;
}

.ytdl-meta {
    display: flex;
    gap: 1.25rem;
    font-size: 10px;
    color: rgba(245, 239, 228, 0.4);
    letter-spacing: 0.05em;
}

.ytdl-lbl {
    color: rgba(201, 78, 30, 0.7);
    margin-right: 4px;
}

.ytdl-error-msg {
    color: #cc1a1a;
}

.ytdl-done-row {
    display: flex;
    gap: 0.75rem;
    margin-top: 1rem;
}

.ytdl-save-btn {
    flex: 1;
    background: rgba(57, 255, 20, 0.1);
    border: 1px solid rgba(57, 255, 20, 0.4);
    color: #39ff14;
    font-family: "IBM Plex Mono", monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
        background: rgba(57, 255, 20, 0.2);
    }
}

.ytdl-reset-btn {
    background: transparent;
    border: 1px solid rgba(245, 239, 228, 0.15);
    color: rgba(245, 239, 228, 0.4);
    font-family: "IBM Plex Mono", monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    padding: 0.5rem 0.75rem;
    cursor: pointer;
    transition: all 0.15s;

    &:hover {
        border-color: rgba(245, 239, 228, 0.35);
        color: #f5efe4;
    }
}

.ytdl-fade-enter-active,
.ytdl-fade-leave-active {
    transition: opacity 0.2s;
}
.ytdl-fade-enter-from,
.ytdl-fade-leave-to {
    opacity: 0;
}

.ytdl-slide-enter-active {
    transition:
        opacity 0.25s ease,
        transform 0.25s ease;
}
.ytdl-slide-leave-active {
    transition:
        opacity 0.2s ease,
        transform 0.2s ease;
}
.ytdl-slide-enter-from,
.ytdl-slide-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}
</style>
