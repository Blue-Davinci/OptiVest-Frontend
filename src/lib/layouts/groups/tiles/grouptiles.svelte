<script>
import { Users, Target, Activity, CreditCard } from 'lucide-svelte';

let { groups = [] } = $props();

// Calculate statistics
let totalMembers = $derived(
  groups.reduce((sum, g) => sum + (g.total_members || 0), 0)
);

let averageCapacityUsage = $derived(
  groups.length ? 
    Math.round((totalMembers / groups.reduce((sum, g) => sum + (g.group.max_member_count || 0), 0)) * 100) : 
    0
);

let totalGoals = $derived(
  groups.reduce((sum, g) => sum + (g.group_goals?.length || 0), 0)
);

let goalsProgress = $derived(
  groups.reduce((sum, g) => {
    const groupGoals = g.group_goals || [];
    return sum + groupGoals.reduce((goalSum, goal) => 
      goalSum + ((goal.current_amount / goal.target_amount) * 100), 0);
  }, 0) / Math.max(totalGoals, 1)
);

let totalActivities = $derived(
  groups.reduce((sum, g) => sum + (g.group.activity_count || 0), 0)
);

let totalTransactions = $derived(
  groups.reduce((sum, g) => sum + parseInt(g.total_group_transactions || 0), 0)
);
</script>

<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <!-- Members Stats -->
  <div class="group relative rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm transition-all duration-300 ease-in-out hover:scale-[1.02] hover:border-gray-300 hover:shadow-lg dark:border-gray-700 dark:from-gray-800 dark:to-gray-900 dark:hover:border-gray-600">
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Total Members</p>
        <p class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{totalMembers}</p>
      </div>
      <div class="rounded-full bg-blue-100 p-3.5 transition-colors duration-200 group-hover:bg-blue-200 dark:bg-blue-900/30 dark:group-hover:bg-blue-900/50">
        <Users class="h-7 w-7 text-blue-600 dark:text-blue-300" />
      </div>
    </div>
    <p class="mt-3 text-sm font-medium text-gray-600 dark:text-gray-400">
      {averageCapacityUsage}% capacity usage
    </p>
  </div>

  <!-- Goals Stats -->
  <div class="group relative rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm transition-all duration-300 ease-in-out hover:scale-[1.02] hover:border-gray-300 hover:shadow-lg dark:border-gray-700 dark:from-gray-800 dark:to-gray-900 dark:hover:border-gray-600">
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Active Goals</p>
        <p class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{totalGoals}</p>
      </div>
      <div class="rounded-full bg-green-100 p-3.5 transition-colors duration-200 group-hover:bg-green-200 dark:bg-green-900/30 dark:group-hover:bg-green-900/50">
        <Target class="h-7 w-7 text-green-600 dark:text-green-300" />
      </div>
    </div>
    <p class="mt-3 text-sm font-medium text-gray-600 dark:text-gray-400">
      {Math.round(goalsProgress)}% avg. progress
    </p>
  </div>

  <!-- Activity Stats -->
  <div class="group relative rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm transition-all duration-300 ease-in-out hover:scale-[1.02] hover:border-gray-300 hover:shadow-lg dark:border-gray-700 dark:from-gray-800 dark:to-gray-900 dark:hover:border-gray-600">
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Total Activities</p>
        <p class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{totalActivities}</p>
      </div>
      <div class="rounded-full bg-purple-100 p-3.5 transition-colors duration-200 group-hover:bg-purple-200 dark:bg-purple-900/30 dark:group-hover:bg-purple-900/50">
        <Activity class="h-7 w-7 text-purple-600 dark:text-purple-300" />
      </div>
    </div>
    <p class="mt-3 text-sm font-medium text-gray-600 dark:text-gray-400">
      {Math.round(totalActivities / Math.max(groups.length, 1))} per group
    </p>
  </div>

  <!-- Transaction Stats -->
  <div class="group relative rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm transition-all duration-300 ease-in-out hover:scale-[1.02] hover:border-gray-300 hover:shadow-lg dark:border-gray-700 dark:from-gray-800 dark:to-gray-900 dark:hover:border-gray-600">
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Transactions</p>
        <p class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{totalTransactions}</p>
      </div>
      <div class="rounded-full bg-orange-100 p-3.5 transition-colors duration-200 group-hover:bg-orange-200 dark:bg-orange-900/30 dark:group-hover:bg-orange-900/50">
        <CreditCard class="h-7 w-7 text-orange-600 dark:text-orange-300" />
      </div>
    </div>
    <p class="mt-3 text-sm font-medium text-gray-600 dark:text-gray-400">
      {Math.round(totalTransactions / Math.max(groups.length, 1))} per group
    </p>
  </div>
</div>