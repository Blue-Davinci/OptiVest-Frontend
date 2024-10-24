<script>
    import {
		TOAST_TYPE_ERROR,
		TOAST_TYPE_SUCCESS,
		TOAST_TYPE_LOADING,
	} from '$lib/settings/constants.js';
    import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
    import {debtSchema} from '$lib/settings/schema.js';
    import * as Dialog from '$lib/components/ui/dialog';
    import { Input } from '$lib/components/ui/input';
    import CurrencyInput from '@canutin/svelte-currency-input';
	import { Textarea } from '$lib/components/ui/textarea';
    import { toastManager } from '$lib/helpers/utilities.js';
    import { Plus } from 'lucide-svelte';
    import * as Form from '$lib/components/ui/form';

    let { data, defaultCurrency } = $props();
    let isDrawerOpen = $state(false);
    $inspect(data);
    const form = superForm(data.debtForm, {
		validators: zodClient(debtSchema),
		dataType: 'json',
        invalidateAll: true,
		onUpdated({ form }) {
            console.log(form);
			if (form.message && form.message.success) {
				toastManager(TOAST_TYPE_SUCCESS, form.message.message);
				console.log('Debt created:', form.message.data);
				isDrawerOpen = false;
			} else {
				toastManager(TOAST_TYPE_ERROR, form.message ? form.message.message : 'Unknown error');
			}
		}
	});
	const { form: formData, enhance, message, delayed } = form;

      // Helper function to add seconds and timezone offset
  function formatDateWithSecondsAndTimezone(value) {
    if (value && value.length === 16) {
      // Add ':00' for seconds and 'Z' for UTC (or modify for other timezones)
      return value + ":00Z"; // Adjust 'Z' if you need a specific timezone offset
    }
    return value;
  }

  // Handle input change and format the value
  function handleDateChange(event) {
    formData.due_date = formatDateWithSecondsAndTimezone(event.target.value);
  }
</script>

<!-- Floating Action Button -->
<div class="fab-container fixed bottom-8 right-8 z-[1]">
	<button
		aria-label="Add a debt"
		class="flex items-center justify-center rounded-full bg-blue-500 p-2 font-bold text-white shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 sm:p-3"
		onclick={() => (isDrawerOpen = true)}
	>
		<Plus class="h-5 w-5 sm:h-6 sm:w-6" />
		<span class="ml-2 hidden sm:inline-block text-xs sm:text-sm">Add A Debt</span>
	</button>
</div>

<!-- Drawer for the form -->
<Dialog.Root bind:open={isDrawerOpen}>
	<Dialog.Content class="p-6">
		<Dialog.Header>
			<Dialog.Title>Add New Debt</Dialog.Title>
			<Dialog.Description>Fill in the details of the new debt and click save.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/newdebt" use:enhance>
			<Form.Field {form} name="name">
				<Form.Control let:attrs>
					<Form.Label>Debt Name</Form.Label>
					<Input
						{...attrs}
						placeholder="Enter the name of the debt"
						bind:value={$formData.name}
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
						bind:value={$formData.amount}
						locale="en-US"
						currency={defaultCurrency}
						placeholder="Enter amount"
						class="block w-full rounded border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="interest_rate">
				<Form.Control let:attrs>
					<Form.Label>Interest Rate (%)</Form.Label>
					<Input
						type="number"
						step="0.01"
						{...attrs}
						placeholder="Enter the interest rate"
						bind:value={$formData.interest_rate}
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
						placeholder="Enter a description for the debt"
						bind:value={$formData.description}
						class="block w-full rounded border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="due_date">
				<Form.Control let:attrs>
					<Form.Label>Due Date</Form.Label>
					<Input
						type="datetime-local"
						{...attrs}
						bind:value={$formData.due_date}
                        on:input={handleDateChange}
						class="block w-full rounded border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="minimum_payment">
				<Form.Control let:attrs>
					<Form.Label>Minimum Payment</Form.Label>
					<CurrencyInput
						{...attrs}
						bind:value={$formData.minimum_payment}
						locale="en-US"
						currency={defaultCurrency}
						placeholder="Enter the minimum payment amount"
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
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z"
						>
						</path>
					</svg>
					Submitting...
				{:else}
					Submit Debt
				{/if}
			</button>
		</form>
	</Dialog.Content>
</Dialog.Root>
