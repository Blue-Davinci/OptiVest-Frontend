<script>
	import { Users, UserPlus, Search } from 'lucide-svelte';
	import GroupCard from '$lib/layouts/groups/groupcard.svelte'
	import EmptyState from '$lib/layouts/groups/notfound/emptystate.svelte';
	import GroupTiles from '$lib/layouts/groups/tiles/grouptiles.svelte';
	
	let { data } = $props();
  let createdGroups = $derived(data?.createdGroups?.data?.groups ?? []);
  let membershipGroups = $derived(data?.memberGroups?.data?.groups ?? []);
	$inspect(createdGroups, 'createdGroups');
  // Search functionality
  let createdGroupsSearch = $state('');
  let membershipGroupsSearch = $state('');

  // Filtered groups based on search
  let filteredCreatedGroups = $derived(
    createdGroups.filter(group => 
      group.group.name.toLowerCase().includes(createdGroupsSearch.toLowerCase())
    )
  );

  let filteredMembershipGroups = $derived(
    membershipGroups.filter(group => 
      group.group.name.toLowerCase().includes(membershipGroupsSearch.toLowerCase())
    )
  );
</script>

<div class="w-full space-y-8 p-4">
	<!-- Overall Statistics -->
	<div class="rounded-xl bg-gray-50 p-6 dark:bg-gray-800/50">
	  <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">Group Overview</h2>
	  <GroupTiles groups={[...createdGroups, ...membershipGroups]} />
	</div>
  
	<!-- Created Groups Section -->
	<div class="space-y-4 rounded-xl bg-gray-50 p-6 dark:bg-gray-800/50">
	  <div class="flex flex-col space-y-4">
		<div class="flex items-center space-x-3">
		  <UserPlus class="h-8 w-8 text-purple-600 dark:text-purple-400" />
		  <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
			Groups You Created
		  </h2>
		</div>
		<p class="text-sm text-gray-600 dark:text-gray-400">
		  Manage and oversee the groups you've created
		</p>
		
		<!-- Search input for created groups -->
		<div class="relative">
		  <Search class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
		  <input
			type="text"
			bind:value={createdGroupsSearch}
			placeholder="Search your created groups..."
			class="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
		  />
		</div>
	  </div>
  
	  {#if createdGroups.length > 0}
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		  {#each filteredCreatedGroups as group}
			<GroupCard {group} />
		  {/each}
		</div>
		{#if filteredCreatedGroups.length === 0}
		  <div class="mt-4 text-center text-gray-600 dark:text-gray-400">
			No groups match your search
		  </div>
		{/if}
	  {:else}
		<EmptyState
		  icon={UserPlus}
		  title="Create Your First Group"
		  description="Start by creating a group to collaborate and manage finances together with others."
		/>
	  {/if}
	</div>
  
	<!-- Membership Groups Section -->
	<div class="space-y-4 rounded-xl bg-gray-50 p-6 dark:bg-gray-800/50">
	  <div class="flex flex-col space-y-4">
		<div class="flex items-center space-x-3">
		  <Users class="h-8 w-8 text-purple-600 dark:text-purple-400" />
		  <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
			Groups You're In
		  </h2>
		</div>
		<p class="text-sm text-gray-600 dark:text-gray-400">
		  Groups where you're a member
		</p>
  
		<!-- Search input for membership groups -->
		<div class="relative">
		  <Search class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
		  <input
			type="text"
			bind:value={membershipGroupsSearch}
			placeholder="Search groups you're in..."
			class="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
		  />
		</div>
	  </div>
  
	  {#if membershipGroups.length > 0}
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		  {#each filteredMembershipGroups as group}
			<GroupCard {group} showSettings={false} />
		  {/each}
		</div>
		{#if filteredMembershipGroups.length === 0}
		  <div class="mt-4 text-center text-gray-600 dark:text-gray-400">
			No groups match your search
		  </div>
		{/if}
	  {:else}
		<EmptyState
		  icon={Users}
		  title="No Group Memberships Yet"
		  description="Join other groups to collaborate and participate in shared financial goals."
		/>
	  {/if}
	</div>
  </div>
  
  <style>
	/* Custom scrollbar styles */
	:global(.scrollbar-thin::-webkit-scrollbar) {
	  width: 4px;
	}
  
	:global(.scrollbar-thin::-webkit-scrollbar-track) {
	  background: transparent;
	}
  
	:global(.scrollbar-thin::-webkit-scrollbar-thumb) {
	  border-radius: 2px;
	}
  
	/* Enhanced hover effect for dark mode */
	@media (prefers-color-scheme: dark) {
	  :global(.group:hover) {
		box-shadow:
		  0 8px 30px rgba(84, 4, 159, 0.2),
		  0 0 0 1px hsla(271, 94%, 35%, 0.302);
	  }
	}
  </style>