<script>
	import { LineChart } from 'layerchart';
	import { Progress } from '$lib/components/ui/progress';
	import { fly, slide } from 'svelte/transition';
	import {
		Search,
		Target,
		Calendar,
		DollarSign,
		TrendingUp,
		Clock,
		ArrowUpCircle,
		ArrowDownCircle,
		Inbox,
		PiggyBank,
		History,
		LineChart as ChartIcon
	} from 'lucide-svelte';

	let { data } = $props();
	$inspect(data);
	let goalData = $derived(data.goalData);
	let goalTrackingHistory = $derived(data.goalsTrackingHistory);
	let userInfo = $derived(data.userInformation);

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

	function prepareChartData(historyData) {
		if (!historyData?.data?.goal_tracking_history?.length) {
			return [];
		}

		const groupedByDate = historyData.data.goal_tracking_history.reduce((acc, item) => {
			const date = new Date(item.tracked_goal.truncated_tracking_date).toISOString().split('T')[0];
			acc[date] = (acc[date] || 0) + Number(item.tracked_goal.contributed_amount);
			return acc;
		}, {});

		return Object.entries(groupedByDate)
			.map(([date, value]) => ({
				date: new Date(date),
				value: value
			}))
			.sort((a, b) => a.date - b.date);
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

	let chartData = $derived(prepareChartData(goalTrackingHistory));
</script>

<div class="container mx-auto px-4 py-8">
	{#if userInfo}
		<div class="mb-8 flex items-center gap-4">
			<img
				src={userInfo.profile_url}
				alt="Profile"
				class="h-16 w-16 rounded-full border-2 border-primary object-cover shadow-lg"
			/>
			<div>
				<h1 class="text-2xl font-bold">
					Welcome, {userInfo.first_name}
					{userInfo.last_name}
				</h1>
				<p class="text-muted-foreground">Track your financial goals and progress</p>
			</div>
		</div>
	{/if}

	<!-- Goals Section -->
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
			<div
				class="flex flex-col items-center justify-center py-12 text-center"
				transition:fly={{ y: 20, duration: 300 }}
			>
				<div class="mb-4 rounded-full bg-primary/10 p-4">
					<PiggyBank class="h-8 w-8 text-primary" />
				</div>
				<h3 class="mb-2 text-xl font-semibold">No Goals Found</h3>
				<p class="max-w-md text-muted-foreground">
					{goalSearchQuery
						? "We couldn't find any goals matching your search. Try a different term?"
						: 'Time to dream big! Start by setting your first financial goal.'}
				</p>
			</div>
		{/if}
	</section>

	<!-- Chart Section -->
	<section class="mb-12 rounded-xl border bg-card p-6 shadow-md">
		<div class="mb-6 flex items-center justify-between">
			<div class="flex items-center gap-2">
				<TrendingUp class="h-6 w-6 text-primary" />
				<h2 class="text-xl font-semibold">Contribution Trends</h2>
			</div>
		</div>

		{#if chartData.length > 0}
			<div class="h-[400px] w-full">
				<LineChart
					data={chartData}
					x="date"
					series={[
						{
							key: 'value',
							color: 'hsl(270, 85%, 55%)' // Primary blue color
						}
					]}
					options={{
						line: {
							strokeWidth: 2,
							curve: 'monotoneX'
						}
					}}
					points
				/>
			</div>
		{:else}
			<div
				class="flex flex-col items-center justify-center py-12 text-center"
				transition:fly={{ y: 20, duration: 300 }}
			>
				<div class="mb-4 rounded-full bg-primary/10 p-4">
					<ChartIcon class="h-8 w-8 text-primary" />
				</div>
				<h3 class="mb-2 text-xl font-semibold">No Contribution Data Yet</h3>
				<p class="max-w-md text-muted-foreground">
					Your contribution chart will come to life as you start tracking your goals. Every small
					step counts!
				</p>
			</div>
		{/if}
	</section>

	<!-- Tracking History Table -->
	<section class="rounded-xl border bg-card p-6 shadow-md">
		<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div class="flex items-center gap-2">
				<Clock class="h-6 w-6 text-primary" />
				<h2 class="text-xl font-semibold">Tracking History</h2>
			</div>
			<div class="relative w-full max-w-md sm:w-auto">
				<Search
					class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground"
				/>
				<input
					type="text"
					placeholder="Search history..."
					bind:value={historySearchQuery}
					class="w-full rounded-lg border bg-background py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
				/>
			</div>
		</div>

		{#if filteredHistory.length > 0}
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead>
						<tr class="border-b bg-muted/30">
							<th class="px-6 py-4 text-left font-semibold">Goal Name</th>
							<th class="px-6 py-4 text-left font-semibold">Contribution</th>
							<th class="px-6 py-4 text-left font-semibold">Date</th>
							<th class="px-6 py-4 text-left font-semibold">Type</th>
						</tr>
					</thead>
					<tbody>
						{#each filteredHistory as history}
							<tr class="border-b transition-colors hover:bg-muted/30">
								<td class="px-6 py-4">
									<div class="flex items-center gap-2">
										<Target class="h-4 w-4 text-primary" />
										{history.goal_name}
									</div>
								</td>
								<td class="px-6 py-4">
									<div class="flex items-center gap-2">
										<DollarSign class="h-4 w-4 text-muted-foreground" />
										{formatCurrency(history.tracked_goal.contributed_amount)}
									</div>
								</td>
								<td class="px-6 py-4">
									<div class="flex items-center gap-2">
										<Calendar class="h-4 w-4 text-muted-foreground" />
										{new Date(history.tracked_goal.tracking_date).toLocaleDateString()}
									</div>
								</td>
								<td class="px-6 py-4">
									<div class="flex items-center gap-2">
										{#if history.tracked_goal.tracking_type === 'deposit'}
											<ArrowUpCircle class="h-4 w-4 text-green-500" />
										{:else}
											<ArrowDownCircle class="h-4 w-4 text-red-500" />
										{/if}
										<span class="capitalize">{history.tracked_goal.tracking_type}</span>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div
				class="flex flex-col items-center justify-center py-12 text-center"
				transition:fly={{ y: 20, duration: 300 }}
			>
				<div class="mb-4 rounded-full bg-primary/10 p-4">
					<History class="h-8 w-8 text-primary" />
				</div>
				<h3 class="mb-2 text-xl font-semibold">No History Available</h3>
				<p class="max-w-md text-muted-foreground">
					{historySearchQuery
						? 'No transactions match your search criteria. Try broadening your search?'
						: 'Your financial journey is about to begin! Transactions will appear here as you make progress.'}
				</p>
			</div>
		{/if}
	</section>
</div>

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
