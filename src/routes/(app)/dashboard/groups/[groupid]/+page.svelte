<script>
	import {
		Users,
		Target,
		Calendar,
		Lock,
		Unlock,
		DollarSign,
		Activity,
		Mail,
		CreditCard,
		Receipt,
    Crown,
    UserMinus,
    User,
    ArrowUp,
    ArrowDown,
    Bell,
    Trash2,
    Plus,
    UserPlus,
	} from 'lucide-svelte';
  import { inviteMembers } from '$lib/dataservice/groups/groupsDataService.js';
  import AddGroupMember from '$lib/layouts/groups/addgroupmember.svelte';

	let { data } = $props();
	let group = $derived(data?.data?.group ?? {});
	let groupTransactions = $derived(data?.groupTransactions?.transactions ?? {});
	let groupExpenses = $derived(data?.groupExpenses?.expenses ?? {});
  let userInformation = $derived(data?.userInformation ?? {});
  
  let currentUser = $derived(() => {
  // Ensure userInformation and GroupMembers exist before proceeding
  if (!userInformation?.id || !group?.GroupMembers) {
    return null; // Return null if no match or data is missing
  }

  // Find the matching group member with the same user_id as the logged-in user
  let matchedMember = group.GroupMembers.find(
    (member) => member.user_id === parseInt(userInformation.id)
  );

  // Return the role of the matched member or a default role if no match
  return matchedMember ? matchedMember.role : "regular";
});
	let expenseSearch = $state('');
	let transactionSearch = $state('');

	$inspect(data, 'data');
	$inspect({ groupTransactions, groupExpenses });
	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};
	let filteredExpenses = $derived(
		() =>
			groupExpenses?.group_expense?.filter(
				(expense) =>
					expense.description.toLowerCase().includes(expenseSearch.toLowerCase()) ||
					expense.category.toLowerCase().includes(expenseSearch.toLowerCase())
			) ?? []
	);
	$inspect(filteredExpenses(), 'filteredExpenses');

	let filteredTransactions = $derived(
		() =>
			groupTransactions?.group_transaction?.filter((transaction) =>
				transaction.group_transaction.description
					.toLowerCase()
					.includes(transactionSearch.toLowerCase())
			) ?? []
	);

	const calculateProgress = (current, target) => {
		return Math.round((parseFloat(current) / parseFloat(target)) * 100);
	};

	const getRoleBadgeClasses = (role) => {
		const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
		switch (role) {
			case 'admin':
				return `${baseClasses} bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200`;
			case 'moderator':
				return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`;
			default:
				return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`;
		}
	};

	function handleDemoteUser(userId) {
    console.log(`Demote user with ID: ${userId}`);
  }

  function handlePromoteUser(userId) {
    console.log(`Promote user with ID: ${userId}`);
  }

  function handleRemoveUser(userId) {
    console.log(`Remove user with ID: ${userId}`);
  }
  function handleAddMember() {
    console.log('Add new member');
  }

	let stats = $derived([
		{
			icon: Users,
			label: 'Members',
			value: `${group.GroupMembers?.length ?? 0}/${group.Group?.max_member_count ?? 0}`
		},
		{
			icon: DollarSign,
			label: 'Total Transactions',
			value: group.TotalGroupTransactions ?? 0
		},
		{
			icon: Activity,
			label: 'Activities',
			value: group.Group?.activity_count ?? 0
		}
	]);

  
	async function inviteNewMembers(groupID, inviteeEmail) {
		// Add the logic to invite members here
		try {
			let responseData = await inviteMembers(groupID, inviteeEmail);
			if (responseData.success) {
        console.log("Response Data: ", responseData.data);
        data = {
        ...data,
        data: {
          ...data.data,
          group: {
            ...data.data.group,
            PendingInvitations: [
              ...data.data.group.PendingInvitations,
              responseData.data.group_invitation // add directly
            ]
          }
        }
      };
				return{ 
          success :true, 
          value: 'group invite successful'
        };
			} else {
				// Check if the error is an object
				if (typeof responseData.error === 'object') {
					// Iterate over each error key and log the details
					for (const [_, value] of Object.entries(responseData.error)) {
						return {
              success: false,
              value: value
            };
					}
				} else {
          return {
            success: false,
            value: responseData.error
          };
				}
			}
		} catch (err) {
			console.log(err);
		}
	}
</script>

<div class="min-h-screen bg-gray-50 transition-colors duration-200 dark:bg-gray-900">
<!-- Hero Section with Improved Mobile Responsiveness -->
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
                              <div class="absolute -top-8 left-1/2 hidden -translate-x-1/2 transform whitespace-nowrap rounded bg-black/75 px-2 py-1 text-xs text-white group-hover:block">
                                  {member.first_name}
                              </div>
                          </div>
                      {/each}
                      {#if group.GroupMembers.length > 5}
                          <div 
                              class="relative sm:ml-[-8px]"
                              style="z-index: 0"
                          >
                              <div class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-purple-500 text-xs font-medium text-white transition-all duration-200 hover:scale-110 hover:shadow-lg dark:border-gray-800 sm:h-10 sm:w-10 sm:text-sm">
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
                  <div class="hidden rounded-full bg-black/30 px-3 py-1.5 backdrop-blur-sm sm:flex sm:px-4 sm:py-2">
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
                      <div class="flex w-fit items-center gap-2 rounded-full bg-black/30 px-3 py-1 backdrop-blur-sm">
                          <Lock class="h-3.5 w-3.5 text-white sm:h-4 sm:w-4" />
                          <span class="text-xs text-white sm:text-sm">Private Group</span>
                      </div>
                  {:else}
                      <div class="flex w-fit items-center gap-2 rounded-full bg-black/30 px-3 py-1 backdrop-blur-sm">
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
                  </div>
              </div>
          </div>
      </div>
  </div>
</div>

	<!-- Stats Section - Moved below hero without overlap -->
	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
			{#each stats as { icon: Icon, label, value }}
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

		<!-- Group Goals -->
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

		<!-- Members Grid - Improved Layout -->
    <div class="mt-12">
      <div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Members</h2>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Manage your group members and their roles
              </p>
          </div>
          <div class="flex items-center gap-3">
              <div class="flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 dark:bg-purple-900/30">
                  <Users class="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span class="text-sm font-medium text-purple-600 dark:text-purple-400">
                      {group.GroupMembers.length}/{group.Group.max_member_count}
                  </span>
              </div>
              
              <!-- New Add Member Button - Only visible to admins/moderators -->
              {#if ['admin', 'moderator'].includes(currentUser())}
                  <AddGroupMember groupID={group.Group.id} {inviteNewMembers} />
              {/if}
          </div>
      </div>
  
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {#each group.GroupMembers as member}
              <div class="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
                  <!-- Role Banner -->
                  <div class={`absolute left-0 right-0 top-0 h-1
                      ${member.role === 'admin' ? 'bg-red-500' : 
                      member.role === 'moderator' ? 'bg-purple-500' : 
                      'bg-blue-500'}`}
                  ></div>
  
                  <!-- Member Content -->
                  <div class="p-4">
                      <div class="relative mb-3 flex justify-center">
                          <img
                              src={member.profile_avatar_url}
                              alt={member.first_name}
                              class="h-20 w-20 rounded-full object-cover ring-4 ring-white dark:ring-gray-700"
                          />
                          <div class={`absolute -right-1 bottom-0 rounded-full p-1.5 ring-2 ring-white dark:ring-gray-700
                              ${member.role === 'admin' ? 'bg-red-100 dark:bg-red-900' : 
                              member.role === 'moderator' ? 'bg-purple-100 dark:bg-purple-900' : 
                              'bg-blue-100 dark:bg-blue-900'}`}>
                              {#if member.role === 'admin'}
                                  <Crown class="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                              {:else if member.role === 'moderator'}
                                  <Shield class="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                              {:else}
                                  <User class="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                              {/if}
                          </div>
                      </div>
  
                      <div class="text-center">
                          <h3 class="mb-1 text-base font-semibold text-gray-900 dark:text-white">
                              {member.first_name} {member.last_name}
                          </h3>
                          <div class={`mb-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                              ${member.role === 'admin' ? 
                              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                              member.role === 'moderator' ? 
                              'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : 
                              'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}`}>
                              {member.role}
                          </div>
                          <p class="text-xs text-gray-500 dark:text-gray-400">
                              Joined {formatDate(member.join_date)}
                          </p>
                      </div>
  
                      <!-- Stats -->
                      <div class="mt-3 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3 dark:border-gray-700">
                          <div class="text-center">
                              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Transactions</p>
                              <p class="text-sm font-semibold text-gray-900 dark:text-white">{member.transaction_count ?? 0}</p>
                          </div>
                          <div class="text-center">
                              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Contributions</p>
                              <p class="text-sm font-semibold text-gray-900 dark:text-white">
                                  ${parseFloat(member.total_transaction_amount ?? 0).toFixed(2)}
                              </p>
                          </div>
                      </div>
  
                      <!-- Admin Actions -->
                      {#if currentUser() === 'admin'}
                          <div class="mt-3 border-t border-gray-100 pt-3 dark:border-gray-700">
                              <div class="flex justify-center gap-2">
                                  {#if member.role === 'moderator'}
                                      <button
                                          onclick={() => handleDemoteUser(member.user_id)}
                                          class="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                                      >
                                          <ArrowDown class="h-3.5 w-3.5" />
                                          Demote
                                      </button>
                                  {:else if member.role === 'member'}
                                      <button
                                          onclick={() => handlePromoteUser(member.user_id)}
                                          class="inline-flex items-center gap-1 rounded-lg bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700 transition-colors hover:bg-purple-200 dark:bg-purple-900/50 dark:text-purple-200 dark:hover:bg-purple-900"
                                      >
                                          <ArrowUp class="h-3.5 w-3.5" />
                                          Promote
                                      </button>
                                  {/if}
                                  <button
                                      onclick={() => handleRemoveUser(member.user_id)}
                                      class="inline-flex items-center gap-1 rounded-lg bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-200 dark:bg-red-900/50 dark:text-red-200 dark:hover:bg-red-900"
                                  >
                                      <UserMinus class="h-3.5 w-3.5" />
                                      Remove
                                  </button>
                              </div>
                          </div>
                      {/if}
                  </div>
              </div>
          {/each}
      </div>
  </div>

		<!-- Expenses Section -->
		<div class="mt-12">
			<div class="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
				<!-- Header and Stats -->
				<div class="space-y-6">
					<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<h2 class="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
							<Receipt class="h-6 w-6" />
							Group Expenses
						</h2>
						<!-- Stats Cards -->
						<div class="flex flex-wrap gap-4">
							<div class="min-w-[200px] flex-1 rounded-lg bg-purple-50 p-4 dark:bg-purple-900/50">
								<p class="text-sm text-purple-600 dark:text-purple-300">Total Expenses</p>
								<p class="text-2xl font-bold text-purple-700 dark:text-purple-200">
									${parseFloat(groupExpenses?.total_group_expenses ?? 0).toFixed(2)}
								</p>
							</div>
							<div class="min-w-[200px] flex-1 rounded-lg bg-green-50 p-4 dark:bg-green-900/50">
								<p class="text-sm text-green-600 dark:text-green-300">Latest Expense</p>
								<p class="text-2xl font-bold text-green-700 dark:text-green-200">
									${parseFloat(groupExpenses?.latest_expense_amount ?? 0).toFixed(2)}
								</p>
							</div>
						</div>
					</div>

					<!-- Search Input -->
					<div class="relative">
						<input
							type="text"
							bind:value={expenseSearch}
							placeholder="Search expenses..."
							class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-purple-400"
						/>
						<div class="absolute inset-y-0 right-0 flex items-center pr-3">
							<svg
								class="h-5 w-5 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</div>
					</div>
				</div>

				<!-- Table -->
				<div class="mt-6 overflow-x-auto">
					<div class="inline-block min-w-full align-middle">
						<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
							<thead class="bg-gray-50 dark:bg-gray-900">
								<tr>
									<th
										class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
										>Description</th
									>
									<th
										class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
										>Amount</th
									>
									<th
										class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
										>Category</th
									>
									<th
										class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
										>Member ID</th
									>
									<th
										class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
										>Date</th
									>
								</tr>
							</thead>
							<tbody
								class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800"
							>
								{#each filteredExpenses() as expense}
									<tr
										class="transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-700"
									>
										<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white"
											>{expense.description}</td
										>
										<td
											class="whitespace-nowrap px-6 py-4 text-sm font-medium text-green-600 dark:text-green-400"
											>${parseFloat(expense.amount).toFixed(2)}</td
										>
										<td
											class="whitespace-nowrap px-6 py-4 text-sm capitalize text-gray-900 dark:text-white"
											>{expense.category}</td
										>
										<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white"
											>{expense.member_id}</td
										>
										<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white"
											>{formatDate(expense.created_at)}</td
										>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>

		<!-- Transactions Section -->
		<div class="mt-12">
			<div class="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
				<!-- Header and Stats -->
				<div class="space-y-6">
					<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<h2 class="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
							<CreditCard class="h-6 w-6" />
							Group Transactions
						</h2>
						<!-- Stats Cards -->
						<div class="flex flex-wrap gap-4">
							<div class="min-w-[200px] flex-1 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/50">
								<p class="text-sm text-blue-600 dark:text-blue-300">Total Transactions</p>
								<p class="text-2xl font-bold text-blue-700 dark:text-blue-200">
									${parseFloat(groupTransactions?.total_transaction_amount ?? 0).toFixed(2)}
								</p>
							</div>
							<div class="min-w-[200px] flex-1 rounded-lg bg-indigo-50 p-4 dark:bg-indigo-900/50">
								<p class="text-sm text-indigo-600 dark:text-indigo-300">Latest Transaction</p>
								<p class="text-2xl font-bold text-indigo-700 dark:text-indigo-200">
									${parseFloat(groupTransactions?.latest_transaction_amount ?? 0).toFixed(2)}
								</p>
							</div>
						</div>
					</div>

					<!-- Search Input -->
					<div class="relative">
						<input
							type="text"
							bind:value={transactionSearch}
							placeholder="Search transactions..."
							class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-400"
						/>
						<div class="absolute inset-y-0 right-0 flex items-center pr-3">
							<svg
								class="h-5 w-5 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</div>
					</div>
				</div>

				<!-- Table -->
				<div class="mt-6 overflow-x-auto">
					<div class="inline-block min-w-full align-middle">
						<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
							<thead class="bg-gray-50 dark:bg-gray-900">
								<tr>
									<th
										class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
										>Description</th
									>
									<th
										class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
										>Amount</th
									>
									<th
										class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
										>Member ID</th
									>
									<th
										class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
										>Goal</th
									>
									<th
										class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
										>Date</th
									>
								</tr>
							</thead>
							<tbody
								class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800"
							>
								{#each filteredTransactions() as transaction}
									<tr
										class="transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-700"
									>
										<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
											{transaction.group_transaction.description}
										</td>
										<td
											class="whitespace-nowrap px-6 py-4 text-sm font-medium text-blue-600 dark:text-blue-400"
										>
											${parseFloat(transaction.group_transaction.amount).toFixed(2)}
										</td>
										<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
											{transaction.group_transaction.member_id}
										</td>
										<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
											{transaction.goal_name}
										</td>
										<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
											{formatDate(transaction.group_transaction.created_at)}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>

    {#if (currentUser() === 'admin' || currentUser() === 'moderator') && group.PendingInvitations.length > 0}
    <div class="mt-12">
        <div class="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Pending Invitations</h2>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Manage and track pending group invitations
                </p>
            </div>
            <div class="flex items-center gap-3">
                <span class="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1.5 text-sm font-medium text-purple-800 dark:bg-purple-900/50 dark:text-purple-200">
                    <Mail class="h-4 w-4" />
                    {group.PendingInvitations.length} pending
                </span>
            </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {#each group.PendingInvitations as invitation}
                <div class="group relative overflow-hidden rounded-xl bg-white p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800">
                    <!-- Status Indicator -->
                    <div class="absolute left-0 right-0 top-0 h-1 bg-yellow-500"></div>

                    <div class="flex flex-col gap-4">
                        <!-- Header -->
                        <div class="flex items-start justify-between">
                            <div class="flex-1">
                                <div class="flex items-center gap-2">
                                    <div class="rounded-full bg-purple-100 p-2 dark:bg-purple-900/50">
                                        <Mail class="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div class="flex-1 truncate">
                                        <p class="truncate font-medium text-gray-900 dark:text-white">
                                            {invitation.invitee_user_email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <span class="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200">
                                {invitation.status}
                            </span>
                        </div>

                        <!-- Info -->
                        <div class="space-y-2">
                            <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <Calendar class="h-4 w-4" />
                                <span>Sent: {formatDate(invitation.sent_at)}</span>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="flex flex-wrap items-center gap-2 pt-2">
                            <button
                                onclick={() => {
                                    console.log(`Buzz invitation for: ${invitation.invitee_user_email}`);
                                }}
                                class="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-purple-100 px-3 py-1.5 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-200 dark:bg-purple-900/50 dark:text-purple-200 dark:hover:bg-purple-900"
                            >
                                <Bell class="h-4 w-4" />
                                Buzz Again
                            </button>
                            <button
                                onclick={() => {
                                    console.log(`Delete invitation for: ${invitation.invitee_user_email}`);
                                }}
                                class="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-200 dark:bg-red-900/50 dark:text-red-200 dark:hover:bg-red-900"
                            >
                                <Trash2 class="h-4 w-4" />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
{/if}
	</div>
</div>

<style>
      .group:hover {
        transform: translateY(-2px);
    }
</style>
