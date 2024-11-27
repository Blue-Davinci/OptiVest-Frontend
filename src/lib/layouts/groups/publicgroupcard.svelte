<script>
    import { formatDistanceToNow } from 'date-fns';
    import {
        Users2,
        Receipt,
        Target,
        Activity,
        PlusCircle
    } from 'lucide-svelte';
    import * as AlertDialog from '$lib/components/ui/alert-dialog';

    export let group;
    export let onJoinGroup;

    function formatDate(dateString) {
        return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    }

    const { enriched_group, is_user_a_member } = group;
    const { group: groupData, group_members, group_goals, total_members, total_group_transactions } = enriched_group;
</script>

<div class="overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:bg-gray-800">
    <!-- Group Image -->
    <div class="relative h-48 w-full">
        <img
            src={groupData.group_image_url}
            alt={groupData.name}
            class="h-full w-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <h3 class="absolute bottom-4 left-4 text-xl font-semibold text-white">
            {groupData.name}
        </h3>
    </div>

    <!-- Group Content -->
    <div class="p-6">
        <!-- Description -->
        <p class="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
            {groupData.description}
        </p>

        <!-- Stats Grid -->
        <div class="mb-4 grid grid-cols-3 gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
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
            <span>Last active {formatDate(groupData.last_activity_at)}</span>
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
                        style="width: {(group_goals[0].current_amount / group_goals[0].target_amount) * 100}%"
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
                            class="flex w-full transform items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:translate-y-[-2px] hover:from-purple-700 hover:to-purple-800 hover:shadow-purple-500/25"
                        >
                            <PlusCircle class="h-5 w-5" />
                            Join Group
                        </button>
                    </AlertDialog.Trigger>
                    <AlertDialog.Content class="sm:max-w-[425px]">
                        <AlertDialog.Header>
                            <AlertDialog.Title class="text-xl font-semibold leading-none tracking-tight">
                                Join Group
                            </AlertDialog.Title>
                            <AlertDialog.Description class="mt-3 text-[15px] leading-normal text-muted-foreground">
                                Are you sure you want to join this group?
                            </AlertDialog.Description>
                        </AlertDialog.Header>
                        <AlertDialog.Footer class="mt-6 flex gap-3">
                            <AlertDialog.Cancel class="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                Cancel
                            </AlertDialog.Cancel>
                            <AlertDialog.Action
                                on:click={() => onJoinGroup(groupData.id)}
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