<script>
	import { Wallet, Bell, Fingerprint } from 'lucide-svelte';
</script>
<section class="bg-gray-50 py-20 dark:bg-gray-900">
	<div class="container mx-auto px-4">
		<!-- Section Title -->
		<h2 class="mb-12 text-center text-4xl font-bold text-gray-800 dark:text-white">
			Our Core Features
		</h2>

		<!-- Features Grid -->
		<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
			<!-- Feature 1 -->
			<div class="rounded-lg bg-white p-8 text-center shadow-lg dark:bg-gray-800">
				<div class="mb-6 flex items-center justify-center">
					<div
						class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-yellow-400"
					>
						<Wallet class="h-8 w-8" />
					</div>
				</div>
				<h3 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
					AI Financial Management
				</h3>
				<p class="text-gray-600 dark:text-gray-400">
					Effortlessly manage your finances and manage porfolios with our AI finance advisor.
				</p>
			</div>

			<!-- Feature 2 -->
			<div class="rounded-lg bg-white p-8 text-center shadow-lg dark:bg-gray-800">
				<div class="mb-6 flex items-center justify-center">
					<div
						class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-yellow-400"
					>
						<Bell class="h-8 w-8" />
					</div>
				</div>
				<h3 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
					Notifications and Alerts
				</h3>
				<p class="text-gray-600 dark:text-gray-400">
					Stay informed with real-time updates on your financial activities and goals.
				</p>
			</div>

			<!-- Feature 3 -->
			<div class="rounded-lg bg-white p-8 text-center shadow-lg dark:bg-gray-800">
				<div class="mb-6 flex items-center justify-center">
					<div
						class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-yellow-400"
					>
						<Fingerprint class="h-8 w-8" />
					</div>
				</div>
				<h3 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
					Privacy and Security
				</h3>
				<p class="text-gray-600 dark:text-gray-400">
					Your financial data is protected with state-of-the-art encryption and security measures.
				</p>
			</div>
		</div>
	</div>
</section>
