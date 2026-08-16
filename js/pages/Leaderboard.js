import { fetchLeaderboard } from '../content.js';
import { localize } from '../util.js';

import Spinner from '../components/Spinner.js';

export default {
    components: {
        Spinner,
    },
    data: () => ({
        leaderboard: [],
        loading: true,
        selected: 0,
        err: [],
        searchQuery: '',
        mobileTab: 'board',
    }),
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-leaderboard-container">
            <div class="page-leaderboard" :class="['mobile-tab-' + mobileTab]">
                <!-- Mobile Navigation Bar (visible <= 900px) -->
                <div class="mobile-nav-bar">
                    <button 
                        class="mobile-nav-tab" 
                        :class="{ active: mobileTab === 'board' }" 
                        @click="mobileTab = 'board'"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="8" y1="6" x2="21" y2="6"></line>
                            <line x1="8" y1="12" x2="21" y2="12"></line>
                            <line x1="8" y1="18" x2="21" y2="18"></line>
                            <line x1="3" y1="6" x2="3.01" y2="6"></line>
                            <line x1="3" y1="12" x2="3.01" y2="12"></line>
                            <line x1="3" y1="18" x2="3.01" y2="18"></line>
                        </svg>
                        Ranking ({{ filteredLeaderboard.length }})
                    </button>
                    <button 
                        class="mobile-nav-tab" 
                        :class="{ active: mobileTab === 'player' }" 
                        @click="mobileTab = 'player'"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        Profil (#{{ selected + 1 }})
                    </button>
                </div>

                <div class="error-container" v-if="err.length > 0">
                    <p class="error">
                        Leaderboard may be incomplete: {{ err.join(', ') }}
                    </p>
                </div>

                <!-- Left Board Pane: Player Rankings -->
                <div class="board-container" :class="{ 'mobile-hidden': mobileTab !== 'board' }">
                    <div class="search-container">
                        <div class="search-box">
                            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                            <input 
                                ref="searchInput"
                                type="text" 
                                v-model="searchQuery" 
                                placeholder="Szukaj graczy... (Wciśnij /)" 
                                class="search-input"
                                aria-label="Szukaj graczy"
                            >
                            <button v-if="searchQuery" @click="searchQuery = ''" class="search-clear" title="Wyczyść" aria-label="Wyczyść wyszukiwanie">✕</button>
                        </div>
                    </div>

                    <div class="board-wrapper">
                        <div class="board-list" v-if="filteredLeaderboard.length > 0">
                            <div 
                                v-for="item in filteredListWithIndices" 
                                :key="item.entry.user" 
                                @click="selectPlayer(item.originalIndex)" 
                                class="board-item-btn" 
                                :class="[getPodiumClass(item.originalIndex + 1), { 'active': selected == item.originalIndex }]"
                            >
                                <span class="rank-badge">#{{ item.originalIndex + 1 }}</span>
                                <span class="type-label-lg player-name">{{ item.entry.user }}</span>
                                <span class="score-pill">{{ localize(item.entry.total) }} pts</span>
                            </div>
                        </div>
                        <div v-else class="search-empty">
                            <p>Nie znaleziono graczy dla podanych kryteriów.</p>
                        </div>
                    </div>
                </div>

                <!-- Right Player Details Pane -->
                <div class="player-container" :class="{ 'mobile-hidden': mobileTab !== 'player' }" v-if="entry">
                    <div class="mobile-back-row">
                        <button class="mobile-back-btn" @click="mobileTab = 'board'">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="19" y1="12" x2="5" y2="12"></line>
                                <polyline points="12 19 5 12 12 5"></polyline>
                            </svg>
                            Wróć do rankingu
                        </button>
                    </div>

                    <div class="player-profile">
                        <div class="player-hero">
                            <div class="player-title">
                                <span class="profile-rank" :class="getPodiumClass(selected + 1)">#{{ selected + 1 }}</span>
                                <h1>{{ entry.user }}</h1>
                            </div>
                            <div class="total-score-badge">
                                <span class="score-label">TOTAL SCORE</span>
                                <span class="score-val">{{ localize(entry.total) }}</span>
                            </div>
                        </div>

                        <!-- Stats Summary Row -->
                        <div class="summary-chips">
                            <div class="summary-chip" v-if="entry.packs.length > 0">
                                <span class="chip-count">{{ entry.packs.length }}</span>
                                <span class="chip-name">Packs</span>
                            </div>
                            <div class="summary-chip" v-if="entry.verified.length > 0">
                                <span class="chip-count">{{ entry.verified.length }}</span>
                                <span class="chip-name">Verified</span>
                            </div>
                            <div class="summary-chip" v-if="entry.completed.length > 0">
                                <span class="chip-count">{{ entry.completed.length }}</span>
                                <span class="chip-name">Completed</span>
                            </div>
                            <div class="summary-chip" v-if="entry.progressed.length > 0">
                                <span class="chip-count">{{ entry.progressed.length }}</span>
                                <span class="chip-name">Progressed</span>
                            </div>
                        </div>

                        <!-- Packs Section -->
                        <div class="category-card" v-if="entry.packs.length > 0">
                            <h2>Packs ({{ entry.packs.length }})</h2>
                            <table class="table">
                                <tr v-for="pack in entry.packs" :key="pack.name">
                                    <td class="level">
                                        <span class="type-label-lg">{{ pack.name }}</span>
                                    </td>
                                    <td class="score">
                                        <span class="score-add">+{{ localize(pack.score) }}</span>
                                    </td>
                                </tr>
                            </table>
                        </div>

                        <!-- Verified Section -->
                        <div class="category-card" v-if="entry.verified.length > 0">
                            <h2>Verified ({{ entry.verified.length }})</h2>
                            <table class="table">
                                <tr v-for="sc in entry.verified" :key="sc.level">
                                    <td class="rank-col">
                                        <span class="item-rank">#{{ sc.rank }}</span>
                                    </td>
                                    <td class="level">
                                        <a class="type-label-lg record-link" target="_blank" :href="sc.link">
                                            {{ sc.level }}
                                            <svg class="external-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                                <polyline points="15 3 21 3 21 9"></polyline>
                                                <line x1="10" y1="14" x2="21" y2="3"></line>
                                            </svg>
                                        </a>
                                    </td>
                                    <td class="score">
                                        <span class="score-add">+{{ localize(sc.score) }}</span>
                                    </td>
                                </tr>
                            </table>
                        </div>

                        <!-- Completed Section -->
                        <div class="category-card" v-if="entry.completed.length > 0">
                            <h2>Completed ({{ entry.completed.length }})</h2>
                            <table class="table">
                                <tr v-for="sc in entry.completed" :key="sc.level">
                                    <td class="rank-col">
                                        <span class="item-rank">#{{ sc.rank }}</span>
                                    </td>
                                    <td class="level">
                                        <a class="type-label-lg record-link" target="_blank" :href="sc.link">
                                            {{ sc.level }}
                                            <svg class="external-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                                <polyline points="15 3 21 3 21 9"></polyline>
                                                <line x1="10" y1="14" x2="21" y2="3"></line>
                                            </svg>
                                        </a>
                                    </td>
                                    <td class="score">
                                        <span class="score-add">+{{ localize(sc.score) }}</span>
                                    </td>
                                </tr>
                            </table>
                        </div>

                        <!-- Progressed Section -->
                        <div class="category-card" v-if="entry.progressed.length > 0">
                            <h2>Progressed ({{ entry.progressed.length }})</h2>
                            <table class="table">
                                <tr v-for="sc in entry.progressed" :key="sc.level">
                                    <td class="rank-col">
                                        <span class="item-rank">#{{ sc.rank }}</span>
                                    </td>
                                    <td class="level">
                                        <a class="type-label-lg record-link" target="_blank" :href="sc.link">
                                            <span class="percent-tag">{{ sc.percent }}%</span> {{ sc.level }}
                                            <svg class="external-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                                <polyline points="15 3 21 3 21 9"></polyline>
                                                <line x1="10" y1="14" x2="21" y2="3"></line>
                                            </svg>
                                        </a>
                                    </td>
                                    <td class="score">
                                        <span class="score-add">+{{ localize(sc.score) }}</span>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    `,
    computed: {
        entry() {
            return this.leaderboard[this.selected];
        },
        filteredLeaderboard() {
            if (!this.searchQuery.trim()) {
                return this.leaderboard;
            }
            
            const query = this.searchQuery.toLowerCase().trim();
            return this.leaderboard.filter((ientry) => {
                if (!ientry) return false;
                return ientry.user.toLowerCase().includes(query);
            });
        },
        filteredListWithIndices() {
            return this.filteredLeaderboard.map((entry) => ({
                entry,
                originalIndex: this.leaderboard.findIndex((e) => e && e.user === entry.user)
            }));
        }
    },
    async mounted() {
        const [leaderboard, err] = await fetchLeaderboard();
        this.leaderboard = leaderboard || [];
        this.err = err || [];
        this.loading = false;
        window.addEventListener('keydown', this.handleKeydown);
    },
    unmounted() {
        window.removeEventListener('keydown', this.handleKeydown);
    },
    methods: {
        localize,
        getPodiumClass(rank) {
            if (rank === 1) return 'podium-1';
            if (rank === 2) return 'podium-2';
            if (rank === 3) return 'podium-3';
            return '';
        },
        selectPlayer(index) {
            this.selected = index;
            if (window.innerWidth <= 900) {
                this.mobileTab = 'player';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        },
        handleKeydown(e) {
            const activeEl = document.activeElement;
            const isTyping = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');

            if (e.key === '/' && !isTyping) {
                e.preventDefault();
                this.mobileTab = 'board';
                this.$nextTick(() => {
                    this.$refs.searchInput?.focus();
                });
                return;
            }

            if (e.key === 'Escape' && isTyping) {
                activeEl.blur();
                return;
            }

            if (this.filteredListWithIndices.length === 0) return;

            if (e.key === 'ArrowDown' && !isTyping) {
                e.preventDefault();
                const currentIdx = this.filteredListWithIndices.findIndex(item => item.originalIndex === this.selected);
                if (currentIdx < this.filteredListWithIndices.length - 1) {
                    this.selected = this.filteredListWithIndices[currentIdx + 1].originalIndex;
                }
            } else if (e.key === 'ArrowUp' && !isTyping) {
                e.preventDefault();
                const currentIdx = this.filteredListWithIndices.findIndex(item => item.originalIndex === this.selected);
                if (currentIdx > 0) {
                    this.selected = this.filteredListWithIndices[currentIdx - 1].originalIndex;
                }
            }
        },
    },
};
