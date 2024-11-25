<script>
	import { TOAST_TYPE_ERROR, TOAST_TYPE_SUCCESS } from '$lib/settings/constants.js';
	import { toastManager } from '$lib/helpers/utilities.js';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { superForm } from 'sveltekit-superforms';
	import { contactSchema } from '$lib/settings/schema.js';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Button } from '$lib/components/ui/button';
	import { fly, fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	let { data } = $props();
	$inspect(data, 'Contact Us Data');
	// Cooldown state
	let cooldownActive = $state(false);
	let cooldownTime = $state(60); // 60 seconds cooldown
	let remainingTime = $state(0);
	let cooldownInterval;

	function startCooldown() {
		cooldownActive = true;
		remainingTime = cooldownTime;

		cooldownInterval = setInterval(() => {
			remainingTime--;
			if (remainingTime <= 0) {
				clearInterval(cooldownInterval);
				cooldownActive = false;
				remainingTime = cooldownTime;
			}
		}, 1000);
	}

	onMount(() => {
		return () => {
			if (cooldownInterval) clearInterval(cooldownInterval);
		};
	});

	function formatTime(seconds) {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	}

	const form = superForm(data.form, {
		validators: zodClient(contactSchema),
		dataType: 'json',
		invalidateAll: true,
		onUpdated({ form }) {
			if (form.message && form.message.success) {
				toastManager(TOAST_TYPE_SUCCESS, form.message.message);
				console.log('Message sent:', form.message.data);
				startCooldown();
			} else if (form.message && !form.message.success) {
				toastManager(TOAST_TYPE_ERROR, form.message.message);
			}
			
		}
	});
	const { form: formData, enhance, message, delayed } = form;

	let infoSectionVisible = $state(false);
	let formSectionVisible = $state(false);

	const supportItems = [
		{
			title: 'Customer Support',
			description: 'Our support team is available 24/7 to assist you with any issues or queries.',
			icon: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
		},
		{
			title: 'Feedback & Suggestions',
			description: 'Your feedback is invaluable to us. Help us improve OptiVest.',
			icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
		},
		{
			title: 'Media Inquiries',
			description: 'For press-related questions, reach us at media@optivest.com.',
			icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z'
		}
	];

	function inView(node, params = {}) {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						node.dispatchEvent(new CustomEvent('enter'));
						if (!params.persistent) {
							observer.unobserve(node);
						}
					}
				});
			},
			{
				threshold: params.threshold || 0.1,
				rootMargin: params.rootMargin || '0px'
			}
		);

		observer.observe(node);

		return {
			destroy() {
				observer.unobserve(node);
			}
		};
	}
</script>

<div id="contact" class="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
	<div
		class="grid grid-cols-1 gap-8 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-8 shadow-xl dark:from-gray-900 dark:to-gray-800 md:grid-cols-2 lg:gap-12"
	>
		<!-- Left Side: Contact Information -->
		<div
			use:inView
			onenter={() => (infoSectionVisible = true)}
			class="flex flex-col justify-between space-y-8"
		>
			{#if infoSectionVisible}
				<div in:fly={{ x: -30, duration: 800, delay: 0 }} class="space-y-6">
					<h2 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
						Let's Connect
					</h2>

					<div class="space-y-4">
						<div class="flex items-center space-x-4 text-gray-700 dark:text-gray-200">
							<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								/>
							</svg>
							<span class="text-lg">info@optivest.com</span>
						</div>

						<div class="flex items-center space-x-4 text-gray-700 dark:text-gray-200">
							<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
								/>
							</svg>
							<span class="text-lg">(321) 555-0123</span>
						</div>

						<div class="flex items-center space-x-4 text-gray-700 dark:text-gray-200">
							<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
							<span class="text-lg">123 Main Street, New York, NY</span>
						</div>
					</div>
				</div>

				<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{#each supportItems as { title, description, icon }, i}
						<div
							in:fly|local={{ y: 30, duration: 800, delay: 200 + i * 200 }}
							class="group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800"
						>
							<div
								class="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-blue-500/10 transition-transform group-hover:scale-150"
							></div>
							<svg
								class="mb-4 h-8 w-8 text-blue-600 dark:text-blue-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={icon} />
							</svg>
							<h3 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
								{title}
							</h3>
							<p class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
								{description}
							</p>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Right Side: Contact Form -->
		<div use:inView onenter={() => (formSectionVisible = true)} class="w-full">
			{#if formSectionVisible}
				<div
					in:fly={{ x: 30, duration: 800, delay: 400 }}
					class="h-full w-full rounded-xl bg-white p-8 shadow-xl dark:bg-gray-800"
				>
					<h3 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Get in Touch</h3>

					{#if cooldownActive}
						<div
							in:fly={{ y: 20, duration: 400 }}
							class="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/30"
						>
							<div class="flex items-center justify-between">
								<div class="flex items-center space-x-3">
									<svg
										class="h-5 w-5 text-blue-500 dark:text-blue-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									<p class="text-sm font-medium text-blue-800 dark:text-blue-200">
										Please wait before submitting another message
									</p>
								</div>
								<div class="text-sm font-semibold text-blue-600 dark:text-blue-300">
									{formatTime(remainingTime)}
								</div>
							</div>
							<div class="mt-2">
								<div class="h-1.5 w-full overflow-hidden rounded-full bg-blue-200 dark:bg-blue-800">
									<div
										class="h-full bg-purple-500 transition-all duration-1000 dark:bg-purple-400"
										style="width: {(remainingTime / cooldownTime) * 100}%"
									></div>
								</div>
							</div>
						</div>
					{/if}

					<form method="POST" use:enhance={enhance}>
						<Form.Field {form} name="name">
							<Form.Control let:attrs>
								<Form.Label class="text-gray-700 dark:text-gray-200">Full Name</Form.Label>
								<Input
									{...attrs}
									placeholder="Enter your full name"
									bind:value={$formData.name}
									disabled={cooldownActive}
									class="mt-2 w-full rounded-lg border-gray-300 shadow-sm disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
								/>
							</Form.Control>
							<Form.FieldErrors class="text-sm text-red-500" />
						</Form.Field>

						<Form.Field {form} name="email">
							<Form.Control let:attrs>
								<Form.Label class="text-gray-700 dark:text-gray-200">Email</Form.Label>
								<Input
									{...attrs}
									bind:value={$formData.email}
									placeholder="yourname@example.com"
									disabled={cooldownActive}
									class="mt-2 w-full rounded-lg border-gray-300 shadow-sm disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
								/>
							</Form.Control>
							<Form.FieldErrors class="text-sm text-red-500" />
						</Form.Field>

						<Form.Field {form} name="subject">
							<Form.Control let:attrs>
								<Form.Label class="text-gray-700 dark:text-gray-200">Subject</Form.Label>
								<Input
									{...attrs}
									bind:value={$formData.subject}
									placeholder="enter what you want to talk about"
									disabled={cooldownActive}
									class="mt-2 w-full rounded-lg border-gray-300 shadow-sm disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
								/>
							</Form.Control>
							<Form.FieldErrors class="text-sm text-red-500" />
						</Form.Field>

						<Form.Field {form} name="message">
							<Form.Control let:attrs>
								<Form.Label class="text-gray-700 dark:text-gray-200">Message</Form.Label>
								<Textarea
									{...attrs}
									placeholder="How can we help you?"
									disabled={cooldownActive}
									class="mt-2 h-32 w-full resize-none rounded-lg border-gray-300 shadow-sm disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
									bind:value={$formData.message}
								/>
							</Form.Control>
							<Form.FieldErrors class="text-sm text-red-500" />
						</Form.Field>

						<Form.Button
							type="submit"
							disabled={cooldownActive || $delayed}
							class="w-full rounded-lg px-4 py-2 font-semibold hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:cursor-not-allowed disabled:opacity-50"
							tabindex="0"
							aria-disabled={cooldownActive || $delayed}
							aria-label={cooldownActive
								? `Please wait ${formatTime(remainingTime)}`
								: $delayed
									? 'Message is being sent'
									: 'Send Message'}
						>
							{#if $delayed}
								<div class="flex items-center justify-center space-x-2">
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
										></path>
									</svg>
									<span>Sending...</span>
								</div>
							{:else if cooldownActive}
								<span>Please wait {formatTime(remainingTime)}</span>
							{:else}
								<span>Send Message</span>
							{/if}
						</Form.Button>
					</form>
				</div>
			{/if}
		</div>
	</div>
</div>
