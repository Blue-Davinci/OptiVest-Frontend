<script>
	import {
		Lock,
		Unlock,
		Users,
		Activity,
		Calendar,
		DollarSign,
		Target,
	} from 'lucide-svelte';
    import { TOAST_TYPE_ERROR, TOAST_TYPE_SUCCESS } from '$lib/settings/constants.js';
    import { toastManager } from '$lib/helpers/utilities.js';
    import {goto} from '$app/navigation';
    import Alertconfirmationdialog from '$lib/layouts/common/alertconfirmationdialog.svelte';
	let { group, groupTransactions, formatDate, handleRemoveUser } = $props();
    let dlgMessage = "Are you sure you want to leave this group? You will no longer be able to access the group's activities and transactions.";

	async function handleLeaveGroup() {
		let responseData = await handleRemoveUser(group.Group.id, 0, false);
        // if successful, show the toast, and use goto to navigate to /dashboard/groups
        if(responseData.success){
            toastManager(TOAST_TYPE_SUCCESS, responseData.value);
            goto('/dashboard/groups');
        } else {
            toastManager(TOAST_TYPE_ERROR, responseData.value);
        }
	}
</script>

<div class="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
	<!-- Main image with enhanced gradient -->
	<img
		src={group.Group.group_image_url}
		alt={group.Group.name}
		class="h-full w-full object-cover object-center"
	/>
	<div
		class="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black/90"
		style="background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.9) 100%)"
	></div>

	<!-- Content overlay with improved mobile layout -->
	<div class="absolute inset-0 flex items-end">
		<div class="mx-auto w-full max-w-7xl space-y-4 p-4 sm:p-6 md:p-8">
			<!-- Top floating stats with better mobile spacing -->
			<div class="relative mt-12 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center sm:gap-6">
				<!-- Member Avatars with improved mobile positioning -->
				<div class="relative flex items-center">
					<div class="flex flex-wrap gap-2 sm:gap-0">
						{#each group.GroupMembers.slice(0, 5) as member, index}
							<div
								class="relative sm:first:ml-0"
								style="margin-left: {index === 0 ? '0' : '-8px'}; z-index: {5 - index}"
							>
								<img
									src={member.profile_avatar_url}
									alt={member.first_name}
									class="h-8 w-8 rounded-full border-2 border-white object-cover transition-all duration-200 hover:scale-110 hover:shadow-lg dark:border-gray-800 sm:h-10 sm:w-10"
								/>
								<!-- Hover tooltip with improved positioning -->
								<div
									class="absolute -top-8 left-1/2 hidden -translate-x-1/2 transform whitespace-nowrap rounded bg-black/75 px-2 py-1 text-xs text-white group-hover:block"
								>
									{member.first_name}
								</div>
							</div>
						{/each}
						{#if group.GroupMembers.length > 5}
							<div class="relative sm:ml-[-8px]" style="z-index: 0">
								<div
									class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-purple-500 text-xs font-medium text-white transition-all duration-200 hover:scale-110 hover:shadow-lg dark:border-gray-800 sm:h-10 sm:w-10 sm:text-sm"
								>
									+{group.GroupMembers.length - 5}
								</div>
							</div>
						{/if}
					</div>
				</div>

				<!-- Quick stats with improved wrapping -->
				<div class="flex flex-wrap gap-2 sm:gap-4">
					<div class="rounded-full bg-black/30 px-3 py-1.5 backdrop-blur-sm sm:px-4 sm:py-2">
						<div class="flex items-center gap-1.5 text-white sm:gap-2">
							<Users class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
							<span class="text-xs sm:text-sm">{group.GroupMembers.length} members</span>
						</div>
					</div>
					<div class="rounded-full bg-black/30 px-3 py-1.5 backdrop-blur-sm sm:px-4 sm:py-2">
						<div class="flex items-center gap-1.5 text-white sm:gap-2">
							<Activity class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
							<span class="text-xs sm:text-sm">{group.Group.activity_count} activities</span>
						</div>
					</div>
					<div
						class="hidden rounded-full bg-black/30 px-3 py-1.5 backdrop-blur-sm sm:flex sm:px-4 sm:py-2"
					>
						<div class="flex items-center gap-1.5 text-white sm:gap-2">
							<Calendar class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
							<span class="text-xs sm:text-sm">Created {formatDate(group.Group.created_at)}</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Main content with improved spacing -->
			<div class="space-y-2 sm:space-y-4">
				<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
					<h1 class="text-2xl font-bold text-white sm:text-3xl md:text-4xl lg:text-5xl">
						{group.Group.name}
					</h1>
					{#if group.Group.is_private}
						<div
							class="flex w-fit items-center gap-2 rounded-full bg-black/30 px-3 py-1 backdrop-blur-sm"
						>
							<Lock class="h-3.5 w-3.5 text-white sm:h-4 sm:w-4" />
							<span class="text-xs text-white sm:text-sm">Private Group</span>
						</div>
					{:else}
						<div
							class="flex w-fit items-center gap-2 rounded-full bg-black/30 px-3 py-1 backdrop-blur-sm"
						>
							<Unlock class="h-3.5 w-3.5 text-white sm:h-4 sm:w-4" />
							<span class="text-xs text-white sm:text-sm">Public Group</span>
						</div>
					{/if}
				</div>

				<p class="max-w-2xl text-sm leading-relaxed text-gray-200 sm:text-base md:text-lg">
					{group.Group.description}
				</p>

				<!-- Engagement indicators with improved mobile layout -->
				<div class="mt-4 flex flex-wrap items-center gap-3 sm:mt-6 sm:gap-6">
					<div class="flex items-center gap-3 sm:gap-4">
						<div class="flex items-center gap-1.5 sm:gap-2">
							<DollarSign class="h-4 w-4 text-purple-400 sm:h-5 sm:w-5" />
							<span class="text-xs font-medium text-white sm:text-sm">
								${parseFloat(groupTransactions?.total_transaction_amount ?? 0).toFixed(2)} Total
							</span>
						</div>
						<div class="hidden h-4 w-px bg-gray-500 sm:block"></div>
						<div class="flex items-center gap-1.5 sm:gap-2">
							<Target class="h-4 w-4 text-purple-400 sm:h-5 sm:w-5" />
							<span class="text-xs font-medium text-white sm:text-sm">
								{group.GroupGoals?.length ?? 0} Goals
							</span>
						</div>
						<div class="hidden h-4 w-px bg-gray-500 sm:block"></div>
						<!-- Leave Group Button -->
                         <Alertconfirmationdialog negativeLabel={'Leave Group'} {dlgMessage}, alertHandleContinue={handleLeaveGroup} />
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
