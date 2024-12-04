<script>
    import { Award, Calendar, Target, PiggyBank, TrendingUp, ArrowRight } from 'lucide-svelte';
    
    let {awards} = $props();
    
    const actionCards = [
        {
            icon: PiggyBank,
            title: 'Create a Budget',
            description: 'Start managing your finances by setting up your first budget',
            link: '/dashboard/budgets',
            color: 'purple'
        },
        {
            icon: Target,
            title: 'Set Financial Goals',
            description: 'Define and track your financial goals for better planning',
            link: '/dashboard/goals',
            color: 'emerald'
        },
        {
            icon: TrendingUp,
            title: 'Track Expenses',
            description: 'Monitor your spending patterns and financial habits',
            link: '/dashboard/expenses',
            color: 'blue'
        }
    ];
    </script>
    
    <section class="mt-6 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 class="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
            <Award />
            Your Achievements
        </h2>
        
        {#if awards && awards.length > 0}
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {#each awards as award}
                    <div
                        class="transform rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-6 transition-transform hover:scale-105 dark:from-purple-900/20 dark:to-purple-800/20"
                    >
                        <div class="mb-4 flex items-center gap-4">
                            <img src={award.award_image_url} alt={award.code} class="h-16 w-16" />
                            <div>
                                <h3 class="font-semibold text-gray-900 dark:text-white">
                                    {award.code
                                        .split('_')
                                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                        .join(' ')}
                                </h3>
                                <div
                                    class="mt-1 inline-flex items-center rounded-full bg-purple-200 px-2 py-1 text-sm font-medium text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
                                >
                                    {award.points} points
                                </div>
                            </div>
                        </div>
                        <p class="text-sm text-gray-600 dark:text-gray-400">{award.description}</p>
                        <div class="mt-4 flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                            <Calendar size={14} />
                            <span>Earned on {new Date(award.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                {/each}
            </div>
        {:else}
            <div class="rounded-xl bg-purple-50 p-8 dark:bg-purple-900/10">
                <div class="text-center mb-8">
                    <div class="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mb-4">
                        <Award class="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No Awards Yet
                    </h3>
                    <p class="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                        Start your financial journey with Optivest and earn awards by actively managing your finances.
                    </p>
                </div>
    
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {#each actionCards as card}
                        <a
                            href={card.link}
                            class="group block rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                            <div class="flex flex-col items-center text-center">
                                <div class={`w-12 h-12 rounded-full bg-${card.color}-100 dark:bg-${card.color}-900/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    {#if card.icon === PiggyBank}
                                        <PiggyBank class={`w-6 h-6 text-${card.color}-600 dark:text-${card.color}-400`} />
                                    {:else if card.icon === Target}
                                        <Target class={`w-6 h-6 text-${card.color}-600 dark:text-${card.color}-400`} />
                                    {:else if card.icon === TrendingUp}
                                        <TrendingUp class={`w-6 h-6 text-${card.color}-600 dark:text-${card.color}-400`} />
                                    {/if}
                                </div>
                                <h4 class="font-medium text-gray-900 dark:text-white mb-2">
                                    {card.title}
                                </h4>
                                <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    {card.description}
                                </p>
                                <div class={`flex items-center gap-1 text-${card.color}-600 dark:text-${card.color}-400 text-sm font-medium`}>
                                    Get Started
                                    <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </a>
                    {/each}
                </div>
            </div>
        {/if}
    </section>