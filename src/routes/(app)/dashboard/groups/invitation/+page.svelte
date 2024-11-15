<script>
    import { toastManager } from '$lib/helpers/utilities.js';
    import { TOAST_TYPE_ERROR, TOAST_TYPE_SUCCESS } from '$lib/settings/constants.js';
    import { acceptInvite } from '$lib/dataservice/groups/groupsDataService';
    import { goto } from '$app/navigation';
    import { Users, UserPlus, UserMinus, Shield, BookOpen, MessageSquare } from 'lucide-svelte';

    let {data} = $props();
    $inspect(data);
    let groupID = $state(data.groupID ?? '');
    let inviteeEmail = $state(data.email ?? '');
    let isLoading = $state(false);

    async function acceptOrRejectInvite(status) {
        isLoading = true;
        try {
            let responseData = await acceptInvite(groupID, inviteeEmail, status);
            if(responseData.success) {
                toastManager(TOAST_TYPE_SUCCESS, responseData.data.message);
                goto(status === 'accepted' ? `/dashboard/groups/${groupID}`: '/dashboard/groups');
            } else {
                console.log(responseData.data);
                toastManager(TOAST_TYPE_ERROR, "An error occurred while processing your request");
            }
        } catch (error) {
            toastManager(TOAST_TYPE_ERROR, "An error occurred while processing your request");
        } finally {
            isLoading = false;
        }
    }

    function acceptInviteHandler() {
        acceptOrRejectInvite('accepted');
    }

    function declineInviteHandler() {
        acceptOrRejectInvite('declined');
    }
</script>

<div class="min-h-[80vh] flex items-center justify-center px-4 py-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
    <div class="w-full max-w-2xl transform transition-all duration-300 hover:scale-[1.01]">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <!-- Header Section -->
            <div class="p-8 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-center mb-6">
                    <div class="p-4 rounded-full bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900 dark:to-purple-800 shadow-lg transform transition-transform duration-300 hover:scale-110">
                        <Users class="w-14 h-14 text-purple-600 dark:text-purple-300" />
                    </div>
                </div>
                <h1 class="text-4xl font-bold text-center text-gray-800 dark:text-white mb-3 tracking-tight">
                    Group Invitation
                </h1>
                <p class="text-center text-gray-600 dark:text-gray-300 text-lg">
                    You've been invited to join a group
                </p>
                <div class="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-l-4 border-purple-400 dark:border-purple-500 backdrop-blur-sm">
                    <p class="text-sm text-center text-gray-600 dark:text-gray-300">
                        Group ID: <span class="font-mono font-medium bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">{groupID}</span>
                    </p>
                    <p class="text-sm text-center text-gray-600 dark:text-gray-300 mt-2">
                        Invited Email: <span class="font-medium bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">{inviteeEmail}</span>
                    </p>
                </div>
            </div>

            <!-- Group Guidelines Section -->
            <div class="p-8 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
                    <Shield class="w-6 h-6 mr-3 text-purple-500" />
                    Group Guidelines
                </h2>
                <ul class="space-y-4 text-base text-gray-600 dark:text-gray-300">
                    <li class="flex items-start transform transition-all duration-200 hover:translate-x-2">
                        <BookOpen class="w-5 h-5 mr-3 mt-1 text-purple-400" />
                        <span>Be respectful and professional in all group interactions</span>
                    </li>
                    <li class="flex items-start transform transition-all duration-200 hover:translate-x-2">
                        <MessageSquare class="w-5 h-5 mr-3 mt-1 text-purple-400" />
                        <span>Maintain confidentiality of group discussions and shared resources</span>
                    </li>
                    <li class="flex items-start transform transition-all duration-200 hover:translate-x-2">
                        <Users class="w-5 h-5 mr-3 mt-1 text-purple-400" />
                        <span>Actively participate and contribute to group activities</span>
                    </li>
                </ul>
            </div>

            <!-- Action Buttons -->
            <div class="p-8 flex flex-col sm:flex-row gap-4 justify-center bg-gray-50 dark:bg-gray-800">
                <button
                    onclick={acceptInviteHandler}
                    disabled={isLoading}
                    class="flex items-center justify-center px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-700 
                           text-white font-medium transition-all duration-300 disabled:opacity-50 
                           disabled:cursor-not-allowed min-w-[180px] hover:shadow-lg hover:shadow-purple-500/20
                           focus:ring-4 focus:ring-purple-500/20 focus:outline-none transform hover:-translate-y-0.5"
                >
                    {#if isLoading}
                        <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        Processing...
                    {:else}
                        <UserPlus class="w-5 h-5 mr-3" />
                        Accept Invitation
                    {/if}
                </button>

                <button
                    onclick={declineInviteHandler}
                    disabled={isLoading}
                    class="flex items-center justify-center px-8 py-4 rounded-xl bg-gray-200 hover:bg-gray-300 
                           dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 
                           font-medium transition-all duration-300 disabled:opacity-50 
                           disabled:cursor-not-allowed min-w-[180px] hover:shadow-lg
                           focus:ring-4 focus:ring-gray-500/20 focus:outline-none transform hover:-translate-y-0.5"
                >
                    {#if isLoading}
                        <div class="w-5 h-5 border-2 border-gray-500 dark:border-gray-300 border-t-transparent rounded-full animate-spin mr-3"></div>
                        Processing...
                    {:else}
                        <UserMinus class="w-5 h-5 mr-3" />
                        Decline
                    {/if}
                </button>
            </div>
        </div>
    </div>
</div>
