<script>
	import { getContext, onMount } from 'svelte';
	import Themer from '../common/themer.svelte';
	import {
		Activity,
		ChartCandlestick,
		FolderKanban,
		LayoutDashboard,
		DollarSign,
		Target,
		PiggyBank,
		Wallet,
		UsersRound,
		Bell,
		Settings,
		HelpCircle,
		HandCoins,
		Newspaper,
		GraduationCap,
		ChevronsLeft,
		ChevronsRight
	} from 'lucide-svelte';
	let { userInfo } = $props();

	let profile_url = userInfo.profile_url;
	let full_name = `${userInfo.first_name} ${userInfo.last_name}`;
	let userEmail = userInfo.user_role;
	let isOpen = $state(true);
	let activeItem = $state('Dashboard');
	let isDarkMode = $state(false);
	let showHamburgerMenu = $state(false);

	const sseContext = getContext('sseMessages');
	let notificationCount = $derived(sseContext.count);
	const navSections = [
		{
			name: 'Main',
			shortLabel: 'Main',
			items: [
				{ name: 'Dashboard', icon: LayoutDashboard, url: '/dashboard' }
			]
		},
		{
			name: 'Finance Management',
			shortLabel: 'Finance',
			items: [
				{ name: 'Budget Manager', icon: DollarSign, url: '/dashboard/budgets' },
				{ name: 'Goal Manager', icon: Target, url: '/dashboard/goals' }
			]
		},
		{
			name: 'Finance Tracker',
			shortLabel: 'Trackers',
			items: [
				{ name: 'Income Manager', icon: HandCoins, url: '/dashboard/incomes' },
				{ name: 'Expense Manager', icon: PiggyBank, url: '/dashboard/expenses' },
				{ name: 'Debt Manager', icon: Wallet, url: '/dashboard/debts' }
			]
		},
		{
			name: "Portfolio",
			shortLabel: "Portfolio",
			items: [
				{ name: "Investment Portfolio", icon: Activity, url: "/dashboard/investment-portfolio" },
				{ name: "Finance Analysis", icon: ChartCandlestick, url: "/dashboard/personal-finance" }
			]
		},
		{
			name: 'Groups',
			shortLabel: 'Groups',
			items: [
				{ name: 'Group Manager', icon: FolderKanban, url: '/dashboard/groups' },
				{ name: 'Groups', icon: UsersRound, url: '#1' }
			]
		},
		{
			name: 'News',
			shortLabel: 'News',
			items: [
				{ name: 'Finance News', icon: Newspaper, url: '/dashboard/feeds' },
				{ name: 'Education', icon: GraduationCap, url: '/dashboard/feeds?is_educational=true' }
			]
		}
	];

	const bottomItems = $derived([
    { name: 'Notifications', icon: Bell, badge: notificationCount, url: '/dashboard/notifications' },
    { name: 'Settings', icon: Settings, url: '#1' },
    { name: 'Support', icon: HelpCircle, url: '#1' }
]);

	function toggleSidebar() {
		isOpen = !isOpen;
	}

	function setActiveItem(item) {
		activeItem = item;
	}

	function toggleTheme() {
		isDarkMode = !isDarkMode;
	}

	function toggleHamburgerMenu() {
		showHamburgerMenu = !showHamburgerMenu;
	}

	onMount(() => {
		const mediaQuery = window.matchMedia('(max-width: 768px)');
		const handleMediaQueryChange = (e) => {
			isOpen = !e.matches;
		};
		mediaQuery.addEventListener('change', handleMediaQueryChange);
		handleMediaQueryChange(mediaQuery);

		return () => {
			mediaQuery.removeEventListener('change', handleMediaQueryChange);
		};
	});
</script>

<!-- Hamburger Menu for smaller screens -->
<div class="flex justify-between bg-blue-100 p-4 dark:bg-gray-800 mb-2 sm:hidden">
	<img src="/optivest-cropped.png" alt="OptiVest Logo" class="h-10 w-10 rounded-full" />
	<button
		onclick={toggleHamburgerMenu}
		class="text-gray-500 hover:text-gray-700 dark:text-gray-300 z-10"
	>
		{#if showHamburgerMenu}
			<ChevronsLeft class="h-5 w-5" />
		{:else}
			<ChevronsRight class="h-5 w-5" />
		{/if}
	</button>
</div>

<nav
	class="fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 ease-in-out dark:bg-gray-900 {isOpen
		? 'w-64'
		: 'w-20'} flex flex-col text-gray-700 dark:text-gray-400 {showHamburgerMenu
		? 'block'
		: 'hidden'} sm:flex"
>
	<div class="flex items-center justify-between bg-blue-100 p-4 dark:bg-gray-800">
		{#if isOpen}
			<div class="flex items-center space-x-2">
				<img src="/optivest-cropped.png" alt="OptiVest Logo" class="h-10 w-10 rounded-full" />
				<span class="text-lg font-bold text-blue-800 dark:text-blue-300">OptiVest</span>
			</div>
		{:else}
			<img src="/optivest-cropped.png" alt="OptiVest Logo" class="mx-auto h-8 w-8" />
		{/if}
		<button onclick={toggleSidebar} class="text-gray-500 hover:text-gray-700 dark:text-gray-300">
			{#if isOpen}
				<ChevronsLeft class="h-5 w-5" />
			{:else}
				<ChevronsRight class="h-5 w-5" />
			{/if}
		</button>
	</div>

	<!-- Sidebar content -->
	<div class="flex-grow overflow-y-auto">
		<div class="mt-2 space-y-1">
			{#each navSections as section}
				<div>
					{#if isOpen}
						<h3
							class="px-4 py-1 text-[9px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
						>
							{section.name}
						</h3>
					{:else}
						<p
							class="mb-2 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
						>
							{section.shortLabel}
						</p>
					{/if}
					<ul>
						{#each section.items as item}
							<li>
								<a
									href={item.url}
									class="flex w-full items-center px-4 py-2 text-[13px] font-medium text-gray-600 transition-colors duration-200 hover:rounded-lg hover:bg-blue-100 dark:text-gray-300 dark:hover:bg-gray-700 {activeItem ===
									item.name
										? 'rounded-lg bg-blue-200 text-blue-600 dark:bg-gray-800 dark:text-white'
										: ''}"
									onclick={() => setActiveItem(item.name)}
								>
									{#if item.icon}
										<item.icon class="h-5 w-5 {isOpen ? 'mr-3' : 'mx-auto'}" />
									{/if}

									{#if isOpen}
										<span>{item.name}</span>
									{/if}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>

	<div class="p-3">
		<ul>
			{#each bottomItems as item}
				<li>
					<a
						href={item.url}
						class="flex w-full items-center px-4 py-2 text-[13px] text-gray-600 transition-colors duration-200 hover:rounded-lg hover:bg-blue-100 dark:text-gray-300 dark:hover:bg-gray-700 {activeItem ===
						item.name
							? 'rounded-lg bg-blue-200 text-blue-600 dark:bg-gray-800 dark:text-white'
							: ''}"
						onclick={() => setActiveItem(item.name)}
					>
						<div class="relative">
							{#if item.icon}
								<item.icon class="h-5 w-5 {isOpen ? 'mr-2' : 'mx-auto'}" />
							{/if}

							{#if item.badge && !isOpen}
								<span
									class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white"
									>{item.badge}</span
								>
							{/if}
						</div>
						{#if isOpen}
							<span>{item.name}</span>
							{#if item.badge}
								<span
									class="ml-auto rounded-full bg-blue-500 px-1.5 py-0.5 text-xs font-bold text-white"
									>{item.badge}</span
								>
							{/if}
						{/if}
					</a>
				</li>
			{/each}
		</ul>
	</div>
	<div class="mx-3 mb-4 rounded-lg bg-gray-100 p-3 shadow-md dark:bg-gray-800">
		<div class="flex items-center space-x-3 {isOpen ? '' : 'justify-center'}">
			<img src={profile_url} alt="User Avatar" class="h-10 w-10 rounded-full object-cover" />
			{#if isOpen}
				<div class="min-w-0 flex-1">
					<p class="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{full_name}</p>
					<p class="truncate text-sm text-gray-500 dark:text-gray-400">{userEmail}</p>
				</div>
				<Themer />
			{/if}
		</div>
		{#if isOpen}
			<!-- Logout Form -->
			<div class="mt-4">
				<form method="POST" action="/logout">
					<button
						type="submit"
						class="flex w-full items-center justify-center bg-red-100 px-4 py-2 text-[13px] font-medium text-red-600 transition-colors duration-200 hover:rounded-lg hover:bg-red-200 dark:bg-red-900 dark:text-red-400 dark:hover:bg-red-800"
					>
						Logout
					</button>
				</form>
			</div>
		{/if}
	</div>
</nav>

<style>
		nav {
		z-index: 1000;
		font-family: 'Inter', sans-serif;
	}
</style>
