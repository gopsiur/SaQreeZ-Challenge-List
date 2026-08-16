import { store } from "../main.js";
import { embed } from "../util.js";
import { score } from "../score.js";
import { fetchEditors, fetchList, fetchPacks } from "../content.js";

import Spinner from "../components/Spinner.js";
import LevelAuthors from "../components/List/LevelAuthors.js";

const roleIconMap = {
    owner: "crown",
    admin: "user-gear",
    helper: "user-shield",
    dev: "code",
    trial: "user-lock",
};

export default {
    components: { Spinner, LevelAuthors },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-list" :class="['mobile-tab-' + mobileTab]">
            <!-- Mobile Navigation Bar (visible <= 1080px) -->
            <div class="mobile-nav-bar">
                <button 
                    class="mobile-nav-tab" 
                    :class="{ active: mobileTab === 'list' }" 
                    @click="mobileTab = 'list'"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="8" y1="6" x2="21" y2="6"></line>
                        <line x1="8" y1="12" x2="21" y2="12"></line>
                        <line x1="8" y1="18" x2="21" y2="18"></line>
                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                    Lista ({{ filteredList.length }})
                </button>
                <button 
                    class="mobile-nav-tab" 
                    :class="{ active: mobileTab === 'detail' }" 
                    @click="mobileTab = 'detail'"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    Poziom #{{ selected + 1 }}
                </button>
                <button 
                    class="mobile-nav-tab" 
                    :class="{ active: mobileTab === 'meta' }" 
                    @click="mobileTab = 'meta'"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    Zasady
                </button>
            </div>

            <!-- Left Pane: Level List -->
            <div class="list-container" :class="{ 'mobile-hidden': mobileTab !== 'list' }">
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
                            placeholder="Szukaj poziomów... (Wciśnij /)" 
                            class="search-input"
                            aria-label="Szukaj poziomów"
                        >
                        <button v-if="searchQuery" @click="searchQuery = ''" class="search-clear" title="Wyczyść" aria-label="Wyczyść wyszukiwanie">✕</button>
                    </div>
                </div>

                <!-- Tier Filter Tabs -->
                <div class="tier-tabs">
                    <button class="tier-tab" :class="{ active: filterTier === 'all' }" @click="filterTier = 'all'">Wszystkie</button>
                    <button class="tier-tab" :class="{ active: filterTier === 'main' }" @click="filterTier = 'main'">Main (#1-75)</button>
                    <button class="tier-tab" :class="{ active: filterTier === 'extended' }" @click="filterTier = 'extended'">Extended (#76-150)</button>
                    <button class="tier-tab" :class="{ active: filterTier === 'legacy' }" @click="filterTier = 'legacy'">Legacy (#151+)</button>
                </div>

                <div class="list-wrapper">
                    <div class="level-list" v-if="filteredList.length > 0">
                        <div 
                            v-for="item in filteredList" 
                            :key="item.originalIndex" 
                            @click="selectLevel(item.originalIndex)" 
                            class="level-item-btn" 
                            :class="[getPodiumClass(item.originalIndex + 1), { 'active': selected == item.originalIndex, 'error': !item.level }]"
                        >
                            <span class="rank-badge">#{{ item.originalIndex + 1 }}</span>
                            <span class="type-label-lg level-name">{{ item.level?.name || \`Error (\${item.err}.json)\` }}</span>
                        </div>
                    </div>
                    <div v-else class="search-empty">
                        <p>Nie znaleziono poziomów dla podanych kryteriów.</p>
                    </div>
                </div>
            </div>

            <!-- Center Pane: Level Inspection -->
            <div class="level-container" :class="{ 'mobile-hidden': mobileTab !== 'detail' }">
                <div class="mobile-back-row">
                    <button class="mobile-back-btn" @click="mobileTab = 'list'">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Wróć do listy poziomów
                    </button>
                </div>

                <div class="level" v-if="level">
                    <div class="level-header">
                        <div class="title-row">
                            <span class="header-rank" :class="getPodiumClass(selected + 1)">#{{ selected + 1 }}</span>
                            <h1>{{ level.name }}</h1>
                        </div>
                        <LevelAuthors :author="level.author" :creators="level.creators" :verifier="level.verifier"></LevelAuthors>
                    </div>

                    <!-- Video Showcase / Verification Toggle & Player -->
                    <div class="video-section">
                        <div class="video-toggle-bar" v-if="level.showcase">
                            <button 
                                class="video-toggle-btn" 
                                :class="{ active: !toggledShowcase }" 
                                @click="toggledShowcase = false"
                            >
                                Verification
                            </button>
                            <button 
                                class="video-toggle-btn" 
                                :class="{ active: toggledShowcase }" 
                                @click="toggledShowcase = true"
                            >
                                Showcase
                            </button>
                        </div>
                        <div class="video-container">
                            <iframe class="video" id="videoframe" :src="video" frameborder="0" allowfullscreen></iframe>
                        </div>
                    </div>
                    
                    <!-- Pack Badges -->
                    <div v-if="levelPacks.length > 0" class="level-packs">
                        <div class="type-title-sm section-label">Part of Packs</div>
                        <div class="packs-list">
                            <router-link to="/packs" v-for="pack in levelPacks" :key="pack.name" class="pack-badge">
                                <span>{{ pack.name }}</span>
                            </router-link>
                        </div>
                    </div>

                    <!-- Interactive Stats Cards -->
                    <div class="stats-grid">
                        <div class="stat-card">
                            <span class="stat-label">Points (100%)</span>
                            <p class="stat-value highlight">{{ score(selected + 1, 100, level.percentToQualify) }}</p>
                        </div>
                        <div class="stat-card copyable" role="button" tabindex="0" @click="copyToClipboard(level.id, 'Level ID')" @keydown.enter="copyToClipboard(level.id, 'Level ID')" @keydown.space.prevent="copyToClipboard(level.id, 'Level ID')" title="Kliknij, aby skopiować ID">
                            <span class="stat-label">Level ID</span>
                            <div class="stat-copy-val">
                                <p class="stat-value">{{ level.id }}</p>
                                <svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h6"></path>
                                </svg>
                            </div>
                        </div>
                        <div class="stat-card copyable" role="button" tabindex="0" @click="copyToClipboard(level.password || 'Free to Copy', 'Hasło')" @keydown.enter="copyToClipboard(level.password || 'Free to Copy', 'Hasło')" @keydown.space.prevent="copyToClipboard(level.password || 'Free to Copy', 'Hasło')" title="Kliknij, aby skopiować hasło">
                            <span class="stat-label">Password</span>
                            <div class="stat-copy-val">
                                <p class="stat-value">{{ level.password || 'Free to Copy' }}</p>
                                <svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h6"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <!-- Level Description Card -->
                    <div class="desc-card" v-if="level.description">
                        <span class="stat-label">Description</span>
                        <p class="type-body">{{ level.description }}</p>
                    </div>

                    <!-- Records Section -->
                    <div class="records-section">
                        <div class="records-header">
                            <h2>Records ({{ level.records.length }})</h2>
                            <span class="qualify-tag">
                                <strong>{{ selected + 1 <= 150 ? level.percentToQualify : 100 }}%</strong> to qualify
                            </span>
                        </div>
                        <table class="records" v-if="level.records.length > 0">
                            <tr v-for="record in level.records" :key="record.user + record.percent" class="record">
                                <td class="percent">
                                    <span class="percent-badge" :class="{ 'hundred': record.percent === 100 }">{{ record.percent }}%</span>
                                </td>
                                <td class="user">
                                    <a :href="record.link" target="_blank" class="type-label-lg user-link">
                                        {{ record.user }}
                                        <svg class="external-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                            <polyline points="15 3 21 3 21 9"></polyline>
                                            <line x1="10" y1="14" x2="21" y2="3"></line>
                                        </svg>
                                    </a>
                                </td>
                                <td class="mobile">
                                    <img v-if="record.mobile" :src="\`/assets/phone-landscape\${store.dark ? '-dark' : ''}.svg\`" alt="Mobile" title="Mobile Player">
                                </td>
                                <td class="hz">
                                    <span class="fps-badge">{{ record.hz }}fps</span>
                                </td>
                            </tr>
                        </table>
                        <div v-else class="no-records">
                            <p>No records submitted yet.</p>
                        </div>
                    </div>
                </div>
                <div v-else class="level empty-state">
                    <p class="empty-icon">(ノಠ益ಠ)ノ彡┻━┻</p>
                    <p class="type-title-sm">Nie znaleziono poziomu.</p>
                </div>
            </div>

            <!-- Right Pane: Meta & Guidelines -->
            <div class="meta-container" :class="{ 'mobile-hidden': mobileTab !== 'meta' }">
                <div class="mobile-back-row">
                    <button class="mobile-back-btn" @click="mobileTab = 'list'">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Wróć do listy poziomów
                    </button>
                </div>

                <div class="meta">
                    <div class="errors" v-show="errors.length > 0">
                        <p class="error" v-for="error of errors" :key="error">{{ error }}</p>
                    </div>

                    <!-- Editors Card -->
                    <div class="meta-card" v-if="editors">
                        <h3>List Editors</h3>
                        <ol class="editors">
                            <li v-for="editor in editors" :key="editor.name + editor.role" class="editor-item">
                                <img :src="\`/assets/\${roleIconMap[editor.role]}\${store.dark ? '-dark' : ''}.svg\`" :alt="editor.role">
                                <a v-if="editor.link && editor.link !== 'link'" class="type-label-lg link" target="_blank" :href="editor.link">{{ editor.name }}</a>
                                <span v-else class="type-label-lg">{{ editor.name }}</span>
                                <span class="role-pill">{{ editor.role }}</span>
                            </li>
                        </ol>
                    </div>

                    <!-- Submission Requirements -->
                    <div class="meta-card">
                        <h3>Submission Rules</h3>
                        <ul class="rules-list">
                            <li>Level length MUST be at least 3 seconds long.</li>
                            <li>Achieved without hacks (FPS bypass & CBF are <strong>ALLOWED</strong>).</li>
                            <li>Must be achieved on the listed level ID.</li>
                            <li>Video or Discord stream evidence is required.</li>
                            <li>No secret routes, bug exploits, or physics abuse.</li>
                            <li>No unapproved copied levels.</li>
                        </ul>
                    </div>

                    <div class="og-credits">
                        <p class="type-label-md">Original layout by <a href="https://tsl.pages.dev/" target="_blank">TSL</a>, redesigned for SaQreeZ.</p>
                    </div>
                </div>
            </div>

            <!-- Toast Feedback -->
            <div class="toast-msg" role="status" aria-live="polite" v-if="toastMsg">
                <span>{{ toastMsg }}</span>
            </div>
        </main>
    `,
    data: () => ({
        list: [],
        editors: [],
        packs: [],
        loading: true,
        selected: 0,
        errors: [],
        roleIconMap,
        store,
        searchQuery: '',
        filterTier: 'all',
        toggledShowcase: false,
        toastMsg: null,
        toastTimeout: null,
        mobileTab: 'list',
    }),
    computed: {
        level() {
            return this.list[this.selected] ? this.list[this.selected][0] : null;
        },
        filteredList() {
            if (!this.list) return [];
            
            let result = this.list.map(([level, err], i) => ({ level, err, originalIndex: i }));
            
            if (this.filterTier === 'main') {
                result = result.filter(item => item.originalIndex < 75);
            } else if (this.filterTier === 'extended') {
                result = result.filter(item => item.originalIndex >= 75 && item.originalIndex < 150);
            } else if (this.filterTier === 'legacy') {
                result = result.filter(item => item.originalIndex >= 150);
            }

            if (this.searchQuery.trim()) {
                const query = this.searchQuery.toLowerCase().trim();
                result = result.filter(item => {
                    const { level } = item;
                    if (!level) return false;
                    return level.name.toLowerCase().includes(query) || (level.id && String(level.id).includes(query));
                });
            }

            return result;
        },
        video() {
            if (!this.level) return '';
            if (!this.level.showcase) {
                return embed(this.level.verification);
            }

            return embed(
                this.toggledShowcase
                    ? this.level.showcase
                    : this.level.verification
            );
        },
        levelPacks() {
            if (!this.level || !this.packs.length) return [];
            
            return this.packs.filter(pack => 
                pack.levels.includes(this.level.path)
            );
        },
    },
    async mounted() {
        this.list = await fetchList();
        this.editors = await fetchEditors();
        this.packs = await fetchPacks();

        if (!this.list) {
            this.errors = [
                "Failed to load list. Retry in a few minutes or notify list staff.",
            ];
        } else {
            this.errors.push(
                ...this.list
                    .filter(([_, err]) => err)
                    .map(([_, err]) => {
                        return `Failed to load level. (${err}.json)`;
                    })
            );
            if (!this.editors) {
                this.errors.push("Failed to load list editors.");
            }
        }

        this.loading = false;
        window.addEventListener('keydown', this.handleKeydown);
    },
    unmounted() {
        window.removeEventListener('keydown', this.handleKeydown);
    },
    methods: {
        embed,
        score,
        getPodiumClass(rank) {
            if (rank === 1) return 'podium-1';
            if (rank === 2) return 'podium-2';
            if (rank === 3) return 'podium-3';
            return '';
        },
        selectLevel(index) {
            this.selected = index;
            if (window.innerWidth <= 1080) {
                this.mobileTab = 'detail';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        },
        copyToClipboard(text, label) {
            if (!text) return;
            navigator.clipboard.writeText(String(text)).then(() => {
                this.showToast(`${label} skopiowano do schowka!`);
            }).catch(() => {
                this.showToast(`Nie udało się skopiować ${label}`);
            });
        },
        showToast(msg) {
            this.toastMsg = msg;
            if (this.toastTimeout) clearTimeout(this.toastTimeout);
            this.toastTimeout = setTimeout(() => {
                this.toastMsg = null;
            }, 2500);
        },
        handleKeydown(e) {
            const activeEl = document.activeElement;
            const isTyping = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');

            if (e.key === '/' && !isTyping) {
                e.preventDefault();
                this.mobileTab = 'list';
                this.$nextTick(() => {
                    this.$refs.searchInput?.focus();
                });
                return;
            }

            if (e.key === 'Escape' && isTyping) {
                activeEl.blur();
                return;
            }

            if (this.filteredList.length === 0) return;

            if (e.key === 'ArrowDown' && !isTyping) {
                e.preventDefault();
                const currentIdxInFiltered = this.filteredList.findIndex(item => item.originalIndex === this.selected);
                if (currentIdxInFiltered < this.filteredList.length - 1) {
                    this.selected = this.filteredList[currentIdxInFiltered + 1].originalIndex;
                }
            } else if (e.key === 'ArrowUp' && !isTyping) {
                e.preventDefault();
                const currentIdxInFiltered = this.filteredList.findIndex(item => item.originalIndex === this.selected);
                if (currentIdxInFiltered > 0) {
                    this.selected = this.filteredList[currentIdxInFiltered - 1].originalIndex;
                }
            }
        },
    },
};
