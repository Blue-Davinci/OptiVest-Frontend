<script>
	import { TOAST_TYPE_ERROR, TOAST_TYPE_SUCCESS } from '$lib/settings/constants.js';
	import { toastManager } from '$lib/helpers/utilities.js';
	import { profileSchema } from '$lib/settings/schema.js';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { onMount } from 'svelte';
	import { Settings, Edit } from 'lucide-svelte';
	import { fetchCountries } from '$lib/helpers/utilities.js';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';

	let { data, user, currencies } = $props();
	let countries = $state([]);
	let isLoading = $state(true);
	let user_country = $state(user.country_code);

	onMount(async () => {
		try {
			countries = await fetchCountries();
			// Ensure form values are set after countries are loaded
			if ($profileForm.country_code) {
				const selectedCountry = countries.find((c) => c.code === $profileForm.country_code);
				if (selectedCountry) {
					user_country = selectedCountry.code;
				}
			}

			// Set the initial currency value if not already set
			if (!$profileForm.currency_code && user.currency_code) {
				$profileForm.currency_code = user.currency_code;
			}
		} catch (error) {
			console.error('Error fetching countries:', error);
			toastManager(TOAST_TYPE_ERROR, 'Failed to load countries');
		} finally {
			isLoading = false;
		}
	});

	const form = superForm(data.profileForm, {
		validators: zodClient(profileSchema),
		dataType: 'json',
		invalidateAll: true,
		onUpdated({ form }) {
			console.log('Form updated:', form);
			if (form.message && form.message.success) {
				toastManager(TOAST_TYPE_SUCCESS, form.message.message);
				console.log('Profile updated:', form.message.data);
			} else if (form.message && !form.message.success) {
				Object.keys(form.message.message).forEach((key) => {
					toastManager(TOAST_TYPE_ERROR, form.message.message[key]);
				});
			}
		}
	});

	const {
		form: profileForm,
		enhance: profileEnhance,
		message: profileMessage,
		delayed: profileDelayed
	} = form;
</script>

<section class="mt-6 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
	<h2 class="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
		<Settings />
		Profile Settings
	</h2>
	<form method="POST" action="?/updateprofile" class="space-y-8" use:profileEnhance>
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
			<Form.Field {form} name="first_name">
				<Form.Control let:attrs>
					<Form.Label>First Name</Form.Label>
					<Input
						{...attrs}
						type="text"
						bind:value={$profileForm.first_name}
						class="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-purple-800"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="last_name">
				<Form.Control let:attrs>
					<Form.Label>Last Name</Form.Label>
					<Input
						{...attrs}
						type="text"
						bind:value={$profileForm.last_name}
						class="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-purple-800"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="phone_number">
				<Form.Control let:attrs>
					<Form.Label>Phone Number</Form.Label>
					<Input
						{...attrs}
						type="tel"
						bind:value={$profileForm.phone_number}
						class="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-purple-800"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="dob">
				<Form.Control let:attrs>
					<Form.Label>Date of Birth</Form.Label>
					<Input
						{...attrs}
						type="date"
						disabled
						value={user.dob?.split('T')[0]}
						class="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-purple-800"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="country_code">
				<Form.Control let:attrs>
					<Form.Label>Country</Form.Label>
					<select
						{...attrs}
						bind:value={$profileForm.country_code}
						disabled={isLoading}
						class="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-purple-800"
					>
						{#if isLoading}
							<option value="">Loading countries...</option>
						{:else}
							{#if user_country}
								<option value="" selected>
									{countries.find((c) => c.code === user_country)?.name || 'Select a country'}
								</option>
							{/if}
							{#each countries as country}
								<option value={country.code}>{country.name} ({country.code})</option>
							{/each}
						{/if}
					</select>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="currency_code">
				<Form.Control let:attrs>
					<Form.Label>Currency</Form.Label>
					<select
						{...attrs}
						bind:value={$profileForm.currency_code}
						class="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-purple-800"
					>
						{#each Object.keys(currencies) as currency}
							<option value={currency}>{currency}</option>
						{/each}
					</select>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="address" class="md:col-span-2">
				<Form.Control let:attrs>
					<Form.Label>Address</Form.Label>
					<Input
						{...attrs}
						type="text"
						bind:value={$profileForm.address}
						class="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-purple-800"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<div class="flex justify-end">
			<button
				type="submit"
				class="flex items-center gap-2 rounded-lg bg-purple-600 px-8 py-3 font-medium text-white transition-all hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-800"
				disabled={$profileDelayed || isLoading}
			>
				{#if $profileDelayed}
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
						/>
					</svg>
					Saving Changes...
				{:else}
					<Edit size={20} />
					Save Changes
				{/if}
			</button>
		</div>
	</form>
</section>
