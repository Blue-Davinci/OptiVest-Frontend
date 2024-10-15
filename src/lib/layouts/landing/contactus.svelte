<script>
    import {Button} from '$lib/components/ui/button';
</script>
<div
	class="mt-8 grid grid-cols-1 gap-6 rounded-lg bg-gray-100 p-8 shadow-lg dark:bg-gray-900 md:grid-cols-2"
>
	<!-- Left Side: Contact Information -->
	<div class="flex flex-col justify-center">
		<h2 class="mb-4 text-3xl font-semibold text-gray-800 dark:text-gray-100">Contact Us</h2>

		<p class="mb-2 text-gray-600 dark:text-gray-300">Email us at: info@optivest.com</p>
		<p class="mb-2 text-gray-600 dark:text-gray-300">Call us: (321) 555-0123</p>
		<p class="mb-4 text-gray-600 dark:text-gray-300">Address: 123 Main Street, New York, NY</p>

		<!-- Horizontal Layout for Support, Feedback & Media Inquiries -->
		<div class="flex flex-col justify-between space-y-4 md:flex-row md:space-x-4 md:space-y-0">
			<div class="flex-1">
				<h3 class="text-lg font-bold text-gray-700 dark:text-gray-200">Customer Support</h3>
				<p class="text-sm text-gray-500 dark:text-gray-400">
					Our support team is available 24/7 to assist you with any issues or queries.
				</p>
			</div>
			<div class="flex-1">
				<h3 class="text-lg font-bold text-gray-700 dark:text-gray-200">Feedback & Suggestions</h3>
				<p class="text-sm text-gray-500 dark:text-gray-400">
					Your feedback is invaluable to us. Help us improve OptiVest.
				</p>
			</div>
			<div class="flex-1">
				<h3 class="text-lg font-bold text-gray-700 dark:text-gray-200">Media Inquiries</h3>
				<p class="text-sm text-gray-500 dark:text-gray-400">
					For press-related questions, reach us at media@optivest.com.
				</p>
			</div>
		</div>
	</div>

	<!-- Right Side: Contact Form -->
	<div class="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
		<h3 class="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-100">Get in Touch</h3>
		<form>
			<div class="mb-4 grid grid-cols-2 gap-4">
				<div>
					<label for="firstName" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>First Name</label
					>
					<input
						type="text"
						id="firstName"
						class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 sm:text-sm"
						placeholder="John"
					/>
				</div>
				<div>
					<label for="lastName" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>Last Name</label
					>
					<input
						type="text"
						id="lastName"
						class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 sm:text-sm"
						placeholder="Doe"
					/>
				</div>
			</div>
			<div class="mb-4">
				<label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
					>Email</label
				>
				<input
					type="email"
					id="email"
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 sm:text-sm"
					placeholder="you@example.com"
				/>
			</div>
			<div class="mb-4">
				<label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
					>Message</label
				>
				<textarea
					id="message"
					rows="4"
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 sm:text-sm"
					placeholder="Write your message..."
				></textarea>
			</div>
			<Button
				type="submit"
				class="w-full rounded-md px-4 py-2 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
			>
				Send Message
			</Button>
		</form>
	</div>
</div>
