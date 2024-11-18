<script>
	import { TOAST_TYPE_ERROR, TOAST_TYPE_SUCCESS } from '$lib/settings/constants.js';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { toastManager } from '$lib/helpers/utilities.js';
	import { UserPlus } from 'lucide-svelte';

	let { groupID=0, inviteNewMembers } = $props();
	//$inspect(groupID);
	let isDrawerOpen = $state(false);
	let isLoading = $state(false);
	let inviteeEmail = $state('');


	async function addMember() {
		isLoading = true;
		try {
			let responseData = await inviteNewMembers(groupID, inviteeEmail);
                console.log('Response Data: ', responseData );
			if (responseData.success) {
				toastManager(TOAST_TYPE_SUCCESS, responseData.value);
				isDrawerOpen = false; // Close the dialog
			} else {
				toastManager(TOAST_TYPE_ERROR, responseData.value);
			}
		} catch (err) {
			toastManager(TOAST_TYPE_ERROR, 'An error occurred while adding member');
			console.log('An error: ', err);
		} finally {
			isLoading = false;
		}
	}
</script>

<button
	onclick={() => {
		isDrawerOpen = true;
	}}
	class="group relative inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700 transition-all duration-200 hover:bg-purple-200 hover:shadow-lg dark:bg-purple-500/20 dark:text-purple-200 dark:hover:bg-purple-500/30"
>
	<UserPlus class="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
	Add Member
	<div
		class="absolute -inset-0.5 -z-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 opacity-0 blur transition duration-200 group-hover:opacity-15 dark:from-purple-400 dark:to-purple-300"
	></div>
</button>

<Dialog.Root bind:open={isDrawerOpen}>
	<Dialog.Content class="p-6">
		<Dialog.Header>
			<Dialog.Title>Add Member</Dialog.Title>
			<Dialog.Description>Input the user's email to proceed with the invite.</Dialog.Description>
		</Dialog.Header>
		<Input
			class="block w-full rounded border-gray-300 p-2 shadow-sm"
			bind:value={inviteeEmail}
			label="User Email"
			placeholder="Add the user's email..."
		/>
		<Dialog.Footer>
			<button
				class="mt-4 flex w-full items-center justify-center rounded bg-blue-500 p-2 text-white shadow hover:bg-blue-700 disabled:bg-gray-400"
				disabled={isLoading}
				onclick={addMember}
			>
				{#if isLoading}
					<svg
						width="20"
						height="20"
						fill="currentColor"
						class="mr-2 animate-spin"
						viewBox="0 0 1792 1792"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z"
						>
						</path>
					</svg>
					Sending Invitation...
				{:else}
					Send Invitation
				{/if}
			</button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
