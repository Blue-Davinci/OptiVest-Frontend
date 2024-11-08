<script>
    import { Settings, Users, CreditCard, Goal, Crown, Shield, Coins, Lock } from 'lucide-svelte';
    
    let { group, showSettings = true } = $props();
    
    function formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  
    function calculateProgress(current, target) {
      return (current / target) * 100;
    }
  
    function formatAmount(amount) {
      return parseFloat(amount).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      });
    }
  
    function getRoleBadge(role) {
      switch (role) {
        case 'admin':
          return {
            icon: Crown,
            color: 'text-yellow-600 dark:text-yellow-400',
            bg: 'bg-yellow-100 dark:bg-yellow-900/50',
            label: 'Admin'
          };
        case 'moderator':
          return {
            icon: Shield,
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-100 dark:bg-blue-900/50',
            label: 'Moderator'
          };
        default:
          return {
            icon: Users,
            color: 'text-gray-600 dark:text-gray-400',
            bg: 'bg-gray-100 dark:bg-gray-800',
            label: 'Member'
          };
      }
    }
  </script>
  
  <div
    class="group max-h-[42rem] min-h-[36rem] overflow-hidden rounded-lg border border-gray-100
      bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all
      duration-300 ease-in-out hover:translate-y-[-4px]
      hover:border-gray-500 hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)]
      dark:border-gray-700 dark:bg-gray-800 dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)]
      dark:hover:border-gray-500 dark:hover:bg-gray-800/95
      dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
  >
    <!-- Group Header - Clickable Image Section -->
    <div class="group/image relative h-48">
      <a
        href={`/dashboard/groups/${group.group.id}`}
        class="block h-full w-full transition-transform duration-300 group-hover/image:scale-[1.02]"
      >
        <img
          src={group.group.group_image_url}
          alt={group.group.name}
          class="h-full w-full object-cover"
        />
        <div
          class="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover/image:opacity-20"
        ></div>
      </a>
      {#if showSettings}
        <div class="absolute right-4 top-4 z-10">
          <button
            class="rounded-full bg-white/90 p-2 shadow-lg transition-colors
              hover:bg-purple-50 hover:shadow-purple-200/50
              dark:bg-gray-800/90 dark:hover:bg-purple-900/50
              dark:hover:shadow-purple-500/30"
            title="Update Group"
            onclick={(e) => e.preventDefault()}
          >
            <Settings class="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </button>
        </div>
      {/if}
    </div>
  
    <!-- Group Content -->
    <div class="flex h-[calc(100%-12rem)] flex-col p-6">
      <!-- Group Name and Privacy -->
      <div class="mb-4 flex items-start justify-between">
        <h3
          class="text-xl font-semibold text-gray-900 transition-colors
            group-hover:text-purple-700 dark:text-gray-100
            dark:group-hover:text-purple-400"
        >
          {group.group.name}
        </h3>
        <span
          class="inline-flex items-center gap-1.5 rounded-full bg-purple-100
            px-2.5 py-1 text-sm text-purple-600 dark:bg-purple-900/50
            dark:text-purple-300"
        >
          {#if group.group.is_private}
            <Lock class="h-3.5 w-3.5" />
          {/if}
          {group.group.is_private ? 'Private' : 'Public'}
        </span>
      </div>
  
      <!-- Description -->
      <p
        class="mb-4 line-clamp-2 min-h-[2.5rem] overflow-hidden overflow-ellipsis
          break-words text-sm text-gray-600 [-webkit-box-orient:vertical]
          [-webkit-line-clamp:2] [display:-webkit-box] dark:text-gray-300"
      >
        {group.group.description}
      </p>
  
      <!-- Members -->
      <div class="mb-4 flex flex-wrap items-center gap-4">
        <div class="flex flex-shrink-0 -space-x-2">
          {#each group.group_members.slice(0, 5) as member}
            <div class="group/tooltip relative mr-3">
              <img
                src={member.profile_avatar_url}
                alt={member.first_name}
                class="h-8 w-8 rounded-full border-2 border-white ring-2
                  ring-transparent transition-all hover:ring-purple-400
                  dark:border-gray-800 dark:hover:ring-purple-500 sm:h-8 sm:w-8"
              />
              <!-- Role Badge -->
              <div class="absolute -bottom-1 -right-1">
                {#if member.role !== 'regular'}
                  {@const badge = getRoleBadge(member.role)}
                  <div
                    class={`flex h-4 w-4 items-center justify-center rounded-full ${badge.bg}`}
                  >
                    {#if member.role === 'admin'}
                      <Crown class={`h-3 w-3 ${badge.color}`} />
                    {:else if member.role === 'moderator'}
                      <Shield class={`h-3 w-3 ${badge.color}`} />
                    {:else}
                      <Users class={`h-3 w-3 ${badge.color}`} />
                    {/if}
                  </div>
                {/if}
              </div>
              <!-- Tooltip -->
              <div
                class="pointer-events-none absolute -top-12 left-1/2 z-20
                  -translate-x-1/2 transform whitespace-nowrap rounded
                  bg-gray-900 px-2 py-1 text-xs text-white opacity-0
                  transition-opacity group-hover/tooltip:opacity-100
                  dark:bg-gray-700"
              >
                {member.first_name} • {getRoleBadge(member.role).label}
              </div>
            </div>
          {/each}
        </div>
        <span class="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Users class="mr-1 h-4 w-4" />
          {group.total_members} members
        </span>
        {#if group.total_pending_invitations > 0}
          <span
            class="flex items-center rounded-full bg-yellow-100 px-2
              py-0.5 text-sm font-medium text-yellow-800
              dark:bg-yellow-900/50 dark:text-yellow-300"
          >
            {group.total_pending_invitations} pending
          </span>
        {/if}
      </div>
  
      <!-- Goals Section -->
      <div class="mb-4 flex-grow overflow-hidden">
        <h4 class="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Group Goals
        </h4>
        {#if group.group_goals.length > 0}
          <div
            class="scrollbar-thin scrollbar-thumb-purple-200
              dark:scrollbar-thumb-purple-900 h-[120px] space-y-3
              overflow-y-auto pr-2"
          >
            {#each group.group_goals as goal}
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span
                    class="flex items-center text-sm font-medium
                      text-gray-700 dark:text-gray-300"
                  >
                    <Goal class="mr-1 h-4 w-4" />
                    {goal.goal_name}
                  </span>
                  <span class="text-sm text-gray-600 dark:text-gray-400">
                    {formatAmount(goal.current_amount)} / {formatAmount(goal.target_amount)}
                  </span>
                </div>
                <div class="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    class="h-2 rounded-full bg-purple-600 transition-all
                      duration-300 dark:bg-purple-400"
                    style="width: {calculateProgress(goal.current_amount, goal.target_amount)}%"
                  ></div>
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <div
            class="flex h-[120px] items-center justify-center rounded-lg
              bg-gray-50 dark:bg-gray-800/50"
          >
            <p class="text-sm text-gray-500 dark:text-gray-400">
              No goals set for this group
            </p>
          </div>
        {/if}
      </div>
  
      <!-- Stats -->
      <div class="space-y-2 border-t border-gray-200 pt-4 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <CreditCard class="mr-1 h-4 w-4" />
            {group.total_group_transactions} transactions
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Last active: {formatDate(group.group.last_activity_at)}
          </div>
        </div>
        {#if parseFloat(group.latest_transaction_amount) > 0}
          <div class="flex items-center text-sm text-green-600 dark:text-green-400">
            <Coins class="mr-1 h-4 w-4" />
            Latest contribution: {formatAmount(group.latest_transaction_amount)}
          </div>
        {/if}
      </div>
    </div>
  </div>