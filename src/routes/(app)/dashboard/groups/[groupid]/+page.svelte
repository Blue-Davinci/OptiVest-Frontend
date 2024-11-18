<script>
	import DetailedTiles from '$lib/layouts/groups/tiles/detailedtiles.svelte';
	import HeroSection from '$lib/layouts/groups/detailed/herosection.svelte';
	import GroupMembers from '$lib/layouts/groups/detailed/groupmembers.svelte';
	import GroupGoals from '$lib/layouts/groups/detailed/groupgoals.svelte';
	import GroupExpenses from '$lib/layouts/groups/detailed/groupexpenses.svelte';
	import Chat from '$lib/layouts/groups/detailed/chat.svelte';
	import PendingInvites from '$lib/layouts/groups/detailed/pendinginvites.svelte';
	import GroupTransactions from '$lib/layouts/groups/detailed/grouptransactions.svelte';
	import { inviteMembers, deleteGroupMember } from '$lib/dataservice/groups/groupsDataService.js';

	let { data } = $props();
	let group = $derived(data?.data?.group ?? {});
	let groupTransactions = $derived(data?.groupTransactions?.transactions ?? {});
	let groupExpenses = $derived(data?.groupExpenses?.expenses ?? {});
	let userInformation = $derived(data?.userInformation ?? {});

	let currentUser = $derived(() => {
		if (!userInformation?.id || !group?.GroupMembers) {
			return null;
		}
		let matchedMember = group.GroupMembers.find(
			(member) => member.user_id === parseInt(userInformation.id)
		);
		return matchedMember ? matchedMember.role : 'regular';
	});

	$inspect(data, 'data');
	$inspect({ groupTransactions, groupExpenses });

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	const calculateProgress = (current, target) => {
		return Math.round((parseFloat(current) / parseFloat(target)) * 100);
	};

	function handleDemoteUser(userId) {
		console.log(`Demote user with ID: ${userId}`);
	}

	function handlePromoteUser(userId) {
		console.log(`Promote user with ID: ${userId}`);
	}

	async function handleRemoveUser(groupID, userID, is_admin) {
		try {
			// if is_admin = true, send a request to delete the user from the group including the groupID, userID, and true
			// otherwise, send a request to delete the user from the group including the groupID and is_admin=false
			let responseData
			if (is_admin) {
				responseData = await deleteGroupMember(groupID, userID, true);
			} else {
				responseData = await deleteGroupMember(groupID, 0, false);
			}
			if (responseData.success) {
				console.log('Response Data: ', responseData.data);
				data = {
					...data,
					data: {
						...data.data,
						group: {
							...data.data.group,
							GroupMembers: data.data.group.GroupMembers.filter(
								(member) => member.user_id !== userID
							)
						}
					}
				};
				return {
					success: true,
					value: 'group member removed successfully'
				};
			} else {
				if (typeof responseData.error === 'object') {
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

	function handleAddMember() {
		console.log('Add new member');
	}

	// inviteNewMembers allows an admin to invite a new user and updates the UI
	async function inviteNewMembers(groupID, inviteeEmail) {
		try {
			let responseData = await inviteMembers(groupID, inviteeEmail);
			if (responseData.success) {
				console.log('Response Data: ', responseData.data);
				data = {
					...data,
					data: {
						...data.data,
						group: {
							...data.data.group,
							PendingInvitations: [
								...data.data.group.PendingInvitations,
								responseData.data.group_invitation
							]
						}
					}
				};
				return {
					success: true,
					value: 'group invite successful'
				};
			} else {
				if (typeof responseData.error === 'object') {
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
	<HeroSection {group} {groupTransactions} {formatDate} {handleRemoveUser} />
	<!-- Stats Section - Moved below hero without overlap -->
	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Tiles -->
		<DetailedTiles {group} />
		<!-- Group Goals -->
		<GroupGoals {group} {formatDate} {calculateProgress} />

		<!-- Members Grid - Improved Layout -->
		<GroupMembers
			{group}
			{inviteNewMembers}
			{handleDemoteUser}
			{handlePromoteUser}
			{handleRemoveUser}
			{handleAddMember}
			{formatDate}
			{currentUser}
		/>
		<!-- Expenses Section -->
		<GroupExpenses {groupExpenses} {formatDate} />

		<!-- Transactions Section -->
		<GroupTransactions {groupTransactions} {formatDate} />

		<!-- Pending invites -->
		<PendingInvites {group} {formatDate} {currentUser} />
	</div>
</div>

<Chat />

<style></style>
