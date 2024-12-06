<script>
	import {TrendingUp} from 'lucide-svelte';

    let {user} = $props();
</script>

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