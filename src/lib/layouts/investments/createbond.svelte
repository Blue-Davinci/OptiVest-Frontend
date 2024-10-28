<script>
    import {
		TOAST_TYPE_ERROR,
		TOAST_TYPE_SUCCESS,
	} from '$lib/settings/constants.js';
    import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
    import {bondSchema} from '$lib/settings/schema.js';
    import * as Dialog from '$lib/components/ui/dialog';
    import { Input } from '$lib/components/ui/input';
    import CurrencyInput from '@canutin/svelte-currency-input';
    import { toastManager } from '$lib/helpers/utilities.js';
    import { Plus } from 'lucide-svelte';
    import * as Form from '$lib/components/ui/form';

    let { data, defaultCurrency } = $props();
    let isDrawerOpen = $state(false);
    $inspect(data.stockForm);
    const form = superForm(data.bondForm, {
		validators: zodClient(bondSchema),
		dataType: 'json',
        invalidateAll: true,
		onUpdated({ form }) {
            console.log(form);
			if (form.message && form.message.success) {
				toastManager(TOAST_TYPE_SUCCESS, form.message.message);
				//console.log('Bond created:', form.message.data);
				isDrawerOpen = false;
			}  else if (form.installmentMessage && !form.installmentMessage.success) {
				toastManager(TOAST_TYPE_ERROR, form.installmentMessage.message);
			}
		}
	});
	const { form: bondForm, enhance: bondEnhance, message: bondMessage, delayed } = form;

</script>

<!-- Floating Action Button -->
	<button
		aria-label="Add a stock"
		class="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
		onclick={() => (isDrawerOpen = true)}
	>
		<Plus class="h-5 w-5 sm:h-6 sm:w-6" />
		<span class="ml-2 hidden sm:inline-block text-xs sm:text-sm">Add Stock</span>
	</button>

<!-- Drawer for the form -->
<Dialog.Root bind:open={isDrawerOpen}>
	<Dialog.Content class="p-6">
		<Dialog.Header>
			<Dialog.Title>Add New Stock Investment</Dialog.Title>
			<Dialog.Description>Fill in the details of the new stock investment and click save.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/bondinvestment" use:bondEnhance>
			<Form.Field {form} name="bond_symbol">
				<Form.Control let:attrs>
					<Form.Label>Bond Symbol</Form.Label>
					<Input
						{...attrs}
						placeholder="Enter the stock symbol"
						bind:value={$bondForm.bond_symbol}
						class="block w-full rounded border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="quantity">
				<Form.Control let:attrs>
					<Form.Label>Quantity</Form.Label>
					<Input
						type="number"
						{...attrs}
						placeholder="Enter quantity"
						bind:value={$bondForm.quantity}
						class="block w-full rounded border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="purchase_price">
				<Form.Control let:attrs>
					<Form.Label>Purchase Price</Form.Label>
					<CurrencyInput
						{...attrs}
						bind:value={$bondForm.purchase_price}
						locale="en-US"
						currency={defaultCurrency}
						placeholder="Enter purchase price"
						class="block w-full rounded border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="current_value">
				<Form.Control let:attrs>
					<Form.Label>Current Value</Form.Label>
					<CurrencyInput
						{...attrs}
						bind:value={$bondForm.current_value}
						locale="en-US"
						currency={defaultCurrency}
						placeholder="Enter current value"
						class="block w-full rounded border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="coupon_rate">
				<Form.Control let:attrs>
					<Form.Label>Coupon Rate (%)</Form.Label>
					<Input
						type="number"
						step="0.01"
						{...attrs}
						placeholder="Enter coupon rate"
						bind:value={$bondForm.coupon_rate}
						class="block w-full rounded border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="maturity_date">
				<Form.Control let:attrs>
					<Form.Label>Maturity Date</Form.Label>
					<Input
						type="date"
						{...attrs}
						bind:value={$bondForm.maturity_date}
						class="block w-full rounded border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="purchase_date">
				<Form.Control let:attrs>
					<Form.Label>Purchase Date</Form.Label>
					<Input
						type="date"
						{...attrs}
						bind:value={$bondForm.purchase_date}
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
					Submit Stock Investment
				{/if}
			</button>
		</form>
	</Dialog.Content>
</Dialog.Root>