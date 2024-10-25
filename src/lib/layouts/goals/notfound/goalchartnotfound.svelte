<script>
import {
		Target,
		TrendingUp,
        PiggyBank,
        Calendar,
	} from 'lucide-svelte';

</script>

<div class="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
    <!-- Empty Chart Placeholder -->
    <div class="col-span-1 flex flex-col items-center justify-center lg:col-span-1">
        <div class="h-64 w-64 flex flex-col items-center justify-center rounded-full border-2 border-dashed border-primary/30">
            <PiggyBank class="h-12 w-12 text-primary/50 mb-2" />
            <p class="text-sm text-muted-foreground text-center px-4">
                Start your financial journey by setting your first goal
            </p>
        </div>
    </div>

    <!-- Empty Summary Section -->
    <div class="col-span-1 flex flex-col gap-4 lg:col-span-2">
        <div class="rounded-lg border bg-card p-6">
            <h3 class="mb-4 text-lg font-semibold">Getting Started</h3>
            <div class="space-y-4">
                <div class="rounded-lg bg-primary/5 p-4">
                    <div class="flex items-center gap-2">
                        <Target class="h-5 w-5 text-primary" />
                        <span class="text-sm font-medium">Set Your First Goal</span>
                    </div>
                    <p class="mt-2 text-sm text-muted-foreground">
                        Begin by setting a meaningful financial goal. It could be saving for a home, 
                        an emergency fund, or retirement.
                    </p>
                </div>
            </div>
        </div>

        <!-- Initial Tips Section -->
        <div class="rounded-lg border bg-card p-6">
            <h3 class="mb-4 text-lg font-semibold">Tips to Get Started</h3>
            <div class="space-y-3">
                <div class="flex items-start gap-3 text-sm">
                    <div class="mt-0.5 rounded-full bg-primary/10 p-1">
                        <Target class="h-4 w-4 text-primary" />
                    </div>
                    <p>Start with a small, achievable goal to build momentum</p>
                </div>
                <div class="flex items-start gap-3 text-sm">
                    <div class="mt-0.5 rounded-full bg-primary/10 p-1">
                        <Calendar class="h-4 w-4 text-primary" />
                    </div>
                    <p>Set realistic timeframes for your goals</p>
                </div>
                <div class="flex items-start gap-3 text-sm">
                    <div class="mt-0.5 rounded-full bg-primary/10 p-1">
                        <TrendingUp class="h-4 w-4 text-primary" />
                    </div>
                    <p>Track your progress regularly to stay motivated</p>
                </div>
            </div>
        </div>
    </div>
</div>