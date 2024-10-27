<script>
    import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-svelte';

    // Props with default values
    let {
        title,
        value,
        icon: Icon,
        previousValue = 0,
        currentValue = 0,
        showPercentageChange = true
    } = $props();

    // Convert to numbers explicitly
    const toNumber = (val) => {
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num;
    };

    // Convert previousValue and currentValue to numbers
    const prevValueNum = toNumber(previousValue);
    const currValueNum = toNumber(currentValue);
    // Function to calculate percentage change
    const calculatePercentageChange = (prev, curr) => {
        if (prev !== 0 && showPercentageChange) {
            const change = ((curr - prev) / prev) * 100;
            console.log('Computed percentageChange:', change.toFixed(1));
            return parseFloat(change.toFixed(1));
        }
        return 0;
    };

    // Function to determine the status (increase, decrease, or no change)
    const determineChangeStatus = (percentage) => {
        if (percentage > 0) return 'increase';
        if (percentage < 0) return 'decrease';
        return 'neutral';
    };

    // Calculate percentage change
    let percentageChange = calculatePercentageChange(prevValueNum, currValueNum);

    // Determine change status
    let changeStatus = determineChangeStatus(percentageChange);
</script>

<div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-purple-100 dark:border-purple-900 hover:border-purple-200 dark:hover:border-purple-700 transition-all hover:shadow-md hover:translate-y-[-2px] duration-300">
    <div class="flex items-center justify-between">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <Icon class="w-5 h-5 text-purple-600 dark:text-purple-400" />
    </div>
    <p class="mt-2 text-3xl font-bold text-purple-600 dark:text-purple-400">
        {value}
    </p>
    {#if percentageChange !== null && showPercentageChange}
        <div class="mt-2 flex items-center text-sm"
            class:text-green-600={changeStatus === 'increase'}
            class:text-red-600={changeStatus === 'decrease'}
            class:text-yellow-600={changeStatus === 'neutral'}
            class:dark:text-green-400={changeStatus === 'increase'}
            class:dark:text-red-400={changeStatus === 'decrease'}
            class:dark:text-yellow-400={changeStatus === 'neutral'}>
            
            {#if changeStatus === 'increase'}
                <ArrowUpRight class="w-4 h-4" />
            {:else if changeStatus === 'decrease'}
                <ArrowDownRight class="w-4 h-4" />
            {:else}
                <Minus class="w-4 h-4" />
            {/if}
            <span class="ml-1">{Math.abs(percentageChange)}% from last month</span>
        </div>
    {/if}
</div>
