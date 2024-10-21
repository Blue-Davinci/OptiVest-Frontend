<script>
    import { TrendingUp, Activity, ChartColumn, Star, TrendingUpDown, AlertTriangle, FileText } from 'lucide-svelte';
  
    let { investmentAnalysisSummary } = $props();
  
    // Parse the returns into arrays
    let investments = investmentAnalysisSummary.map(investment => ({
      ...investment,
      returnsArray: investment.returns.split(',')
    }));
  
    // Sort investments by Sharpe ratio for top performers
    let topPerformers = investments
      .filter(investment => !isNaN(parseFloat(investment.sharpe_ratio))) // Ensure valid Sharpe ratio
      .sort((a, b) => parseFloat(b.sharpe_ratio) - parseFloat(a.sharpe_ratio)) // Descending order
      .slice(0, 3); // Top 3 performers
  </script>
  
  <!-- Main Dashboard Layout -->
  <div class="flex flex-col md:flex-row p-6 space-y-6 md:space-y-0 md:space-x-6 dark:bg-gray-900">
  
    <!-- Left: Scrollable investment list -->
    <div class="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 max-h-96 overflow-y-auto">
      <h2 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white">All Investments</h2>
  
      <!-- Fallback if no investments available -->
      {#if investments.length === 0}
        <div class="text-center text-gray-500 dark:text-gray-400">
          <AlertTriangle class="w-12 h-12 mx-auto mb-2 text-yellow-500 dark:text-yellow-400" />
          <p>No investment data available. It's looking a little empty here!</p>
          <a href="/#" class="text-blue-500 hover:underline dark:text-blue-400">
            Run a portfolio analysis to get started!
          </a>
        </div>
      {:else}
        <div class="space-y-4">
          {#each investments as investment}
            <div class="bg-gray-50 dark:bg-gray-700 rounded-md p-4 shadow hover:bg-gray-100 dark:hover:bg-gray-600 transition relative">
              
              <!-- Investment Type Badge -->
              <span class="absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full
                {investment.investment_type === 'stock' ? 'bg-green-500 text-white' : ''}
                {investment.investment_type === 'bond' ? 'bg-orange-500 text-white' : ''}
                {investment.investment_type === 'alternative' ? 'bg-blue-500 text-white' : ''}">
                {investment.investment_type.charAt(0).toUpperCase() + investment.investment_type.slice(1)}
              </span>
    
              <div class="flex items-center space-x-2 mb-2">
                {#if investment.investment_type === "stock"}
                  <TrendingUp class="w-6 h-6 text-green-500" />
                {/if}
                {#if investment.investment_type === "bond"}
                  <Activity class="w-6 h-6 text-orange-500" />
                {/if}
                {#if investment.investment_type === "alternative"}
                  <ChartColumn class="w-6 h-6 text-blue-500" />
                {/if}
                <span class="font-bold text-lg dark:text-white">{investment.symbol}</span>
              </div>
    
              <div class="text-sm space-y-1 dark:text-gray-300">
                <div><span class="font-semibold">Sharpe Ratio:</span> {investment.sharpe_ratio}</div>
                <div><span class="font-semibold">Sortino Ratio:</span> {investment.sortino_ratio}</div>
                <div><span class="font-semibold">Sector Performance:</span> {investment.sector_performance}</div>
                <div class="flex items-center">
                  <TrendingUpDown class="w-4 h-4 mr-2 text-gray-500 dark:text-gray-300" />
                  <span>Sentiment: {investment.sentiment_label !== "N/A" ? investment.sentiment_label : "No Sentiment"}</span>
                </div>
    
                <!-- Returns are displayed in a scrollable container -->
                <div class="mt-2">
                  <span class="font-semibold">Returns:</span>
                  <div class="overflow-x-auto whitespace-nowrap text-sm mt-1 p-1 bg-gray-100 dark:bg-gray-600 rounded-md">
                    {#each investment.returnsArray as returnItem}
                      <span class="inline-block px-2 py-1 bg-green-200 dark:bg-green-700 text-gray-900 dark:text-gray-300 rounded-md mx-1">{returnItem}</span>
                    {/each}
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  
    <!-- Right: Top performers section -->
    <div class="w-full md:w-64 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h2 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Top 3 Performers</h2>
  
      <!-- Fallback if no top performers available -->
      {#if topPerformers.length === 0}
        <div class="text-center text-gray-500 dark:text-gray-400">
          <FileText class="w-12 h-12 mx-auto mb-2 text-gray-500 dark:text-gray-300" />
          <p>No top performers available. Maybe next time!</p>
        </div>
      {:else}
        <div class="space-y-4">
          {#each topPerformers as performer}
            <div class="bg-yellow-50 dark:bg-yellow-600 rounded-md p-3 shadow-lg flex items-center space-x-3">
              {#if performer.investment_type === "stock"}
                <TrendingUp class="w-6 h-6 text-green-500 dark:text-green-400" />
              {/if}
              {#if performer.investment_type === "bond"}
                <Activity class="w-6 h-6 text-orange-500 dark:text-orange-400" />
              {/if}
              {#if performer.investment_type === "alternative"}
                <ChartColumn class="w-6 h-6 text-blue-500 dark:text-blue-400" />
              {/if}
              <div class="text-sm">
                <div class="font-bold text-gray-800 dark:text-white">{performer.symbol}</div>
                <div class="text-xs text-gray-500 dark:text-gray-600">Sharpe: {performer.sharpe_ratio}</div>
                <div class="text-xs text-gray-500 dark:text-gray-600">Sortino: {performer.sortino_ratio}</div>
              </div>
              <Star class="w-5 h-5 text-yellow-400 dark:text-yellow-300" />
            </div>
          {/each}
        </div>
      {/if}
    </div>
  
  </div>
  