<script>
	import {
		Settings,
		TrendingUp,
		Edit3,
		ChevronRight,
		Shield,
		QrCode,
		AlertCircle
	} from 'lucide-svelte';
    import Accountheader from '$lib/layouts/accounts/accountheader.svelte';
    import Accountoverview from '$lib/layouts/accounts/accountoverview.svelte';
    import Accountactivity from '$lib/layouts/accounts/accountactivity.svelte';
    import Accountawards from '$lib/layouts/accounts/accountawards.svelte';

	let { data } = $props();
    $inspect(data);
	let accountStats = $derived(data?.data?.accountStats?.AccountStats || {});
    let accountRating = $derived(data?.data?.accountStats?.AccountRating || {});
	let awards = $derived(data?.data?.awards);
	let userInfo = $derived(data?.userInformation || {});
	let user = $derived(data?.data?.user || {});

	// MFA related state
	let mfaEnabled = $state(false);
	let showQRCode = $state(false);
	let verificationCode = $state('');

	function updateProfile(event) {
		console.log('Profile update triggered');
	}


	// MFA related functions
	function toggleMFA() {
		if (!mfaEnabled) {
			showQRCode = true;
		} else {
			// Handle MFA disable logic
			mfaEnabled = false;
			showQRCode = false;
		}
	}

	function verifyAndEnableMFA() {
		// Add your MFA verification logic here
		if (verificationCode.length === 6) {
			mfaEnabled = true;
			showQRCode = false;
			verificationCode = '';
		}
	}
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Enhanced Header Section with Financial Overview -->
     <Accountheader {data} {accountStats} {user} {accountRating} />

	<main class="container mx-auto -mt-24 px-4">
        <!-- Overview Stats -->
        <Accountoverview {accountStats} />
		<!-- Activity Timeline -->
        <Accountactivity />

		<!-- Enhanced Awards Section -->
        <Accountawards {awards} />

		<!-- Enhanced Investment Preferences -->
		<section class="mt-6 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
			<h2 class="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
				<TrendingUp />
				Investment Profile
			</h2>
			<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
				<div>
					<label for="" class="mb-2 block font-medium text-gray-700 dark:text-gray-300"
						>Risk Tolerance</label
					>
					<select
						class="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-purple-800"
						value={user.risk_tolerance?.RiskToleranceType || ''}
					>
						<option value="">Select Risk Tolerance</option>
						<option value="conservative">Conservative</option>
						<option value="moderate">Moderate</option>
						<option value="aggressive">Aggressive</option>
					</select>
					<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
						This helps us understand your comfort level with investment risk
					</p>
				</div>
				<div>
					<label for="" class="mb-2 block font-medium text-gray-700 dark:text-gray-300"
						>Investment Timeline</label
					>
					<select
						class="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-purple-800"
						value={user.time_horizon?.TimeHorizonType || ''}
					>
						<option value="">Select Timeline</option>
						<option value="short">Short Term</option>
						<option value="medium">Medium Term (5-10 years)</option>
						<option value="long">Long Term (> 10 years)</option>
					</select>
					<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
						How long do you plan to keep your investments?
					</p>
				</div>
			</div>
		</section>

		<!-- MFA Section-->
		<section class="mt-6 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
			<h2 class="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
				<Shield />
				Two-Factor Authentication
			</h2>

			<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
				<!-- MFA Status and Controls -->
				<div class="space-y-6">
					<div
						class="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50"
					>
						<div class="flex items-center gap-3">
							<div
								class={`rounded-full p-2 ${mfaEnabled ? 'bg-green-100 dark:bg-green-900/50' : 'bg-yellow-100 dark:bg-yellow-900/50'}`}
							>
								<Shield
									class={`${mfaEnabled ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}
									size={24}
								/>
							</div>
							<div>
								<h3 class="font-medium text-gray-900 dark:text-white">
									{mfaEnabled ? 'MFA is Enabled' : 'MFA is Disabled'}
								</h3>
								<p class="text-sm text-gray-500 dark:text-gray-400">
									{mfaEnabled
										? 'Your account is secured with 2FA'
										: 'Enable 2FA for enhanced security'}
								</p>
							</div>
						</div>
						<button
							onclick={toggleMFA}
							class={`rounded-lg px-4 py-2 font-medium ${
								mfaEnabled
									? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-400'
									: 'bg-purple-100 text-purple-600 hover:bg-purple-200 dark:bg-purple-900/50 dark:text-purple-400'
							}`}
						>
							{mfaEnabled ? 'Disable' : 'Enable'}
						</button>
					</div>

					{#if showQRCode}
						<div class="space-y-4">
							<div class="mb-4 flex items-center gap-3">
								<QrCode size={20} class="text-purple-600 dark:text-purple-400" />
								<h3 class="font-medium text-gray-900 dark:text-white">Scan QR Code</h3>
							</div>
							<!-- Placeholder for QR Code -->
							<div
								class="mx-auto flex h-48 w-48 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-6 shadow-inner dark:border-gray-700 dark:bg-gray-900"
							>
								<span class="text-sm text-gray-500 dark:text-gray-400">QR Code Placeholder</span>
							</div>

							<div class="space-y-2">
								<label for="" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
									Enter Verification Code
								</label>
								<input
									type="text"
									bind:value={verificationCode}
									maxlength="6"
									class="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-purple-800"
									placeholder="Enter 6-digit code"
								/>
								<button
									onclick={verifyAndEnableMFA}
									class="mt-2 w-full rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition-all hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-800"
								>
									Verify and Enable
								</button>
							</div>
						</div>
					{/if}

					{#if !showQRCode}
						<div class="space-y-6">
							<div
								class="rounded-lg border border-gray-200 bg-gray-50 p-8 dark:border-gray-600 dark:bg-gray-700/50"
							>
								<div class="flex flex-col items-center justify-center text-center">
									<div
										class="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/50"
									>
										<Shield class="h-8 w-8 text-purple-600 dark:text-purple-400" />
									</div>

									<!-- Process Flow Visualization -->
									<div class="mx-auto w-full max-w-2xl">
										<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
											<!-- Step 1: Enable -->
											<div class="relative">
												<div
													class="h-full rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
												>
													<div class="absolute -top-3 left-1/2 -translate-x-1/2 transform">
														<span
															class="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-600 dark:bg-purple-900/50 dark:text-purple-400"
														>
															Step 1
														</span>
													</div>
													<div class="mt-4 flex flex-col items-center space-y-3">
														<button
															class="rounded-lg bg-purple-100 px-4 py-2 font-medium text-purple-600"
														>
															Enable MFA
														</button>
														<p class="text-sm text-gray-500 dark:text-gray-400">
															Click enable to start setup
														</p>
													</div>
												</div>
												<div
													class="absolute -right-4 top-1/2 hidden -translate-y-1/2 transform md:block"
												>
													<ChevronRight class="h-6 w-6 text-gray-400" />
												</div>
											</div>

											<!-- Step 2: Scan  -->
											<div class="relative">
												<div
													class="h-full rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
												>
													<div class="absolute -top-3 left-1/2 -translate-x-1/2 transform">
														<span
															class="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-600 dark:bg-purple-900/50 dark:text-purple-400"
														>
															Step 2
														</span>
													</div>
													<div class="mt-4 flex flex-col items-center space-y-3">
														<div
															class="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700"
														>
															<QrCode class="h-6 w-6 text-gray-400" />
														</div>
														<p class="text-sm text-gray-500 dark:text-gray-400">
															Scan QR with authenticator
														</p>
													</div>
												</div>
												<div
													class="absolute -right-4 top-1/2 hidden -translate-y-1/2 transform md:block"
												>
													<ChevronRight class="h-6 w-6 text-gray-400" />
												</div>
											</div>

											<!-- Step 3: Verify -->
											<div class="relative">
												<div
													class="h-full rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
												>
													<div class="absolute -top-3 left-1/2 -translate-x-1/2 transform">
														<span
															class="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-600 dark:bg-purple-900/50 dark:text-purple-400"
														>
															Step 3
														</span>
													</div>
													<div class="mt-4 flex flex-col items-center space-y-3">
														<div
															class="flex h-8 w-24 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700"
														>
															<span class="font-mono text-gray-400">• • • • • •</span>
														</div>
														<p class="text-sm text-gray-500 dark:text-gray-400">
															Enter verification code
														</p>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					{/if}
				</div>

				<!-- MFA Tips and Information -->
				<div class="rounded-xl bg-purple-50 p-6 dark:bg-purple-900/20">
					<div class="mb-4 flex items-center gap-3">
						<AlertCircle class="text-purple-600 dark:text-purple-400" size={24} />
						<h3 class="font-semibold text-purple-900 dark:text-purple-100">
							Why Use Two-Factor Authentication?
						</h3>
					</div>
					<ul class="space-y-3 text-gray-600 dark:text-gray-300">
						<li class="flex items-start gap-2">
							<span class="text-purple-600 dark:text-purple-400">•</span>
							<span>Adds an extra layer of security to your account</span>
						</li>
						<li class="flex items-start gap-2">
							<span class="text-purple-600 dark:text-purple-400">•</span>
							<span>Protects against unauthorized access even if your password is compromised</span>
						</li>
						<li class="flex items-start gap-2">
							<span class="text-purple-600 dark:text-purple-400">•</span>
							<span>Required for certain high-security operations</span>
						</li>
					</ul>

					<div class="mt-6 space-y-3">
						<h4 class="font-medium text-purple-900 dark:text-purple-100">Getting Started:</h4>
						<ol class="space-y-2 text-gray-600 dark:text-gray-300">
							<li class="flex items-start gap-2">
								<span class="font-medium text-purple-600 dark:text-purple-400">1.</span>
								<span>Download an authenticator app (Google Authenticator, Authy, etc.)</span>
							</li>
							<li class="flex items-start gap-2">
								<span class="font-medium text-purple-600 dark:text-purple-400">2.</span>
								<span>Scan the QR code with your authenticator app</span>
							</li>
							<li class="flex items-start gap-2">
								<span class="font-medium text-purple-600 dark:text-purple-400">3.</span>
								<span>Enter the 6-digit code to verify and enable MFA</span>
							</li>
						</ol>
					</div>
				</div>
			</div>
		</section>

		<!-- Enhanced Profile Settings -->
		<section class="mt-6 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
			<h2 class="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
				<Settings />
				Profile Settings
			</h2>
			<form onsubmit={updateProfile} class="space-y-8">
				<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
					<div>
						<label for="first_name" class="mb-2 block font-medium text-gray-700 dark:text-gray-300"
							>First Name</label
						>
						<input
							id="first_name"
							type="text"
							value={userInfo.first_name}
							class="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-purple-800"
						/>
					</div>
					<div>
						<label for="" class="mb-2 block font-medium text-gray-700 dark:text-gray-300"
							>Last Name</label
						>
						<input
							type="text"
							value={userInfo.last_name}
							class="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-purple-800"
						/>
					</div>
					<div>
						<label for="" class="mb-2 block font-medium text-gray-700 dark:text-gray-300"
							>Phone Number</label
						>
						<input
							type="tel"
							value={user.phone_number}
							class="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-purple-800"
						/>
					</div>
					<div>
						<label for="" class="mb-2 block font-medium text-gray-700 dark:text-gray-300"
							>Date of Birth</label
						>
						<input
							type="date"
							value={user.dob?.split('T')[0]}
							class="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-purple-800"
						/>
					</div>
					<div>
						<label for="" class="mb-2 block font-medium text-gray-700 dark:text-gray-300"
							>Country</label
						>
						<select
							class="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-purple-800"
							value={userInfo.country_code}
						>
							<option value="KE">Kenya</option>
							<option value="US">United States</option>
							<option value="GB">United Kingdom</option>
						</select>
					</div>
					<div>
						<label for="" class="mb-2 block font-medium text-gray-700 dark:text-gray-300"
							>Currency</label
						>
						<select
							class="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-purple-800"
							value={userInfo.currency_code}
						>
							<option value="USD">USD</option>
							<option value="EUR">EUR</option>
							<option value="GBP">GBP</option>
							<option value="KES">KES</option>
						</select>
					</div>
					<div class="md:col-span-2">
						<label for="" class="mb-2 block font-medium text-gray-700 dark:text-gray-300"
							>Address</label
						>
						<input
							type="text"
							value={user.address}
							class="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-purple-800"
						/>
					</div>
				</div>
				<div class="flex justify-end">
					<button
						type="submit"
						class="flex items-center gap-2 rounded-lg bg-purple-600 px-8 py-3 font-medium text-white transition-all hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-800"
					>
						<Edit3 size={20} />
						Save Changes
					</button>
				</div>
			</form>
		</section>
	</main>
</div>

<style>
	/* additional custom styles */
</style>
