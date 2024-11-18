<script>
    import {Users, DollarSign, Activity} from 'lucide-svelte';
    let {group} = $props();

    let stats = $derived(() => {
		const groupData = group ?? {};
		return [
			{
				icon: Users,
				label: 'Members',
				value: `${groupData.GroupMembers?.length ?? 0}/${groupData.Group?.max_member_count ?? 0}`
			},
			{
				icon: DollarSign,
				label: 'Total Transactions',
				value: groupData.TotalGroupTransactions ?? 0
			},
			{
				icon: Activity,
				label: 'Activities',
				value: groupData.Group?.activity_count ?? 0
			}
		];
	});
</script>

<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
    {#each stats() as { icon: Icon, label, value }}
        <div
            class="transform rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 dark:bg-gray-800"
        >
            <div class="flex items-center space-x-4">
                <Icon class="h-8 w-8 text-purple-600 dark:text-purple-400" />
                <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                    <p class="text-xl font-semibold text-gray-900 dark:text-white">{value}</p>
                </div>
            </div>
        </div>
    {/each}
</div>