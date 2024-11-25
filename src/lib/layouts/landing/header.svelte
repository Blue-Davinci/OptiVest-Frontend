<!-- Header.svelte -->
<script>
    import { onMount } from 'svelte';
    import { fade, fly, slide } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';
    
    let mainDashboard = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
    
    const stats = [
        { label: 'Active Users', value: '10K+', trend: '+27%', icon: '👥' },
        { label: 'Portfolio Growth', value: '32%', trend: '+15%', icon: '📈' },
        { label: 'Success Rate', value: '94%', trend: '+8%', icon: '🎯' }
    ];
    
    // State management
    let mounted = false;
    let headerVisible = false;
    let imageLoaded = false;
    let contentLoaded = false;

    // Loading states for different sections
    let titleLoaded = false;
    let descriptionLoaded = false;
    let buttonsLoaded = false;
    let statsLoaded = false;

    // Progressive loading sequence
    onMount(async () => {
        mounted = true;
        
        // Simulate progressive content loading
        setTimeout(() => titleLoaded = true, 300);
        setTimeout(() => descriptionLoaded = true, 600);
        setTimeout(() => buttonsLoaded = true, 900);
        setTimeout(() => statsLoaded = true, 1200);
        
        // Preload main dashboard image
        const img = new Image();
        img.onload = () => {
            imageLoaded = true;
            contentLoaded = true;
        };
        img.src = mainDashboard;
    });

    // Enhanced intersection observer
    function inView(node, params = {}) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    headerVisible = true;
                    if (!params.persistent) {
                        observer.unobserve(node);
                    }
                }
            });
        }, {
            threshold: params.threshold || 0.2,
            rootMargin: params.rootMargin || '50px'
        });

        observer.observe(node);

        return {
            destroy() {
                observer.unobserve(node);
            }
        };
    }
</script>

<section 
    class="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-900 to-black py-32"
    class:loaded={contentLoaded}
>
    <!-- Enhanced animated background -->
    <div class="absolute inset-0 overflow-hidden">
        <div class="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-30%,rgba(63,94,251,0.3),transparent)]"></div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_800px_at_80%_60%,rgba(147,51,234,0.3),transparent)]"></div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_800px_at_20%_70%,rgba(59,130,246,0.3),transparent)]"></div>
        
        <!-- Animated particles -->
        <div class="particles absolute inset-0 opacity-30">
            {#each Array(20) as _, i}
                <div
                    class="particle absolute h-1 w-1 rounded-full bg-white"
                    style="
                        left: {Math.random() * 100}%;
                        top: {Math.random() * 100}%;
                        animation: float {5 + Math.random() * 5}s ease-in-out infinite;
                        animation-delay: -{Math.random() * 5}s;
                    "
                ></div>
            {/each}
        </div>
    </div>

    <div class="container relative mx-auto px-4" use:inView>
        {#if mounted}
            <div class="flex flex-col items-center text-center">
                <!-- Main Title -->
                <div class="relative mb-6 {titleLoaded ? 'loaded' : 'loading'}">
                    {#if titleLoaded}
                        <h1 
                            in:fly="{{ y: 20, duration: 800, delay: 200 }}"
                            class="max-w-4xl bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-5xl font-bold text-transparent md:text-6xl lg:text-7xl"
                        >
                            Expert Guidance to
                            <span class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">Optimize</span>
                            Your Financial Growth
                        </h1>
                    {:else}
                        <div class="h-20 w-full animate-pulse rounded-lg bg-gray-700/50"></div>
                    {/if}
                </div>

                <!-- Description -->
                <div class="relative mb-8 {descriptionLoaded ? 'loaded' : 'loading'}">
                    {#if descriptionLoaded}
                        <p 
                            in:fly="{{ y: 20, duration: 800, delay: 400 }}"
                            class="max-w-2xl text-lg text-blue-100/90 md:text-xl"
                        >
                            Our expert guidance will optimize your financial portfolio and lay the foundation for a
                            secure and prosperous future.
                        </p>
                    {:else}
                        <div class="h-8 w-full max-w-2xl animate-pulse rounded-lg bg-gray-700/50"></div>
                    {/if}
                </div>

                <!-- Action Buttons -->
                <div class="relative mb-16 {buttonsLoaded ? 'loaded' : 'loading'}">
                    {#if buttonsLoaded}
                        <div 
                            in:fly="{{ y: 20, duration: 800, delay: 600 }}"
                            class="flex flex-col space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0"
                        >
                            <button
                                class="group relative overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 active:scale-100"
                            >
                                <span class="relative z-10">Get Started Now</span>
                                <div class="absolute inset-0 -translate-x-full bg-gradient-to-r from-blue-400 to-blue-600 transition-transform duration-500 ease-out group-hover:translate-x-0"></div>
                            </button>
                            
                            <button
                                class="group relative overflow-hidden rounded-full border-2 border-white/20 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white/40 hover:bg-white/10 hover:shadow-lg active:scale-100"
                            >
                                <span class="relative z-10">View Demo</span>
                                <div class="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 ease-out group-hover:translate-x-0"></div>
                            </button>
                        </div>
                    {:else}
                        <div class="flex justify-center space-x-4">
                            <div class="h-12 w-32 animate-pulse rounded-full bg-gray-700/50"></div>
                            <div class="h-12 w-32 animate-pulse rounded-full bg-gray-700/50"></div>
                        </div>
                    {/if}
                </div>

                <!-- Dashboard Preview -->
                <div class="relative w-full max-w-6xl {imageLoaded ? 'loaded' : 'loading'}">
                    <div class="relative rounded-2xl bg-gradient-to-b from-gray-900 to-gray-800 p-6 shadow-2xl">
                        <!-- Browser Controls -->
                        <div class="mb-4 flex items-center space-x-2">
                            <div class="h-3 w-3 rounded-full bg-red-500"></div>
                            <div class="h-3 w-3 rounded-full bg-yellow-500"></div>
                            <div class="h-3 w-3 rounded-full bg-green-500"></div>
                        </div>
                        
                        <div class="relative overflow-hidden rounded-xl">
                            {#if imageLoaded}
                                <img
                                    src={mainDashboard}
                                    alt="Financial Dashboard Preview"
                                    class="w-full transform rounded-lg shadow-2xl transition-transform duration-700 will-change-transform hover:scale-[1.02]"
                                    in:fade={{ duration: 1000 }}
                                />
                                
                                <!-- Floating Stats Cards -->
                                {#if statsLoaded}
                                    {#each stats as stat, i}
                                        <div
                                            in:fly="{{ y: 20, x: (i - 1) * 50, duration: 800, delay: 800 + i * 200 }}"
                                            class="stats-card absolute rounded-xl bg-white/90 p-4 shadow-lg backdrop-blur-sm"
                                            style="animation-delay: {i * 200}ms;"
                                        >
                                            <div class="flex items-center space-x-2">
                                                <span class="text-2xl">{stat.icon}</span>
                                                <div>
                                                    <div class="text-sm font-medium text-gray-600">{stat.label}</div>
                                                    <div class="text-2xl font-bold text-gray-900">{stat.value}</div>
                                                    <div class="text-sm font-medium text-green-600">{stat.trend}</div>
                                                </div>
                                            </div>
                                        </div>
                                    {/each}
                                {/if}
                            {:else}
                                <div class="aspect-video w-full animate-pulse rounded-lg bg-gray-800"></div>
                            {/if}
                        </div>
                    </div>

                    <!-- Decorative Elements -->
                    <div class="pointer-events-none absolute -left-20 -top-20 h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[100px]"></div>
                    <div class="pointer-events-none absolute -bottom-20 -right-20 h-[500px] w-[500px] rounded-full bg-purple-500/20 blur-[100px]"></div>
                </div>
            </div>
        {/if}
    </div>
</section>

<style lang="postcss">
    /* Enhanced animations */
    @keyframes float {
        0%, 100% { transform: translate(0, 0); }
        50% { transform: translate(10px, -10px); }
    }

    @keyframes pulse {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 0.7; }
    }

    .loading {
        animation: pulse 1.5s ease-in-out infinite;
    }

    /* Stats Cards Positioning */
    .stats-card {
        transition: all 0.3s ease-out;
    }

    .stats-card:nth-child(1) {
        @apply left-[10%] top-[20%];
    }

    .stats-card:nth-child(2) {
        @apply left-[40%] top-[10%];
    }

    .stats-card:nth-child(3) {
        @apply left-[70%] top-[25%];
    }

    /* Particle animation */
    .particle {
        opacity: 0;
        animation: particle 8s ease-in-out infinite;
    }

    @keyframes particle {
        0% { opacity: 0; transform: translateY(0); }
        20% { opacity: 1; }
        80% { opacity: 1; }
        100% { opacity: 0; transform: translateY(-100px); }
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
        .stats-card {
            @apply hidden;
        }
    }

    /* Reduced motion preferences */
    @media (prefers-reduced-motion: reduce) {
        .particle,
        .stats-card,
        .loading {
            animation: none;
        }
        
        .hover\:scale-105:hover {
            transform: none;
        }
    }
</style>