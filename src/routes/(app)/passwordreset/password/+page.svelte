<script>
	import * as Form from '$lib/components/ui/form';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { passworSchema } from '$lib/settings/schema.js';
	import { Input } from '$lib/components/ui/input';
	import { toastManager } from '$lib/helpers/utilities.js';
	import {
		TOAST_TYPE_ERROR,
		TOAST_TYPE_SUCCESS,
		TOAST_TYPE_LOADING
	} from '$lib/settings/constants.js';
	import { goto } from '$app/navigation';
	import { fly, fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	let { data } = $props();
	let token = $state(data.token);

	const form = superForm(data.form, {
		validators: zodClient(passworSchema),
		dataType: 'json',
		onSubmit: ({ formData, jsonData }) => {
			// Convert formData to an object and add the token
			const updatedData = { ...Object.fromEntries(formData), token: token };
			// Set data to be posted
			jsonData(updatedData);
		},
		onUpdated({ form }) {
			if (form.message) {
				if (form.message.status === 'success') {
					toastManager(TOAST_TYPE_SUCCESS, form.message.message);
					goto('/login');
				} else {
					toastManager(TOAST_TYPE_ERROR, form.message.message);
					// ToDo: redirect on error.
				}
			}
		}
	});

	const { form: formData, enhance, delayed, taintedFields } = form;

	function handleBack() {
		goto('/');
	}
</script>

<div class="mt-3 flex h-screen w-full" transition:fly|global={{ y: -200, duration: 300 }}>
	<!-- Image Panel Section -->
	<div class="relative hidden w-1/2 md:block">
		<img
			src="https://img.freepik.com/free-vector/my-password-concept-illustration_114360-3864.jpg?t=st=1729104592~exp=1729108192~hmac=42a31844a0ca320be5df4a36cef523d43283211422e3e13ab9e5f7c8df614731&w=740"
			alt="Password Reset Preview"
			class="h-full w-full object-cover"
		/>
		<div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-6 text-white">
			<h3 class="mb-2 text-xl font-bold">Reset Your Password</h3>
			<p class="text-sm">
				Secure your account like a pro – choose a password that's tough to crack!
			</p>
		</div>
	</div>

	<!-- Password Reset Form Section -->
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
					Reset Your Password
				</h2>

				<!-- Form using shadcn-svelte Form components -->
				<form method="POST" use:enhance>
					<Form.Field {form} name="password">
						<Form.Control let:attrs>
							<Form.Label>New Password</Form.Label>
							<Input
								{...attrs}
								type="password"
								bind:value={$formData.password}
								placeholder="Enter your new password"
							/>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="confirm_password">
						<Form.Control let:attrs>
							<Form.Label>Confirm Password</Form.Label>
							<Input
								{...attrs}
								type="password"
								bind:value={$formData.confirm_password}
								placeholder="Confirm your new password"
							/>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="token">
						<Form.Control let:attrs>
							<Input
								{...attrs}
								type="hidden"
								disabled
								bind:value={token}
								placeholder="token entry"
							/>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Button type="submit" class="w-full" disabled={$delayed}>
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
							Resetting password...
							{toastManager(TOAST_TYPE_LOADING, 'Please wait...')}
						{:else}
							Reset Password
						{/if}
					</Form.Button>
				</form>
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
