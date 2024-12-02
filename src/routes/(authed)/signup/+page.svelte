<script>
	import * as Form from '$lib/components/ui/form';
	import { toastManager } from '$lib/helpers/utilities.js';
	import {
		TOAST_TYPE_ERROR,
		TOAST_TYPE_SUCCESS,
		TOAST_TYPE_LOADING
	} from '$lib/settings/constants.js';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { signUpFormSchema } from '$lib/settings/schema.js';
	import { goto } from '$app/navigation';
	import { Input } from '$lib/components/ui/input';
	import { fly, fade } from 'svelte/transition';

	let { data } = $props();
	const form = superForm(data.form, {
		validators: zodClient(signUpFormSchema),
		dataType: 'json',
		onUpdated({ form }) {
			if (form.message) {
				if (form.message.status === 'success') {
					toastManager(TOAST_TYPE_SUCCESS, form.message.message);
					goto('/login');
				} else {
					toastManager(TOAST_TYPE_ERROR, form.message.message);
				}
			}
		}
	});
	const { form: formData, enhance, delayed } = form;

	function handleBack() {
		goto('/');
	}
</script>

<div
	class="flex min-h-screen w-full flex-col md:flex-row"
	transition:fly|global={{ y: -200, duration: 300 }}
>
	<!-- Image Panel Section -->
	<div class="relative hidden md:block md:w-1/2">
		<div class="absolute inset-0">
			<img
				src="https://images.unsplash.com/photo-1728044849325-47f4f5a21da3?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
				alt="Signup Preview"
				class="h-full w-full object-cover"
			/>
			<div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-6 text-white">
				<h3 class="mb-2 text-xl font-bold">Join Optivest Today</h3>
				<p class="text-sm">Get full access to all financial management features by signing up.</p>
			</div>
		</div>
	</div>

	<!-- Signup Form Section -->
	<div class="flex w-full flex-col justify-between p-8 md:w-1/2" in:fade={{ duration: 300 }}>
		<button
			onclick={handleBack}
			class="ml-auto self-start text-teal-500 hover:text-teal-600 dark:text-teal-400"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="mr-1 inline-block h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 19l-7-7m0 0l7-7m-7 7h18"
				/>
			</svg>
			Back
		</button>

		<div class="mx-auto flex w-full max-w-md flex-grow flex-col justify-center">
			<!-- Card Container -->
			<div class="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
				<div class="mb-6 text-center">
					<img
						src="/optivest-high-resolution-logo-transparent.png"
						alt="Optivest Logo"
						class="mx-auto h-16 w-auto"
					/>
				</div>

				<h2 class="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-gray-100">
					Sign up for your Optivest account
				</h2>

				<!-- Signup Form -->
				<form method="POST" use:enhance>
					<!-- First Name -->
					<Form.Field {form} name="first_name">
						<Form.Control let:attrs>
							<Form.Label>First Name</Form.Label>
							<Input {...attrs} bind:value={$formData.first_name} placeholder="John" />
						</Form.Control>
						<Form.FieldErrors class="text-red-600 dark:text-red-500 text-sm mt-1" />
					</Form.Field>

					<!-- Last Name -->
					<Form.Field {form} name="last_name">
						<Form.Control let:attrs>
							<Form.Label>Last Name</Form.Label>
							<Input {...attrs} bind:value={$formData.last_name} placeholder="Doe" />
						</Form.Control>
						<Form.FieldErrors class="text-red-600 dark:text-red-500 text-sm mt-1" />
					</Form.Field>

					<!-- Email -->
					<Form.Field {form} name="email">
						<Form.Control let:attrs>
							<Form.Label>Email</Form.Label>
							<Input {...attrs} bind:value={$formData.email} placeholder="yourname@example.com" />
						</Form.Control>
						<Form.FieldErrors class="text-red-600 dark:text-red-500 text-sm mt-1" />
					</Form.Field>

					<!-- Phone Number -->
					<Form.Field {form} name="phone_number">
						<Form.Control let:attrs>
							<Form.Label>Phone Number</Form.Label>
							<Input {...attrs} bind:value={$formData.phone_number} placeholder="+1234567890" />
						</Form.Control>
						<Form.FieldErrors class="text-red-600 dark:text-red-500 text-sm mt-1" />
					</Form.Field>

					<!-- Password -->
					<Form.Field {form} name="password">
						<Form.Control let:attrs>
							<Form.Label>Password</Form.Label>
							<Input {...attrs} type="password" bind:value={$formData.password} />
						</Form.Control>
						<Form.FieldErrors class="text-red-600 dark:text-red-500 text-sm mt-1" />
					</Form.Field>
					
					<!-- Confirm Password -->
					<Form.Field {form} name="confirm_password">
						<Form.Control let:attrs>
							<Form.Label>Confirm Password</Form.Label>
							<Input {...attrs} type="password" bind:value={$formData.confirm_password} />
						</Form.Control>
						<Form.FieldErrors class="text-red-600 dark:text-red-500 text-sm mt-1" />
					</Form.Field>

					<Form.Field
						{form}
						name="terms_accepted"
						class="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mb-2 mt-2"
					>
						<Form.Control let:attrs>
							<Checkbox {...attrs} bind:checked={$formData.terms_accepted} />
							<div class="space-y-1 leading-none">
								<Form.Label>Accept Terms and Conditions</Form.Label>
								<Form.Description>
									I agree to Optivest's <a href="/sitedocs/terms" class="text-teal-500 hover:text-teal-600">Terms and Conditions</a> and 
									<a href="/sitedocs/privacy" class="text-teal-500 hover:text-teal-600">Privacy Policy</a>
								</Form.Description>
							</div>
							<input name={attrs.name} value={$formData.terms_accepted} hidden />
						</Form.Control>
					</Form.Field>

					{#if $delayed}
						{toastManager(TOAST_TYPE_LOADING, 'Creating your account...')}
					{/if}

					<Form.Button type="submit" class="w-full" disabled={$delayed}>Sign Up</Form.Button>
				</form>

				<p class="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
					Already have an account? <a
						href="/login"
						class="font-medium text-teal-500 hover:text-teal-600 dark:text-teal-400">Login here</a
					>
				</p>
			</div>
		</div>

		<footer class="mt-8 text-center text-sm text-gray-500 dark:text-gray-300">
			<p>&copy; 2024 Optivest. All rights reserved.</p>
			<div class="mt-2">
				<a href="/sitedocs/terms" class="text-teal-500 hover:text-teal-600 dark:text-teal-400"
					>Terms & Conditions</a
				>
				<span class="mx-2">|</span>
				<a href="/sitedocs/privacy" class="text-teal-500 hover:text-teal-600 dark:text-teal-400"
					>Privacy Policy</a
				>
			</div>
		</footer>
	</div>
</div>