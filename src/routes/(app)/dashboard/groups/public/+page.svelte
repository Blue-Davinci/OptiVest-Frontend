<script>
	import { TOAST_TYPE_ERROR, TOAST_TYPE_SUCCESS } from '$lib/settings/constants.js';
	import { toastManager } from '$lib/helpers/utilities.js';
	import { formatDistanceToNow } from 'date-fns';
	import Pagination from '$lib/layouts/common/pagination.svelte';
	import { goto } from '$app/navigation';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { getPublicGroups, joinPublicGroup } from '$lib/dataservice/groups/groupsDataService';
	import {
		Search,
		Users,
		Activity,
		PlusCircle,
		LightbulbIcon,
		TrendingUp,
		DollarSign,
		Users2,
		Receipt,
		Target
	} from 'lucide-svelte';

	let { data } = $props();

	// Update group handling with new JSON structure
	let publicGroups = $derived(data?.groupsResponse?.data?.groups ?? []);
	let searchQuery = $state('');
	let isLoading = $state(false);

	// Metadata states
	let currentPage = $state(data?.groupsResponse?.data?.metadata?.current_page ?? 0);
	let pageSize = $state(data?.groupsResponse?.data?.metadata?.page_size ?? 0);
	let totalRecords = $state(data?.groupsResponse?.data?.metadata?.total_records ?? 0);
	let totalPages = $derived(Math.ceil(totalRecords / pageSize));

	// Filtered groups based on search query
	let filteredGroups = $derived(
		publicGroups.filter(({ enriched_group: { group } }) =>
			group.name.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	function formatDate(dateString) {
		return formatDistanceToNow(new Date(dateString), { addSuffix: true });
	}

	async function handleJoinGroup(groupId) {
		const response = await joinPublicGroup(groupId);
		if (!response.success) {
			console.error('Error joining group:', response.error);
			if (response.error) {
				for (const [key, value] of Object.entries(response.error)) {
					toastManager(TOAST_TYPE_ERROR, value);
				}
			}
			return;
		}
		console.log('Join Group Response:', response);
		// Redirect to the group page
		goto(`/dashboard/groups/${groupId}`);
	}

	async function fetchData(page, query = '') {
		isLoading = true;
		try {
			const response = await getPublicGroups({}, page, pageSize, query);
			if (!response.success) {
				console.error('Error fetching public groups:', response.error);
				return;
			}
			data = {
				groupsResponse: {
					data: {
						groups: response.data.groups,
						metadata: response.data.metadata
					}
				}
			};
		} catch (error) {
			console.error('Error fetching public groups:', error);
		} finally {
			isLoading = false;
		}
	}

	function handlePageChange(page) {
		fetchData(page, searchQuery);
	}
</script>

<div class="min-h-screen bg-gray-50 p-4 dark:bg-gray-900 sm:p-6 lg:p-8">
	<!-- Header and Search Section -->
	<div class="mx-auto mb-12 max-w-7xl space-y-6">
		<div class="space-y-2 text-center">
			<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Discover Groups</h1>
			<p class="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
				Join savings groups that match your financial goals and connect with like-minded savers
			</p>
		</div>

		<!-- Search Container with Enhanced Design -->
		<div class="mx-auto max-w-2xl">
			<div class="group relative">
				<div
					class="absolute inset-0 rounded-lg bg-purple-400/30 opacity-30 blur-xl transition-all duration-300 group-hover:blur-2xl dark:bg-purple-600/30"
				></div>
				<div class="relative">
					<Search class="absolute left-4 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search for savings groups..."
						class="w-full rounded-lg border border-gray-200 bg-white py-3 pl-12 pr-4
                     text-gray-900 shadow-sm transition-all duration-200
                     focus:border-transparent focus:ring-2 focus:ring-purple-500
                     dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
					/>
				</div>
			</div>
		</div>

		<!-- Tips Section -->
		<div class="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
			<div class="mb-4 flex items-center gap-2">
				<LightbulbIcon class="h-5 w-5 text-purple-500" />
				<h3 class="font-semibold text-gray-900 dark:text-white">
					Tips for Finding the Right Group
				</h3>
			</div>
			<div class="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
				<div class="flex items-start gap-2">
					<Users class="mt-0.5 h-5 w-5 text-purple-400" />
					<p class="text-gray-600 dark:text-gray-300">
						Look for groups with active members and regular activities
					</p>
				</div>
				<div class="flex items-start gap-2">
					<TrendingUp class="mt-0.5 h-5 w-5 text-purple-400" />
					<p class="text-gray-600 dark:text-gray-300">
						Check the group's savings goals and progress
					</p>
				</div>
				<div class="flex items-start gap-2">
					<DollarSign class="mt-0.5 h-5 w-5 text-purple-400" />
					<p class="text-gray-600 dark:text-gray-300">Review the group's transaction history</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Empty State -->
	{#if filteredGroups.length === 0}
		<div class="mx-auto max-w-md rounded-xl bg-white py-12 text-center shadow-lg dark:bg-gray-800">
			<Users class="mx-auto h-12 w-12 text-purple-400" />
			<h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No groups found</h3>
			<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
				Try adjusting your search or check back later for new groups.
			</p>
		</div>
	{/if}
	<!-- Main content wrapper with flex column -->
	<div class="mx-auto flex min-h-[calc(100vh-200px)] max-w-7xl flex-col">
		<!-- Groups Grid -->
		<div class="flex-grow">
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each filteredGroups as { is_user_a_member, enriched_group: { group, group_members, group_goals, total_members, total_group_transactions } } (group.id)}
					<div
						class="overflow-hidden rounded-xl bg-white shadow-md transition-all
                    duration-300 hover:scale-[1.02] hover:shadow-xl dark:bg-gray-800"
					>
						<!-- Group Image -->
						<div class="relative h-48 w-full">
							<img
								src={group.group_image_url}
								alt={group.name}
								class="h-full w-full object-cover"
							/>
							<div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
							<h3 class="absolute bottom-4 left-4 text-xl font-semibold text-white">
								{group.name}
							</h3>
						</div>

						<!-- Group Content -->
						<div class="p-6">
							<!-- Description -->
							<p class="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
								{group.description}
							</p>

							<!-- Stats Grid -->
							<div
								class="mb-4 grid grid-cols-3 gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50"
							>
								<div class="text-center">
									<div class="mb-1 flex items-center justify-center">
										<Users2 class="h-5 w-5 text-purple-500 dark:text-purple-400" />
									</div>
									<div class="font-semibold text-gray-900 dark:text-white">{total_members}</div>
									<div class="text-xs text-gray-500 dark:text-gray-400">Members</div>
								</div>
								<div class="text-center">
									<div class="mb-1 flex items-center justify-center">
										<Receipt class="h-5 w-5 text-purple-500 dark:text-purple-400" />
									</div>
									<div class="font-semibold text-gray-900 dark:text-white">
										{total_group_transactions}
									</div>
									<div class="text-xs text-gray-500 dark:text-gray-400">Transactions</div>
								</div>
								{#if group_goals.length > 0}
									<div class="text-center">
										<div class="mb-1 flex items-center justify-center">
											<Target class="h-5 w-5 text-purple-500 dark:text-purple-400" />
										</div>
										<div class="font-semibold text-gray-900 dark:text-white">
											${group_goals[0].target_amount}
										</div>
										<div class="text-xs text-gray-500 dark:text-gray-400">Target</div>
									</div>
								{/if}
							</div>

							<!-- Activity Info -->
							<div class="mb-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
								<Activity class="h-4 w-4" />
								<span>Last active {formatDate(group.last_activity_at)}</span>
							</div>

							<!-- Members -->
							<div class="mb-6 flex items-center justify-between">
								<div class="flex items-center">
									<div class="flex -space-x-2">
										{#each group_members.slice(0, 3) as member}
											<img
												src={member.profile_avatar_url}
												alt={member.first_name}
												class="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-gray-800"
											/>
										{/each}
									</div>
									<span class="ml-2 text-sm text-gray-500 dark:text-gray-400">
										{total_members}
										{total_members === 1 ? 'member' : 'members'}
									</span>
								</div>
							</div>

							<!-- Goals Preview -->
							{#if group_goals.length > 0}
								<div class="mb-6">
									<div class="mb-1 flex justify-between text-sm">
										<span class="font-medium text-gray-700 dark:text-gray-300">
											{group_goals[0].goal_name}
										</span>
										<span class="font-medium text-purple-600 dark:text-purple-400">
											${group_goals[0].current_amount}/${group_goals[0].target_amount}
										</span>
									</div>
									<div class="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
										<div
											class="h-full rounded-full bg-purple-600 transition-all duration-300"
											style="width: {(group_goals[0].current_amount /
												group_goals[0].target_amount) *
												100}%"
										></div>
									</div>
								</div>
							{/if}

							<!-- Join Button -->
							{#if !is_user_a_member}
								<div class="w-full">
									<AlertDialog.Root>
										<AlertDialog.Trigger class="w-full">
											<button
												class="flex w-full transform items-center justify-center gap-2
                                        rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 px-4
                                        py-3 font-medium text-white shadow-lg
                                        transition-all duration-300
                                        hover:translate-y-[-2px] hover:from-purple-700 hover:to-purple-800 hover:shadow-purple-500/25"
											>
												<PlusCircle class="h-5 w-5" />
												Join Group
											</button>
										</AlertDialog.Trigger>
										<AlertDialog.Content class="sm:max-w-[425px]">
											<AlertDialog.Header>
												<AlertDialog.Title
													class="text-xl font-semibold leading-none tracking-tight"
												>
													Join Group
												</AlertDialog.Title>
												<AlertDialog.Description
													class="mt-3 text-[15px] leading-normal text-muted-foreground"
												>
													Are you sure you want to join this group?
												</AlertDialog.Description>
											</AlertDialog.Header>
											<AlertDialog.Footer class="mt-6 flex gap-3">
												<AlertDialog.Cancel
													class="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
												>
													Cancel
												</AlertDialog.Cancel>
												<AlertDialog.Action
													on:click={() => handleJoinGroup(group.id)}
													class="inline-flex h-9 items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 dark:bg-purple-700 dark:hover:bg-purple-800"
												>
													Join Group
												</AlertDialog.Action>
											</AlertDialog.Footer>
										</AlertDialog.Content>
									</AlertDialog.Root>
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Pagination -->
		<Pagination {totalPages} {pageSize} {totalRecords} {handlePageChange} />
	</div>
</div>

<style>
</style>
