import { fetchList } from '../content.js';
import { getVideoThumbnail, getYoutubeIdFromUrl, shuffle } from '../util.js';

import Spinner from '../components/Spinner.js';
import Btn from '../components/Btn.js';

export default {
    components: { Spinner, Btn },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-roulette">
            <!-- Sidebar: Controls & Options -->
            <div class="sidebar">
                <div class="sidebar-card">
                    <div class="card-header">
                        <h3>Game Settings</h3>
                        <p class="type-label-md subtitle">
                            Extreme Demon Roulette mode
                        </p>
                    </div>
                    <form class="options">
                        <label class="check-label" for="main">
                            <input type="checkbox" id="main" value="Main List" v-model="useMainList">
                            <span>Main List (Top 75)</span>
                        </label>
                        <label class="check-label" for="extended">
                            <input type="checkbox" id="extended" value="Extended List" v-model="useExtendedList">
                            <span>Extended List (76-150)</span>
                        </label>
                        <label class="check-label" for="other">
                            <input type="checkbox" id="other" value="Other" v-model="useOther">
                            <span>Legacy / Other</span>
                        </label>
                        <Btn class="start-btn" @click.native.prevent="onStart">{{ levels.length === 0 ? 'Start Game' : 'Restart Game'}}</Btn>
                    </form>
                </div>

                <!-- Progress Dashboard Card -->
                <div class="sidebar-card" v-if="levels.length > 0">
                    <div class="card-header">
                        <h3>Progress</h3>
                        <p class="type-label-md subtitle">Highest: {{ currentPercentage }}%</p>
                    </div>
                    <div class="progress-track">
                        <div class="progress-fill" :style="{ width: currentPercentage + '%' }"></div>
                    </div>
                    <div class="progress-stats">
                        <span>Poziomy: {{ progression.length }} / {{ levels.length }}</span>
                        <span>{{ currentPercentage }}%</span>
                    </div>
                </div>

                <!-- Save / Load Card -->
                <div class="sidebar-card">
                    <div class="card-header">
                        <h3>Save & Load</h3>
                        <p class="type-label-md subtitle">Auto-saved to your browser</p>
                    </div>
                    <div class="btns-group">
                        <Btn class="btn-secondary" @click.native.prevent="onImport">Import JSON</Btn>
                        <Btn class="btn-secondary" :disabled="!isActive" @click.native.prevent="onExport">Export JSON</Btn>
                    </div>
                </div>
            </div>

            <!-- Levels Feed -->
            <section class="levels-container">
                <div class="levels">
                    <template v-if="levels.length > 0">
                        <!-- Completed Levels -->
                        <div class="level-card completed" v-for="(level, i) in levels.slice(0, progression.length)" :key="level.id + i">
                            <a :href="level.video" target="_blank" class="video-thumb">
                                <img :src="getVideoThumbnail(level.video)" alt="Video thumbnail">
                            </a>
                            <div class="level-meta">
                                <div class="meta-top">
                                    <span class="level-rank">#{{ level.rank }}</span>
                                    <h2>{{ level.name }}</h2>
                                </div>
                                <span class="percent-chip success">{{ progression[i] }}%</span>
                            </div>
                        </div>

                        <!-- Current Level Active Card -->
                        <div class="level-card current" v-if="!hasCompleted && currentLevel">
                            <a :href="currentLevel.video" target="_blank" class="video-thumb">
                                <img :src="getVideoThumbnail(currentLevel.video)" alt="Video thumbnail">
                            </a>
                            <div class="level-meta">
                                <div class="meta-top">
                                    <span class="level-rank current">#{{ currentLevel.rank }}</span>
                                    <h2>{{ currentLevel.name }}</h2>
                                    <span class="level-id-tag">ID: {{ currentLevel.id }}</span>
                                </div>
                            </div>
                            <form class="action-dock" v-if="!givenUp" @submit.prevent="onDone">
                                <input type="number" v-model="percentage" :placeholder="placeholder" :min="currentPercentage + 1" max="100" class="pct-input">
                                <Btn type="submit">Done</Btn>
                                <Btn type="button" class="btn-danger" @click.native.prevent="showGiveUpModal = true">Give Up</Btn>
                            </form>
                        </div>

                        <!-- Results Screen -->
                        <div v-if="givenUp || hasCompleted" class="results-card">
                            <h1>Roulette Results</h1>
                            <div class="results-stats">
                                <div class="result-box">
                                    <span class="res-label">Completed Levels</span>
                                    <span class="res-val">{{ progression.length }}</span>
                                </div>
                                <div class="result-box">
                                    <span class="res-label">Highest Percentage</span>
                                    <span class="res-val highlight">{{ currentPercentage }}%</span>
                                </div>
                            </div>
                            <Btn class="btn-secondary" v-if="currentPercentage < 99 && !hasCompleted" @click.native.prevent="showRemaining = true">Pokaż pozostałe poziomy</Btn>
                        </div>

                        <!-- Remaining Levels -->
                        <template v-if="givenUp && showRemaining">
                            <div class="level-card remaining" v-for="(level, i) in levels.slice(progression.length + 1, levels.length - currentPercentage + progression.length)" :key="level.id + i">
                                <a :href="level.video" target="_blank" class="video-thumb">
                                    <img :src="getVideoThumbnail(level.video)" alt="Video thumbnail">
                                </a>
                                <div class="level-meta">
                                    <div class="meta-top">
                                        <span class="level-rank">#{{ level.rank }}</span>
                                        <h2>{{ level.name }}</h2>
                                    </div>
                                    <span class="percent-chip failed">{{ currentPercentage + 2 + i }}%</span>
                                </div>
                            </div>
                        </template>
                    </template>
                    <div v-else class="empty-roulette">
                        <p class="type-title-sm">Wybierz listy i kliknij <strong>Start Game</strong>, aby rozpocząć ruletkę!</p>
                    </div>
                </div>
            </section>

            <!-- Confirmation Modal for Give Up -->
            <div class="modal-backdrop" v-if="showGiveUpModal" @click.self="showGiveUpModal = false">
                <div class="confirm-modal">
                    <h3>Zrezygnować z ruletki?</h3>
                    <p>Twój aktualny postęp ({{ currentPercentage }}% ukończenia) zostanie usunięty.</p>
                    <div class="modal-actions">
                        <Btn class="btn-danger" @click.native.prevent="confirmGiveUp">Tak, zrezygnuj</Btn>
                        <Btn class="btn-secondary" @click.native.prevent="showGiveUpModal = false">Anuluj</Btn>
                    </div>
                </div>
            </div>

            <!-- Toast Messages -->
            <div class="toast-msg" v-for="(toast, idx) in toasts" :key="idx">
                <span>{{ toast }}</span>
            </div>
        </main>
    `,
    data: () => ({
        loading: false,
        levels: [],
        progression: [],
        percentage: undefined,
        givenUp: false,
        showRemaining: false,
        useMainList: true,
        useExtendedList: true,
        useOther: true,
        toasts: [],
        fileInput: undefined,
        showGiveUpModal: false,
    }),
    mounted() {
        this.fileInput = document.createElement('input');
        this.fileInput.type = 'file';
        this.fileInput.multiple = false;
        this.fileInput.accept = '.json';
        this.fileInput.addEventListener('change', this.onImportUpload);

        const roulette = JSON.parse(localStorage.getItem('roulette'));

        if (!roulette) {
            return;
        }

        this.levels = roulette.levels || [];
        this.progression = roulette.progression || [];
    },
    computed: {
        currentLevel() {
            return this.levels[this.progression.length];
        },
        currentPercentage() {
            return this.progression[this.progression.length - 1] || 0;
        },
        placeholder() {
            return `Min. ${this.currentPercentage + 1}%`;
        },
        hasCompleted() {
            return (
                this.progression[this.progression.length - 1] >= 100 ||
                (this.levels.length > 0 && this.progression.length === this.levels.length)
            );
        },
        isActive() {
            return (
                this.progression.length > 0 &&
                !this.givenUp &&
                !this.hasCompleted
            );
        },
    },
    methods: {
        shuffle,
        getVideoThumbnail,
        getYoutubeIdFromUrl,
        async onStart() {
            if (this.isActive) {
                this.showToast('Zrezygnuj (Give up) przed rozpoczęciem nowej ruletki.');
                return;
            }

            if (!this.useMainList && !this.useExtendedList && !this.useOther) {
                this.showToast('Wybierz przynajmniej jedną listę.');
                return;
            }

            this.loading = true;

            const fullList = await fetchList();

            if (!fullList || fullList.filter(([_, err]) => err).length > 0) {
                this.loading = false;
                this.showToast('Lista zawiera błędy. Spróbuj ponownie później.');
                return;
            }

            const fullListMapped = fullList.map(([lvl, _], i) => ({
                rank: i + 1,
                id: lvl.id,
                name: lvl.name,
                video: lvl.verification,
            }));
            const list = [];
            if (this.useMainList) list.push(...fullListMapped.slice(0, 75));
            if (this.useExtendedList) list.push(...fullListMapped.slice(75, 150));
            if (this.useOther) list.push(...fullListMapped.slice(150, 999999));

            this.levels = shuffle(list).slice(0, 100);
            this.showRemaining = false;
            this.givenUp = false;
            this.progression = [];
            this.percentage = undefined;

            this.save();
            this.loading = false;
        },
        save() {
            localStorage.setItem(
                'roulette',
                JSON.stringify({
                    levels: this.levels,
                    progression: this.progression,
                }),
            );
        },
        onDone() {
            if (!this.percentage) {
                return;
            }

            const num = Number(this.percentage);
            if (
                isNaN(num) ||
                num <= this.currentPercentage ||
                num > 100
            ) {
                this.showToast('Nieprawidłowy procent ukończenia.');
                return;
            }

            this.progression.push(num);
            this.percentage = undefined;

            this.save();
        },
        confirmGiveUp() {
            this.givenUp = true;
            this.showGiveUpModal = false;
            localStorage.removeItem('roulette');
            this.showToast('Ruletka została zakończona.');
        },
        onImport() {
            if (
                this.isActive &&
                !window.confirm('To nadpisze aktualnie trwającą ruletkę. Kontynuować?')
            ) {
                return;
            }

            this.fileInput.click();
        },
        async onImportUpload() {
            if (!this.fileInput.files || this.fileInput.files.length === 0) return;

            const file = this.fileInput.files[0];
            try {
                const roulette = JSON.parse(await file.text());

                if (!roulette.levels || !roulette.progression) {
                    this.showToast('Nieprawidłowy plik zapisu.');
                    return;
                }

                this.levels = roulette.levels;
                this.progression = roulette.progression;
                this.save();
                this.givenUp = false;
                this.showRemaining = false;
                this.percentage = undefined;
                this.showToast('Pomyślnie załadowano postęp!');
            } catch {
                this.showToast('Błąd odczytu pliku.');
            }
        },
        onExport() {
            const file = new Blob(
                [JSON.stringify({
                    levels: this.levels,
                    progression: this.progression,
                })],
                { type: 'application/json' },
            );
            const a = document.createElement('a');
            a.href = URL.createObjectURL(file);
            a.download = 'sdl_roulette.json';
            a.click();
            URL.revokeObjectURL(a.href);
        },
        showToast(msg) {
            this.toasts.push(msg);
            setTimeout(() => {
                this.toasts.shift();
            }, 3000);
        },
    },
};
