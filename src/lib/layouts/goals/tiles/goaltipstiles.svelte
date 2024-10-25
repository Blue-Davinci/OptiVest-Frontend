<script>
import {
		Target,
		Calendar,
		TrendingUp,
		ArrowUpCircle,
		PiggyBank
	} from 'lucide-svelte';
    let {pieChartData} = $props();
</script>

<div class="rounded-lg border bg-card p-6">
    <h3 class="mb-4 text-lg font-semibold">Smart Tips</h3>
    <div class="space-y-3">
        {#if pieChartData[0]?.value === 0}
            <div class="flex items-start gap-3 text-sm">
                <div class="mt-0.5 rounded-full bg-primary/10 p-1">
                    <ArrowUpCircle class="h-4 w-4 text-primary" />
                </div>
                <p>Start your journey by making your first contribution to any goal!</p>
            </div>
        {:else if (pieChartData[0]?.value / (pieChartData[0]?.value + pieChartData[1]?.value)) < 0.25}
            <div class="flex items-start gap-3 text-sm">
                <div class="mt-0.5 rounded-full bg-primary/10 p-1">
                    <TrendingUp class="h-4 w-4 text-primary" />
                </div>
                <p>Consider increasing your monthly contributions to reach your goals faster.</p>
            </div>
        {:else if (pieChartData[0]?.value / (pieChartData[0]?.value + pieChartData[1]?.value)) > 0.75}
            <div class="flex items-start gap-3 text-sm">
                <div class="mt-0.5 rounded-full bg-primary/10 p-1">
                    <PiggyBank class="h-4 w-4 text-primary" />
                </div>
                <p>You're doing great! Consider setting new goals to maintain momentum.</p>
            </div>
        {/if}
        <div class="flex items-start gap-3 text-sm">
            <div class="mt-0.5 rounded-full bg-primary/10 p-1">
                <Calendar class="h-4 w-4 text-primary" />
            </div>
            <p>Regular small contributions are better than irregular large ones.</p>
        </div>
        <div class="flex items-start gap-3 text-sm">
            <div class="mt-0.5 rounded-full bg-primary/10 p-1">
                <Target class="h-4 w-4 text-primary" />
            </div>
            <p>Review your goals monthly to ensure they remain aligned with your priorities.</p>
        </div>
    </div>
</div>