<script>
	import {
		Clock,
		TrendingUp,
		CreditCard,
		Wallet,
		Activity,
	} from 'lucide-svelte';

	// Mock activity timeline data
	const activities = [
		{
			type: 'budget',
			description: 'Created new budget',
			amount: '$500',
			date: '2 hours ago'
		},
		{
			type: 'expense',
			description: 'Added new expense',
			amount: '$75',
			date: 'Yesterday'
		},
		{
			type: 'goal',
			description: 'Achieved savings goal',
			amount: '$1,000',
			date: '3 days ago'
		}
	];
</script>

<section class="mt-6 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
    <h2 class="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
        <Activity />
        Recent Activity
    </h2>
    <div class="space-y-4">
        {#each activities as activity}
            <div class="flex items-start gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                <div class="rounded-full bg-purple-100 p-2 dark:bg-purple-900/50">
                    {#if activity.type === 'budget'}
                        <Wallet class="text-purple-600 dark:text-purple-400" size={20} />
                    {:else if activity.type === 'expense'}
                        <CreditCard class="text-purple-600 dark:text-purple-400" size={20} />
                    {:else}
                        <TrendingUp class="text-purple-600 dark:text-purple-400" size={20} />
                    {/if}
                </div>
                <div class="flex-1">
                    <div class="flex justify-between">
                        <h3 class="font-medium text-gray-900 dark:text-white">{activity.description}</h3>
                        <span class="font-medium text-purple-600 dark:text-purple-400"
                            >{activity.amount}</span
                        >
                    </div>
                    <p class="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <Clock size={14} />
                        {activity.date}
                    </p>
                </div>
            </div>
        {/each}
    </div>
</section>