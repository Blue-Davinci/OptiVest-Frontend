<script>
import {Target, Plus, Calendar} from 'lucide-svelte';
let {group, formatDate, calculateProgress} = $props();
</script>

{#if !group.GroupGoals?.length}
<div class="relative mt-8 overflow-hidden rounded-xl border border-purple-200 bg-white/50 p-8 dark:border-purple-100/10 dark:bg-gray-900/50">
    <!-- Decorative elements -->
    <div class="absolute inset-0 bg-gradient-to-br from-purple-50/80 to-white dark:from-purple-500/5 dark:to-transparent"></div>
    <div class="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-purple-100/50 blur-2xl dark:bg-purple-500/10"></div>
    <div class="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-purple-50/50 blur-3xl dark:bg-purple-400/5"></div>
    
    <div class="relative flex flex-col items-center justify-center space-y-6 text-center">
        <!-- Icon container with pulse animation -->
        <div class="relative">
            <div class="animate-pulse-slow absolute -inset-0.5 rounded-full bg-purple-200/50 blur dark:bg-purple-500/20"></div>
            <div class="relative rounded-full bg-purple-100 p-4 dark:bg-purple-100/10">
                <Target class="h-8 w-8 text-purple-600 dark:text-purple-300" />
            </div>
        </div>
        
        <!-- Text content -->
        <div class="space-y-3">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">No Goals Yet</h3>
            <p class="max-w-sm text-gray-600 dark:text-gray-300">
                Set your first group goal and start tracking progress together. Goals help keep your group motivated and focused.
            </p>
        </div>
        
        <!-- Action button with hover effect -->
        <button 
            class="group relative inline-flex items-center gap-2 rounded-full bg-purple-100 px-6 py-3 text-sm font-medium text-purple-700 transition-all duration-200 hover:bg-purple-200 hover:shadow-lg dark:bg-purple-500/20 dark:text-purple-200 dark:hover:bg-purple-500/30"
        >
            <Plus class="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
            Create Your First Goal
            <div class="absolute -inset-0.5 -z-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 opacity-0 blur transition duration-200 group-hover:opacity-15 dark:from-purple-400 dark:to-purple-300"></div>
        </button>
    </div>
</div>
{:else}
<div class="mt-12 space-y-8">
    <!-- Section Header -->
    <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Group Goals</h2>
        <button 
            class="group inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700 transition-all duration-200 hover:bg-purple-200 dark:bg-purple-500/20 dark:text-purple-200 dark:hover:bg-purple-500/30"
        >
            <Plus class="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
            Add Goal
        </button>
    </div>

    <!-- Goals Grid -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {#each group.GroupGoals as goal}
            <div class="group relative overflow-hidden rounded-xl bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl dark:bg-gray-800/50 dark:hover:bg-gray-800/80">
                <!-- Decorative gradient -->
                <div class="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-purple-500/5"></div>
                
                <!-- Content -->
                <div class="relative space-y-4">
                    <!-- Header -->
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{goal.name}</h3>
                        <Target class="h-5 w-5 text-purple-600 transition-transform duration-200 group-hover:scale-110 dark:text-purple-400" />
                    </div>

                    <!-- Description -->
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        {goal.description || 'No description provided'}
                    </p>

                    <!-- Progress Section -->
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                ${goal.current_amount} of ${goal.target_amount}
                            </span>
                            <span class="text-sm font-medium text-purple-600 dark:text-purple-400">
                                {calculateProgress(goal.current_amount, goal.target_amount)}%
                            </span>
                        </div>

                        <!-- Enhanced Progress Bar -->
                        <div class="relative h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                            <div
                                class="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500 dark:from-purple-400 dark:to-purple-500"
                                style="width: {calculateProgress(goal.current_amount, goal.target_amount)}%"
                            ></div>
                            <div class="absolute inset-0 rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"></div>
                        </div>

                        <!-- Footer Info -->
                        <div class="flex items-center justify-between text-sm">
                            <div class="flex items-center text-gray-500 dark:text-gray-400">
                                <Calendar class="mr-2 h-4 w-4" />
                                <span>Deadline: {formatDate(goal.deadline)}</span>
                            </div>
                            <button class="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300">
                                View Details →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>
{/if}