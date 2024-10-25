<script>
    import GoalTipsTiles from './tiles/goaltipstiles.svelte';
import {PieChart  } from 'layerchart';
import { schemeTableau10 } from 'd3-scale-chromatic';
import {
		Target,
		TrendingUp
	} from 'lucide-svelte';

let {goalData, formatCurrency, formatPercentage, filteredGoals} = $props();
function preparePieChartData(goals) {
		if (!goals?.data?.goals) return [];
		
		const totalTargetAmount = goals.data.goals.reduce((sum, goal) => 
			sum + parseFloat(goal.goals.target_amount || 0), 0);
		const totalCurrentAmount = goals.data.goals.reduce((sum, goal) => 
			sum + parseFloat(goal.goals.current_amount || 0), 0);
		
		return [
			{ name: 'Current Amount', value: totalCurrentAmount },
			{ name: 'Remaining Amount', value: Math.max(0, totalTargetAmount - totalCurrentAmount) }
		];
	}
let pieChartData = $derived(preparePieChartData(goalData));
</script>

<div class="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
    <!-- Pie Chart -->
    <div class="col-span-1 flex flex-col items-center justify-center lg:col-span-1">
        <h3 class="mb-4 text-lg font-semibold text-center">Overall Progress</h3>
        <div class="h-64 w-64">
            <PieChart
                data={pieChartData}
                key="name"
                value="value"
                innerRadius={-10}
                cornerRadius={5}
                padAngle={0.02}
                cRange={schemeTableau10}
            />
        </div>
        <div class="mt-4 flex gap-8 text-sm">
            {#each pieChartData as item}
                <div class="flex items-center gap-2">
                    <div 
                        class="h-3 w-3 rounded-full" 
                        style="background-color: {schemeTableau10[pieChartData.indexOf(item)]};"
                    ></div>
                    <span>{item.name}: {formatCurrency(item.value)}</span>
                </div>
            {/each}
        </div>
    </div>

    <!-- Summary Section -->
    <div class="col-span-1 flex flex-col gap-4 lg:col-span-2">
        <div class="rounded-lg border bg-card p-6">
            <h3 class="mb-4 text-lg font-semibold">Goals Summary</h3>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div class="rounded-lg bg-primary/5 p-4">
                    <div class="flex items-center gap-2">
                        <Target class="h-5 w-5 text-primary" />
                        <span class="text-sm font-medium">Total Goals</span>
                    </div>
                    <p class="mt-2 text-2xl font-bold">{filteredGoals.length}</p>
                </div>
                <div class="rounded-lg bg-primary/5 p-4">
                    <div class="flex items-center gap-2">
                        <TrendingUp class="h-5 w-5 text-primary" />
                        <span class="text-sm font-medium">Average Progress</span>
                    </div>
                    <p class="mt-2 text-2xl font-bold">
                        {formatPercentage(
                            filteredGoals.reduce((acc, goal) => acc + parseFloat(goal.progress_percentage), 0) / 
                            filteredGoals.length
                        )}%
                    </p>
                </div>
            </div>
        </div>

        <!-- Tips Section -->
        <GoalTipsTiles {pieChartData} />
    </div>
</div>