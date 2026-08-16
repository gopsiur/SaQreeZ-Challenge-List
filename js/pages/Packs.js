import { store } from "../main.js";
import { fetchPacks, fetchList, fetchLeaderboard } from "../content.js";
import { score, round } from "../score.js";

import Spinner from "../components/Spinner.js";

export default {
    components: { Spinner },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-packs-container">
            <div class="page-packs" :class="['mobile-tab-' + mobileTab]">
                <!-- Mobile Navigation Bar (visible <= 900px) -->
                <div class="mobile-nav-bar">
                    <button 
                        class="mobile-nav-tab" 
                        :class="{ active: mobileTab === 'packs' }" 
                        @click="mobileTab = 'packs'"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                        </svg>
                        Packs ({{ filteredPacks.length }})
                    </button>
                    <button 
                        class="mobile-nav-tab" 
                        :class="{ active: mobileTab === 'detail' }" 
                        @click="mobileTab = 'detail'"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                        Szczegóły packa
                    </button>
                </div>

                <!-- Left Pane: Packs Catalogue -->
                <div class="packs-container" :class="{ 'mobile-hidden': mobileTab !== 'packs' }">
                    <div class="packs-list">
                        <div class="packs-header">
                            <h1>Level Packs</h1>
                            <p class="description">Zestawy poziomów do ukończenia. Każdy pack daje punkty równe sumie punktów wszystkich poziomów podzielonej przez 2.</p>
                        </div>

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
                                    placeholder="Szukaj packów... (Wciśnij /)" 
                                    class="search-input"
                                    aria-label="Szukaj packów"
                                >
                                <button v-if="searchQuery" @click="searchQuery = ''" class="search-clear" title="Wyczyść" aria-label="Wyczyść wyszukiwanie">✕</button>
                            </div>
                            <select v-model="sortOption" class="sort-select" aria-label="Sortuj packi">
                                <option value="none">Sortowanie domyślne</option>
                                <option value="points">Najwięcej punktów</option>
                            </select>
                        </div>

                        <div class="pack-grid" v-if="filteredPacks.length > 0">
                            <div 
                                v-for="item in filteredPacksWithIndices" 
                                :key="item.pack.name" 
                                class="pack-card" 
                                :class="{ 'active': selected === item.originalIndex }" 
                                @click="selectPack(item.originalIndex)"
                            >
                                <div class="pack-card-top">
                                    <h3>{{ item.pack.name }}</h3>
                                    <span class="pack-points-pill">{{ calculatePackPoints(item.pack) }} pts</span>
                                </div>
                                <p class="pack-author">by {{ item.pack.author }}</p>
                                <p class="pack-description" v-if="item.pack.description">{{ item.pack.description }}</p>
                                <div class="pack-stats">
                                    <span class="level-count-pill">{{ item.pack.levels.length }} poziomów</span>
                                </div>
                            </div>
                        </div>
                        <div v-else class="search-empty">
                            <p>Nie znaleziono packów dla podanych kryteriów.</p>
                        </div>
                    </div>
                </div>

                <!-- Right Pane: Pack Details -->
                <div class="pack-details" :class="{ 'mobile-hidden': mobileTab !== 'detail' }" v-if="selectedPack">
                    <div class="mobile-back-row">
                        <button class="mobile-back-btn" @click="mobileTab = 'packs'">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="19" y1="12" x2="5" y2="12"></line>
                                <polyline points="12 19 5 12 12 5"></polyline>
                            </svg>
                            Wróć do listy packów
                        </button>
                    </div>

                    <div class="pack-info-card">
                        <div class="pack-info-header">
                            <div class="pack-title-block">
                                <h2>{{ selectedPack.name }}</h2>
                                <p class="pack-author-full">Autor: <strong>{{ selectedPack.author }}</strong></p>
                            </div>
                            <div class="pack-reward-badge">
                                <span class="reward-label">NAGRODA</span>
                                <span class="reward-val">+{{ selectedPackPoints }} pts</span>
                            </div>
                        </div>

                        <p class="pack-full-desc" v-if="selectedPack.description">{{ selectedPack.description }}</p>
                        
                        <div class="pack-levels-block">
                            <h3>Poziomy w packu ({{ selectedPack.levels.length }})</h3>
                            <div class="levels-list">
                                <div v-for="levelData in selectedPackLevels" :key="levelData.path" class="level-item">
                                    <span class="level-number">#{{ levelData.rank }}</span>
                                    <span class="level-name">{{ levelData.name }}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="pack-users-block" v-if="packCompletedBy.length > 0">
                            <h3>Ukończone przez ({{ packCompletedBy.length }})</h3>
                            <div class="completed-users">
                                <div v-for="user in packCompletedBy" :key="user" class="user-badge">
                                    <span>{{ user }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="errors" v-if="errors.length > 0">
                    <p class="error" v-for="error of errors" :key="error">{{ error }}</p>
                </div>
            </div>
        </main>
    `,
    data: () => ({
        packs: [],
        loading: true,
        selected: 0,
        errors: [],
        store,
        levelsList: [],
        levelsData: {},
        searchQuery: '',
        leaderboard: [],
        sortOption: 'none',
        mobileTab: 'packs',
    }),
    computed: {
        sortedPacks() {
            if (this.sortOption === 'points') {
                return [...this.packs].sort((a, b) => {
                    const pointsA = this.calculatePackPoints(a);
                    const pointsB = this.calculatePackPoints(b);
                    return pointsB - pointsA;
                });
            }
            return this.packs;
        },
        selectedPack() {
            return this.sortedPacks[this.selected];
        },
        filteredPacks() {
            if (!this.searchQuery.trim()) {
                return this.sortedPacks;
            }
            
            const query = this.searchQuery.toLowerCase().trim();
            return this.sortedPacks.filter((pack) => {
                if (!pack) return false;
                return pack.name.toLowerCase().includes(query) || 
                       (pack.description && pack.description.toLowerCase().includes(query)) ||
                       (pack.author && pack.author.toLowerCase().includes(query));
            });
        },
        filteredPacksWithIndices() {
            return this.filteredPacks.map((pack) => ({
                pack,
                originalIndex: this.sortedPacks.findIndex((p) => p && p.name === pack.name)
            }));
        },
        selectedPackLevels() {
            if (!this.selectedPack || !this.levelsList.length) return [];
            
            const levels = this.selectedPack.levels.map(levelPath => {
                const rank = this.levelsList.findIndex(([level]) => level && level.path === levelPath) + 1;
                const levelData = this.levelsData[levelPath];
                
                return {
                    path: levelPath,
                    name: levelData ? levelData.name : levelPath,
                    rank: rank || 999999
                };
            });
            
            return levels.sort((a, b) => a.rank - b.rank).map(level => ({
                ...level,
                rank: level.rank === 999999 ? '?' : level.rank
            }));
        },
        packCompletedBy() {
            if (!this.selectedPack || !this.leaderboard.length) return [];
            
            const completedUsers = [];
            this.leaderboard.forEach(user => {
                const userCompletedPack = user.packs && user.packs.some(pack => pack.name === this.selectedPack.name);
                if (userCompletedPack) {
                    completedUsers.push(user.user);
                }
            });
            
            return completedUsers.sort();
        },
        selectedPackPoints() {
            if (!this.selectedPack || !this.levelsList.length) return 0;
            
            let totalPoints = 0;
            this.selectedPack.levels.forEach(levelPath => {
                const levelIndex = this.levelsList.findIndex(([level]) => level && level.path === levelPath);
                if (levelIndex !== -1) {
                    const [level] = this.levelsList[levelIndex];
                    if (level) {
                        const levelScore = score(levelIndex + 1, 100, level.percentToQualify);
                        totalPoints += levelScore;
                    }
                }
            });
            
            return round(totalPoints / 2);
        }
    },
    async mounted() {
        try {
            const [packsData, levelsListData, leaderboardData] = await Promise.all([
                fetchPacks(),
                fetchList(),
                fetchLeaderboard()
            ]);
            
            this.packs = packsData || [];
            this.levelsList = levelsListData || [];
            this.leaderboard = leaderboardData ? leaderboardData[0] : [];
            
            if (levelsListData) {
                levelsListData.forEach(([level]) => {
                    if (level) {
                        this.levelsData[level.path] = level;
                    }
                });
            }
            
            if (!this.packs || this.packs.length === 0) {
                this.errors.push("Nie udało się załadować packów lub lista jest pusta.");
            }
        } catch (error) {
            this.errors.push("Błąd podczas ładowania packów.");
            console.error("Failed to load packs:", error);
        } finally {
            this.loading = false;
        }
        window.addEventListener('keydown', this.handleKeydown);
    },
    unmounted() {
        window.removeEventListener('keydown', this.handleKeydown);
    },
    methods: {
        calculatePackPoints(pack) {
            if (!pack || !this.levelsList.length) return 0;
            
            let totalPoints = 0;
            pack.levels.forEach(levelPath => {
                const levelIndex = this.levelsList.findIndex(([level]) => level && level.path === levelPath);
                if (levelIndex !== -1) {
                    const [level] = this.levelsList[levelIndex];
                    if (level) {
                        const levelScore = score(levelIndex + 1, 100, level.percentToQualify);
                        totalPoints += levelScore;
                    }
                }
            });
            
            return round(totalPoints / 2);
        },
        selectPack(index) {
            this.selected = index;
            if (window.innerWidth <= 900) {
                this.mobileTab = 'detail';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        },
        handleKeydown(e) {
            const activeEl = document.activeElement;
            const isTyping = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');

            if (e.key === '/' && !isTyping) {
                e.preventDefault();
                this.mobileTab = 'packs';
                this.$nextTick(() => {
                    this.$refs.searchInput?.focus();
                });
                return;
            }

            if (e.key === 'Escape' && isTyping) {
                activeEl.blur();
            }
        }
    }
};