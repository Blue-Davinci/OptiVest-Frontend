<script>
	import GoalsChart from '$lib/layouts/goals/goalschart.svelte';
	import GoalChartNotFound from '$lib/layouts/goals/notfound/goalchartnotfound.svelte';
	import GoalsSection from '$lib/layouts/goals/goalssection.svelte';
	import GoalTrackingcCarts from '$lib/layouts/goals/goaltrackingcharts.svelte';
	import GoalsTrackingHistory from '$lib/layouts/goals/goalstrackinghistory.svelte';
	import CreateGoal from '$lib/layouts/goals/creategoal.svelte';
	import UserSection from '$lib/layouts/common/usersection.svelte';


	let { data } = $props();

	let defaultCurrency = $state(data.userInformation.currency_code);
	let goalData = $derived(data?.goalData ?? {} );
	let budgetIDNames = $derived(data?.budgetIDNames?.data?.budget_id_names ?? []);	
	let goalTrackingHistory = $derived(data.goalsTrackingHistory);
	let userInfo = $derived(data.userInformation);
	$inspect(budgetIDNames);
	let goalSearchQuery = $state('');
	let historySearchQuery = $state('');

	function formatCurrency(amount) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: userInfo.currency_code
		}).format(amount);
	}

	function formatPercentage(value) {
		return parseFloat(value).toFixed(2);
	}


	let filteredGoals = $derived(
		goalData?.data?.goals?.filter((goal) =>
			goal.goals.name.toLowerCase().includes(goalSearchQuery.toLowerCase())
		) || []
	);

	let filteredHistory = $derived(
		goalTrackingHistory?.data?.goal_tracking_history?.filter((history) =>
			history.goal_name.toLowerCase().includes(historySearchQuery.toLowerCase())
		) || []
	);


</script>

<div class="container mx-auto px-4 py-8">
	<UserSection {userInfo} />

	{#if goalData?.data?.goals && !goalData?.data?.error && goalData?.data?.goals.length > 0}
		<GoalsChart {goalData} {formatCurrency} {formatPercentage} {filteredGoals} />
	{:else}
		<GoalChartNotFound />
	{/if}

	<!-- Goals Section -->
	<GoalsSection {filteredGoals} {goalSearchQuery} {formatCurrency} {formatPercentage} />
	<!-- Chart Section -->
	<GoalTrackingcCarts {goalTrackingHistory} />

	<!-- Tracking History Table -->
	<GoalsTrackingHistory {historySearchQuery} {filteredHistory} {formatCurrency} />
</div>

<CreateGoal {data} {defaultCurrency} {budgetIDNames} />

<style lang="postcss">

</style>
