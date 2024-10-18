<script>
  // Sample data for the dashboard cards
  let stats = [
    { title: 'Total Users', value: 1200, icon: '👥' },
    { title: 'Revenue', value: '$45,000', icon: '💰' },
    { title: 'New Orders', value: 342, icon: '📦' },
    { title: 'Support Tickets', value: 18, icon: '🎫' }
  ];
</script>

<div class="min-h-screen bg-gray-100 p-8">
  <!-- Dashboard Heading -->
  <div class="mb-6">
    <h1 class="text-3xl font-semibold text-gray-700">Dashboard</h1>
    <p class="text-gray-500">Overview of your platform metrics</p>
  </div>

  <!-- Stats Cards -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {#each stats as stat}
      <div class="bg-white shadow-md rounded-lg p-6 flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold text-gray-700">{stat.title}</h2>
          <p class="text-2xl font-bold text-gray-900">{stat.value}</p>
        </div>
        <div class="text-4xl">{stat.icon}</div>
      </div>
    {/each}
  </div>

  <!-- Recent Activity Section -->
  <div class="mt-8">
    <h2 class="text-2xl font-semibold text-gray-700 mb-4">Recent Activity</h2>
    <div class="bg-white shadow-md rounded-lg p-6">
      <p class="text-gray-600">No recent activity to display at the moment.</p>
    </div>
  </div>
</div>

<style>
  /* Add any additional styles here */
</style>