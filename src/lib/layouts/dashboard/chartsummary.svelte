<script>
  import { BarChart } from 'layerchart';
  let { chartData } = $props();
  console.log("Chart Data: ", chartData, " || Chart Data Length: ", chartData.length);
</script>

<!-- Chart container with explicit height for LayerCake -->
<div class="text-gray-500 dark:text-gray-300 w-full h-full">
  <p class="text-lg font-semibold mb-4 text-center">Performance Chart</p>
  
  <!-- Explicit height on this div to satisfy LayerCake's requirement -->
  <div class="chart-container">
    {#if chartData && chartData.length > 0}
      <div class="h-[400px] p-4 border rounded bg-white dark:bg-gray-800">
        <BarChart
          data={chartData}
          x="month" 
          series={[
            {
              key: "income",
              color: "hsl(218, 85%, 55%)", // Light blue for income
              hover: "hsl(218, 85%, 70%)", // Lighter blue for hover effect
              props: { rounded: "top" },
            },
            {
              key: "expenses",
              value: (d) => -d.expenses,  // Diverging: negative expenses
              color: "hsl(10, 80%, 55%)",  // Red for expenses
              hover: "hsl(10, 80%, 70%)",   // Lighter red for hover effect
              props: { rounded: "bottom" },
            },
          ]}
        />
      </div>
    {:else}
      <p>No data available for the chart.</p>
    {/if}
  </div>
</div>

<style>
  /* Ensure the chart container has defined width and height */
  .chart-container {
    width: 100%;
    height: 100%; /* Explicit height for LayerCake compatibility */
  }

  /* Adjust responsive heights */
  @media (min-width: 640px) {
    .chart-container {
      height: 320px;
    }
  }

  @media (min-width: 768px) {
    .chart-container {
      height: 400px;
    }
  }
</style>
