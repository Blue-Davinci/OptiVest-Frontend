<script>
	import { TOAST_TYPE_ERROR, TOAST_TYPE_SUCCESS } from '$lib/settings/constants.js';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Input } from '$lib/components/ui/input';
	import CurrencyInput from '@canutin/svelte-currency-input';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Form from '$lib/components/ui/form';
	import { toastManager } from '$lib/helpers/utilities.js';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { budgetSchema } from '$lib/settings/schema.js';
	import { Plus } from 'lucide-svelte';

	let isDrawerOpen = $state(false);
	let { data, defaultCurrency, currencies, budgetCategories } = $props();

	const form = superForm(data.form, {
		validators: zodClient(budgetSchema),
		dataType: 'json',
        invalidateAll: true,
		onUpdated({ form }) {
			if (form.message.status === 'success') {
				toastManager(TOAST_TYPE_SUCCESS, form.message.message);
				console.log('Budget created:', form.message.data);
                //submitSuccess();
				// close the dialog
				isDrawerOpen = false;
			} else {
				toastManager(TOAST_TYPE_ERROR, form.message.message);
			}
		}
	});
	//$inspect(currencies);
	const { form: formData, enhance, message, delayed } = form;
</script>

<!-- FAB (Floating Action Button) -->
<div class="fab-container fixed bottom-8 right-8 z-[1]">
	<button
		aria-label="Add your feed"
		class="flex items-center rounded-full bg-blue-500 px-4 py-2 font-bold text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
		onclick={() => (isDrawerOpen = true)}
	>
		<Plus class="h-8 w-8" />
		<span class="ml-2">Add A Budget</span>
	</button>
</div>

<!-- Drawer for the form -->
<Dialog.Root bind:open={isDrawerOpen}>
	<Dialog.Content class="p-6">
		<Dialog.Header>
			<Dialog.Title>Add New Budget</Dialog.Title>
			<Dialog.Description>Fill in the details of the new budget and click save.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" use:enhance={enhance}>
			<Form.Field {form} name="name">
				<Form.Control let:attrs>
					<Form.Label>Budget Name</Form.Label>
					<Input
						{...attrs}
						placeholder="Enter the name of the budget"
						bind:value={$formData.name}
						class="block w-full rounded border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="category">
				<Form.Control let:attrs>
					<Form.Label>Category</Form.Label>

					<!-- Input with a datalist for predefined categories -->
					<Input
						list="budget-categories"
						{...attrs}
						placeholder="Enter or select a category"
						bind:value={$formData.category}
						class="block w-full rounded border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
					/>

					<!-- Datalist for predefined options -->
					<datalist id="budget-categories">
						{#each budgetCategories as { id, category }}
							<option value={category}></option>
						{/each}
					</datalist>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<!-- Updated Currency Combobox Field -->
			<Form.Field {form} name="currency_code">
				<Form.Control let:attrs>
					<Form.Label>Currency Code</Form.Label>
					<select
						{...attrs}
						bind:value={$formData.currency_code}
						class="block w-full rounded border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
					>
						<!-- Default Option with defaultCurrency value -->
						<option value={defaultCurrency}>{defaultCurrency}</option>

						<!-- Dynamically create options for each currency in the currencies object -->
						{#each Object.keys(currencies) as currencyCode}
							<option value={currencyCode}>{currencyCode}</option>
						{/each}
					</select>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="total_amount">
				<Form.Control let:attrs>
					<Form.Label>Total Amount</Form.Label>
					<CurrencyInput
						{...attrs}
						bind:value={$formData.total_amount}
						locale="en-US"
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
					<Textarea
						{...attrs}
						placeholder="Tell us a little bit about the budget"
						bind:value={$formData.description}
						class="block w-full rounded border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<!-- New is_strict checkbox field -->
			<Form.Field
				{form}
				name="is_strict"
				class="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
			>
				<Form.Control let:attrs>
					<Checkbox {...attrs} bind:checked={$formData.is_strict} />
					<div class="space-y-1 leading-none">
						<Form.Label>Set this budget as strict</Form.Label>
						<Form.Description>
							<p class="mb-2">
								<b>Strict budgets</b> do not allow you to exceed the total amounts/overspend.
							</p>
							<p>
								Leaving this <b>unchecked</b> means you can overspend on the budget.
							</p>
						</Form.Description>
					</div>
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
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z"
						>
						</path>
					</svg>
					Submitting...
				{:else}
					Submit Budget
				{/if}
			</button>
		</form>
	</Dialog.Content>
</Dialog.Root>
