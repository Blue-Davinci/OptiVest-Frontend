<script>
    import { Chart, Svg, Axis, Bars, Tooltip, Rule } from 'layerchart';
    import { scaleBand } from 'd3-scale'; // Layerchart uses d3 for scales
    let { chartData } = $props();
    console.log("Chart Data: ", chartData, " || Chart Data Length: ", chartData.length);
  </script>
  
  <!-- Chart container with explicit height for LayerCake -->
  <div class="text-gray-500 dark:text-gray-300 w-full h-full">
    <p class="text-lg font-semibold mb-4 text-center">Performance Chart</p>
    
    <!-- Explicit height on this div to satisfy LayerCake's requirement -->
    <div class="h-[300px]">
      {#if chartData && chartData.length > 0}
        <Chart
          data={chartData}
          x="month"
          xScale={scaleBand().padding(0.4)}
          y={["income", (d) => d.expenses]}
          yNice={4}
          padding={{ left: 16, bottom: 24 }}
          tooltip={{ mode: "band" }}
        >
          <Svg>
            <!-- Left axis with gridlines -->
            <Axis
              placement="left"
              grid
              rule
              format={(d) => Math.abs(d)}  
            />
            <!-- Bottom axis for months -->
            <Axis
              placement="bottom"
              format={(d) => d}  
              class="text-gray-900 dark:text-gray-300"
            />
            <!-- Bars for income (positive) -->
            <Bars
              y="income"
              radius={4}
              rounded="top"
              strokeWidth={1}
              class="fill-blue-500" 
            />
            <!-- Bars for expenses (negative) --> 
            <Bars
              y={(d) => d.expenses}
              radius={4}
              rounded="bottom"
              strokeWidth={1}
              class="fill-orange-500"  
            />
            <!-- Zero line (rule) -->
            <Rule y={0} />
          </Svg>
          
          <!-- Tooltip to display values -->
          <Tooltip.Root let:data>
            <Tooltip.Header>{data.month}</Tooltip.Header>
            <Tooltip.List>
              <Tooltip.Item label="Income" value={data.income} />
              <Tooltip.Item label="Expenses" value={Math.abs(data.expenses)} />
            </Tooltip.List>
          </Tooltip.Root>
        </Chart>
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
  