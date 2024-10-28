<script>
    import {
        TOAST_TYPE_ERROR,
        TOAST_TYPE_SUCCESS,
    } from '$lib/settings/constants.js';
    import { superForm } from 'sveltekit-superforms';
    import { zodClient } from 'sveltekit-superforms/adapters';
    import { investmentSchema } from '$lib/settings/schema.js';
    import * as Dialog from '$lib/components/ui/dialog';
    import { Input } from '$lib/components/ui/input';
    import CurrencyInput from '@canutin/svelte-currency-input';
    import { toastManager } from '$lib/helpers/utilities.js';
    import { Plus } from 'lucide-svelte';
    import * as Form from '$lib/components/ui/form';

    let { data, defaultCurrency } = $props();
    let isDrawerOpen = $state(false);
    const form = superForm(data.investmentForm, {
        validators: zodClient(investmentSchema),
        dataType: 'json',
        invalidateAll: true,
        onUpdated({ form }) {
            console.log(form);
            if (form.message && form.message.success) {
                toastManager(TOAST_TYPE_SUCCESS, form.message.message);
                isDrawerOpen = false;
            } else if (form.installmentMessage && !form.installmentMessage.success) {
                toastManager(TOAST_TYPE_ERROR, form.installmentMessage.message);
            }
        }
    });
    const { form: investmentForm, enhance: investmentEnhance, message: bondMessage, delayed } = form;

</script>

<!-- Floating Action Button -->
<button
    aria-label="Add Investment"
    class="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
    onclick={() => (isDrawerOpen = true)}
>
    <Plus class="h-5 w-5 sm:h-6 sm:w-6" />
    <span class="ml-2 hidden sm:inline-block text-xs sm:text-sm">Add Investment</span>
</button>

<!-- Drawer for the form -->
<Dialog.Root bind:open={isDrawerOpen}>
    <Dialog.Content class="sm:max-w-[600px] p-6">
        <Dialog.Header>
            <Dialog.Title>Add New Investment</Dialog.Title>
            <Dialog.Description>Fill in the details of the new investment and click save.</Dialog.Description>
        </Dialog.Header>
        <form method="POST" action="?/alternativeinvestment" use:investmentEnhance class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Required fields for all investments -->
                <Form.Field {form} name="investment_type">
                    <Form.Control let:attrs>
                        <Form.Label>Investment Type*</Form.Label>
                        <Input
                            {...attrs}
                            placeholder="Enter investment type"
                            bind:value={$investmentForm.investment_type}
                            class="block w-full rounded border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        />
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>

                <Form.Field {form} name="location">
                    <Form.Control let:attrs>
                        <Form.Label>Location*</Form.Label>
                        <Input
                            {...attrs}
                            placeholder="Enter investment location"
                            bind:value={$investmentForm.location}
                            class="block w-full rounded border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        />
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Field {form} name="acquired_at">
                    <Form.Control let:attrs>
                        <Form.Label>Acquired At*</Form.Label>
                        <Input
                            type="date"
                            {...attrs}
                            bind:value={$investmentForm.acquired_at}
                            class="block w-full rounded border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        />
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>

                <Form.Field {form} name="valuation">
                    <Form.Control let:attrs>
                        <Form.Label>Valuation*</Form.Label>
                        <CurrencyInput
                            {...attrs}
                            bind:value={$investmentForm.valuation}
                            locale="en-US"
                            currency={defaultCurrency}
                            placeholder="Enter current valuation"
                            class="block w-full rounded border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        />
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
            </div>

            <div class="flex items-center gap-2">
                <Form.Field {form} name="is_business">
                    <Form.Control let:attrs>
                        <div class="flex items-center gap-2">
                            <input
                                type="checkbox"
                                {...attrs}
                                bind:checked={$investmentForm.is_business}
                                class="h-4 w-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                            />
                            <Form.Label>Is Business Investment?</Form.Label>
                        </div>
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
            </div>

            {#if $investmentForm.is_business}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Field {form} name="investment_name">
                        <Form.Control let:attrs>
                            <Form.Label>Investment Name</Form.Label>
                            <Input
                                {...attrs}
                                placeholder="Enter investment name"
                                bind:value={$investmentForm.investment_name}
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
                                min="1"
                                placeholder="Enter quantity"
                                bind:value={$investmentForm.quantity}
                                class="block w-full rounded border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            />
                        </Form.Control>
                        <Form.FieldErrors />
                    </Form.Field>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Field {form} name="annual_revenue">
                        <Form.Control let:attrs>
                            <Form.Label>Annual Revenue</Form.Label>
                            <CurrencyInput
                                {...attrs}
                                bind:value={$investmentForm.annual_revenue}
                                locale="en-US"
                                currency={defaultCurrency}
                                placeholder="Enter annual revenue"
                                class="block w-full rounded border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            />
                        </Form.Control>
                        <Form.FieldErrors />
                    </Form.Field>

                    <Form.Field {form} name="profit_margin">
                        <Form.Control let:attrs>
                            <Form.Label>Profit Margin (%)</Form.Label>
                            <Input
                                type="number"
                                step="0.01"
                                {...attrs}
                                placeholder="Enter profit margin"
                                bind:value={$investmentForm.profit_margin}
                                class="block w-full rounded border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            />
                        </Form.Control>
                        <Form.FieldErrors />
                    </Form.Field>
                </div>
            {/if}

            <button
                type="submit"
                class="mt-6 flex w-full items-center justify-center rounded bg-blue-500 p-2 text-white shadow hover:bg-blue-700 disabled:bg-gray-400"
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
                    Submit Investment
                {/if}
            </button>
        </form>
    </Dialog.Content>
</Dialog.Root>