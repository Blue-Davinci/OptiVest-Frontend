<script>
	import { TOAST_TYPE_ERROR, TOAST_TYPE_SUCCESS } from '$lib/settings/constants.js';
	import CurrencyInput from '@canutin/svelte-currency-input';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import { toastManager } from '$lib/helpers/utilities.js';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { expenseSchema } from '$lib/settings/schema.js';
	import { Plus } from 'lucide-svelte';

	let isDrawerOpen = $state(false);
	let { data, defaultCurrency, budgetIDNames } = $props();

	const form = superForm(data.expenseForm, {
		validators: zodClient(expenseSchema),
		dataType: 'json',
		invalidateAll: true,
		onUpdated({ form }) {
			if (form.message && form.message.success) {
				toastManager(TOAST_TYPE_SUCCESS, form.message.message);
				isDrawerOpen = false;
			} else if (form.message && !form.message.success) {
				toastManager(TOAST_TYPE_ERROR, form.message.message);
			} else {
				console.log('An error happened', form);
			}
		}
	});
	const { form: expenseForm, enhance: expenceEnhance, message: expenseMessage, delayed: expenseDelayed } = form;
</script>

	<button
		aria-label="Add expense"
        class="inline-flex items-center justify-center rounded-lg bg-purple-600 px-4 py-2.5 text-sm
        font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none
        focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-700
        dark:hover:bg-purple-600"
		onclick={() => (isDrawerOpen = true)}
	>
		<Plus class="h-5 w-5 sm:h-6 sm:w-6" />
		<span class="ml-2 hidden text-xs sm:inline-block sm:text-sm">Add Expense</span>
	</button>


<Dialog.Root bind:open={isDrawerOpen}>
	<Dialog.Content class="p-6">
		<Dialog.Header>
			<Dialog.Title>Add New Recurring Expense</Dialog.Title>
			<Dialog.Description>Fill in the details of the recurring expense and click save.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/expenses" use:expenceEnhance>
			<Form.Field {form} name="budget_id">
				<Form.Control let:attrs>
					<Form.Label>Budget</Form.Label>
					<select
						id="budget_id"
						name="budget_id"
						bind:value={$expenseForm.budget_id}
						class="w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
						{...attrs}
					>
						<option value="" disabled>Select a budget</option>
						{#each budgetIDNames as budget}
							<option value={budget.id}>{budget.name}</option>
						{/each}
					</select>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="name">
				<Form.Control let:attrs>
					<Form.Label>Expense Name</Form.Label>
					<Input
						{...attrs}
						placeholder="Enter the name of the expense"
						bind:value={$expenseForm.name}
						class="block w-full rounded border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

            <Form.Field {form} name="category">
				<Form.Control let:attrs>
					<Form.Label>Category Name</Form.Label>
					<Input
						{...attrs}
						placeholder="Enter the name of the expense"
						bind:value={$expenseForm.category}
						class="block w-full rounded border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="amount">
				<Form.Control let:attrs>
					<Form.Label>Amount</Form.Label>
					<CurrencyInput
						{...attrs}
						bind:value={$expenseForm.amount}
						currency={defaultCurrency}
						placeholder="Enter amount"
						class="block w-full rounded border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="description">
				<Form.Control let:attrs>
					<Form.Label>Description</Form.Label>
					<Input
						{...attrs}
						placeholder="Enter a description"
						bind:value={$expenseForm.description}
						class="block w-full rounded border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="date_occurred">
				<Form.Control let:attrs>
					<Form.Label>Due Date</Form.Label>
					<Input
						type="datetime-local"
						{...attrs}
						bind:value={$expenseForm.due_date}
						class="block w-full rounded border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<button
				type="submit"
				class="mt-4 flex w-full items-center justify-center rounded bg-blue-500 p-2 text-white shadow hover:bg-blue-700 disabled:bg-gray-400"
				disabled={$expenseDelayed}
			>
				{#if $expenseDelayed}
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
					Submit Expense
				{/if}
			</button>
		</form>
	</Dialog.Content>
</Dialog.Root>
