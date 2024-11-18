<script>
    import { TOAST_TYPE_ERROR, TOAST_TYPE_SUCCESS } from '$lib/settings/constants.js';
    import { toastManager } from '$lib/helpers/utilities.js';
    import AddGroupMember from '$lib/layouts/groups/addgroupmember.svelte';
    import { User, UserMinus, Shield, Crown, ArrowUp, ArrowDown, Users} from 'lucide-svelte';
    let {group = {}, inviteNewMembers, handleDemoteUser, handlePromoteUser, handleRemoveUser, formatDate, currentUser} = $props();
    $inspect(group);
    async function removeUser(userID){
        let response = await handleRemoveUser(group.Group.id, userID, true);
        if(response.success){
            toastManager(TOAST_TYPE_SUCCESS, response.value);
        } else {
            toastManager(TOAST_TYPE_ERROR, response.value);
        }
    }

</script>

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
                                    onclick={() => removeUser(member.user_id)}
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

<style>
    .group:hover {
      transform: translateY(-2px);
  }
</style>