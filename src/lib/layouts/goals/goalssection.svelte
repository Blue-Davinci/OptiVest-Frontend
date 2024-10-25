<script>
    import GoalsSectionNotFound from './notfound/goalssectionnotfound.svelte';
	import { Progress } from '$lib/components/ui/progress';
	import { fly } from 'svelte/transition';
	import {
		Search,
		Target,
		Calendar,
		DollarSign,
		TrendingUp,
		Clock,
	} from 'lucide-svelte';

    let {goalSearchQuery, filteredGoals, formatCurrency,formatPercentage } = $props();

</script>

<section class="mb-12 rounded-xl border bg-card p-6 shadow-md">
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-2">
            <Target class="h-6 w-6 text-primary" />
            <h2 class="text-xl font-semibold">Your Goals</h2>
        </div>
        <div class="relative w-full max-w-md sm:w-auto">
            <Search
                class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground"
            />
            <input
                type="text"
                placeholder="Search goals..."
                bind:value={goalSearchQuery}
                class="w-full rounded-lg border bg-background py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
        </div>
    </div>

    {#if filteredGoals.length > 0}
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {#each filteredGoals as goal}
                <div
                    class="card transform transition-all duration-200 hover:scale-[1.02]"
                    transition:fly={{ y: 50, duration: 500 }}
                >
                    <div class="card-header rounded-t-lg bg-primary/5">
                        <h3 class="card-title flex items-center gap-2">
                            <Target class="h-5 w-5 text-primary" />
                            {goal.goals.name}
                        </h3>
                    </div>
                    <div class="card-content">
                        <div class="mb-6">
                            <div class="mb-2 flex justify-between">
                                <span class="text-sm text-muted-foreground">Progress</span>
                                <span class="text-sm font-medium"
                                    >{formatPercentage(goal.progress_percentage)}%</span
                                >
                            </div>
                            <Progress value={goal.progress_percentage} class="h-2" />
                        </div>

                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <span class="flex items-center gap-2 text-sm text-muted-foreground">
                                    <DollarSign class="h-4 w-4" />
                                    Current Amount
                                </span>
                                <span class="font-medium">
                                    {formatCurrency(goal.goals.current_amount)}
                                </span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Target class="h-4 w-4" />
                                    Target Amount
                                </span>
                                <span class="font-medium">
                                    {formatCurrency(goal.goals.target_amount)}
                                </span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="flex items-center gap-2 text-sm text-muted-foreground">
                                    <TrendingUp class="h-4 w-4" />
                                    Monthly Contribution
                                </span>
                                <span class="font-medium">
                                    {formatCurrency(goal.goals.monthly_contribution)}
                                </span>
                            </div>
                        </div>

                        <div class="mt-4 border-t pt-4">
                            <div class="flex justify-between text-sm">
                                <div class="flex items-center gap-2">
                                    <Calendar class="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p class="text-muted-foreground">Start Date</p>
                                        <p class="font-medium">
                                            {new Date(goal.goals.start_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <Clock class="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p class="text-muted-foreground">End Date</p>
                                        <p class="font-medium">
                                            {new Date(goal.goals.end_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {:else}
        <GoalsSectionNotFound {goalSearchQuery} />
    {/if}
</section>

<style lang="postcss">
	.card {
		@apply overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm;
	}

	.card-header {
		@apply space-y-1.5 p-6 pb-4;
	}

	.card-title {
		@apply text-lg font-semibold leading-none tracking-tight;
	}

	.card-content {
		@apply p-6;
	}
</style>