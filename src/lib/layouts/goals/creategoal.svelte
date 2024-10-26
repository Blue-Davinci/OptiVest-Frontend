<script>
	import { TOAST_TYPE_ERROR, TOAST_TYPE_SUCCESS } from '$lib/settings/constants.js';
	import CurrencyInput from '@canutin/svelte-currency-input';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import { toastManager } from '$lib/helpers/utilities.js';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { goalSchema } from '$lib/settings/schema.js';
	import { Plus } from 'lucide-svelte';

	let isDrawerOpen = $state(false);
	let { data, defaultCurrency, budgetIDNames } = $props();

	const form = superForm(data.form, {
		validators: zodClient(goalSchema),
		dataType: 'json',
		invalidateAll: true,
		onUpdated({ form }) {
			if (form.message && form.message.success) {
				toastManager('success', form.message.message);
				isDrawerOpen = false;
			} else if (form.message && !form.message.success) {
				toastManager(TOAST_TYPE_ERROR, form.message.message);
			} else {
				console.log('An error happended', form);
			}
		}
	});
	const { form: formData, enhance, message, delayed } = form;
</script>

<div class="fab-container fixed bottom-8 right-8 z-[1]">
	<button
		aria-label="Add a goal"
		class="flex items-center justify-center rounded-full bg-blue-500 p-2 font-bold text-white shadow-lg transition-all duration-300 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:p-3"
		onclick={() => (isDrawerOpen = true)}
	>
		<Plus class="h-5 w-5 sm:h-6 sm:w-6" />
		<span class="ml-2 hidden text-xs sm:inline-block sm:text-sm">Add A Goal</span>
	</button>
</div>

<Dialog.Root bind:open={isDrawerOpen}>
	<Dialog.Content class="p-6">
		<Dialog.Header>
			<Dialog.Title>Add New Goal</Dialog.Title>
			<Dialog.Description>Fill in the details of the new goal and click save.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" use:enhance={enhance}>
			<Form.Field {form} name="budget_id">
				<Form.Control let:attrs>
				  <Form.Label>Budget</Form.Label>
				  <select
					id="budget_id"
					name="budget_id"
					bind:value={$formData.budget_id}  
					class="w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
					{...attrs}
				  >
					<option value="" disabled>Select a budget</option>
					{#each budgetIDNames as budget}
					  <option value={budget.id}>{budget.name}</option> <!-- Display name, but set value as ID -->
					{/each}
				  </select>
				</Form.Control>
				<Form.FieldErrors />
			  </Form.Field>

			<Form.Field {form} name="name">
				<Form.Control let:attrs>
					<Form.Label>Goal Name</Form.Label>
					<Input
						{...attrs}
						placeholder="Enter the name of the goal"
						bind:value={$formData.name}
						class="block w-full rounded border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="current_amount">
				<Form.Control let:attrs>
					<Form.Label>Current Amount</Form.Label>
					<CurrencyInput
						{...attrs}
						bind:value={$formData.current_amount}
						currency={defaultCurrency}
						placeholder="Enter amount"
						class="block w-full rounded border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="target_amount">
				<Form.Control let:attrs>
					<Form.Label>Target Amount</Form.Label>
					<CurrencyInput
						{...attrs}
						bind:value={$formData.target_amount}
						currency={defaultCurrency}
						placeholder="Enter amount"
						class="block w-full rounded border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="monthly_contribution">
				<Form.Control let:attrs>
					<Form.Label>Monthly Contribution</Form.Label>
					<CurrencyInput
						{...attrs}
						bind:value={$formData.monthly_contribution}
						currency={defaultCurrency}
						placeholder="Enter amount"
						class="block w-full rounded border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="start_date">
				<Form.Control let:attrs>
					<Form.Label>Start Date</Form.Label>
					<Input
						{...attrs}
						type="date"
						bind:value={$formData.start_date}
						placeholder="Select start date"
						class="block w-full rounded border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="end_date">
				<Form.Control let:attrs>
					<Form.Label>End Date</Form.Label>
					<Input
						{...attrs}
						type="date"
						bind:value={$formData.end_date}
						placeholder="Select end date"
						class="block w-full rounded border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="status">
				<Form.Control let:attrs>
					<Form.Label>Status</Form.Label>
					<Input
						{...attrs}
						disabled
						bind:value={$formData.status}
						class="block w-full rounded border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<button
				type="submit"
				class="mt-4 flex w-full items-center justify-center rounded bg-blue-500 p-2 text-white shadow hover:bg-blue-700 disabled:bg-gray-400"
				disabled={$delayed}
			>
				{#if $delayed}
					<svg
						width="20"
						height="20"
						fill="currentColor"
						class="mr-2 animate-spin"
						viewBox="0 0 1792 1792"
					>
						<path
							d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z"
						></path>
					</svg>
					Submitting...
				{:else}
					Submit Goal
				{/if}
			</button>
		</form>
	</Dialog.Content>
</Dialog.Root>
