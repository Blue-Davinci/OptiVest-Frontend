<script>
    import {Mail,Calendar,Bell,Trash2} from 'lucide-svelte';
    let {group, formatDate, currentUser} = $props();
</script>
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