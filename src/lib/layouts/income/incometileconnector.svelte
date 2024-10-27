<script>
        import { 
        DollarSign,
        Coins,
        Globe,
        BarChart4,
        LineChart as LineChartIcon
    } from 'lucide-svelte';
    import StatCard from '$lib/layouts/income/tiles/statcard.svelte';
    let {incomeData, defaultCurrency, formatCurrency, mostUsedCurrency} = $props();
    // Calculate current and previous month's data
    let currentDate = $state(new Date());

    let previousMonthDate = new Date(currentDate);
    previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);

let currentMonth = $derived(currentDate.toISOString().slice(0, 7));
let previousMonth = $derived(previousMonthDate.toISOString().slice(0, 7));
let currentMonthIncome = $derived(
        incomeData
            .filter(item => item.income.date_received.startsWith(currentMonth))
            .reduce((sum, item) => sum + Number(item.income.amount), 0)
    );

    let previousMonthIncome = $derived(
        incomeData.some(item => item.income.date_received.startsWith(previousMonth))
            ? incomeData
                .filter(item => item.income.date_received.startsWith(previousMonth))
                .reduce((sum, item) => sum + Number(item.income.amount), 0)
            : 0 // Default to 0 if no data is found for the previous month
    );

    // Calculate average income for the current and previous months
    let currentMonthAverageIncome = $derived(
        incomeData.filter(item => item.income.date_received.startsWith(currentMonth)).length
            ? currentMonthIncome / incomeData.filter(item => item.income.date_received.startsWith(currentMonth)).length
            : 0
    );

    let previousMonthAverageIncome = $derived(
        incomeData.filter(item => item.income.date_received.startsWith(previousMonth)).length
            ? previousMonthIncome / incomeData.filter(item => item.income.date_received.startsWith(previousMonth)).length
            : 0
    );

    // Enhanced metrics with most used currency
    let totalIncome = $derived(
        incomeData.reduce((sum, item) => sum + Number(item.income.amount), 0)
    );

    let overallAverageIncome = $derived(
        incomeData.length ? totalIncome / incomeData.length : 0
    );

    let highestIncome = $derived(
        Math.max(...incomeData.map(item => Number(item.income.amount)))
    );

    let uniqueSources = $derived(
        new Set(incomeData.map(item => item.income.source)).size
    );

</script>

<div class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <StatCard
        title="Total Income"
        value={incomeData.length ? formatCurrency(totalIncome) : '—'}
        icon={DollarSign}
        previousValue={previousMonthIncome || 0}
        currentValue={currentMonthIncome || 0}
    />

    <StatCard
        title="Average Income"
        value={incomeData.length ? formatCurrency(currentMonthAverageIncome) : '—'}
        icon={BarChart4}
        previousValue={previousMonthAverageIncome || 0}
        currentValue={currentMonthAverageIncome || 0}
    />

    <StatCard
        title="Most Used Currency"
        value={mostUsedCurrency || defaultCurrency}
        icon={Globe}
        showPercentageChange={false}
    />

    <StatCard
        title="Income Sources"
        value={uniqueSources}
        icon={Coins}
        showPercentageChange={false}
    />
</div>