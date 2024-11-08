<script>
    import { Users, Target, Calendar, Lock, Unlock, DollarSign, Activity, Mail, CreditCard, Receipt } from 'lucide-svelte';
    
    let {data} = $props();
    let group = $derived(data?.data?.group ?? {});
    
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };
    
    const calculateProgress = (current, target) => {
      return Math.round((parseFloat(current) / parseFloat(target)) * 100);
    };
  
    const expenses = [
      { id: 1, description: 'Office Supplies', amount: 250.00, date: '2024-03-15', category: 'Supplies', paidBy: 'John Doe' },
      { id: 2, description: 'Team Lunch', amount: 180.50, date: '2024-03-14', category: 'Food', paidBy: 'Jane Smith' },
      { id: 3, description: 'Software License', amount: 599.99, date: '2024-03-13', category: 'Technology', paidBy: 'Mike Johnson' }
    ];
  
    const transactions = [
      { id: 1, type: 'Payment', amount: 150.00, date: '2024-03-15', from: 'Alice', to: 'Bob', status: 'Completed' },
      { id: 2, type: 'Refund', amount: 75.25, date: '2024-03-14', from: 'Charlie', to: 'David', status: 'Pending' },
      { id: 3, type: 'Split', amount: 320.00, date: '2024-03-13', from: 'Eve', to: 'Frank', status: 'Completed' }
    ];
  
    const getRoleBadgeClasses = (role) => {
      const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
      switch(role) {
        case 'admin':
          return `${baseClasses} bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200`;
        case 'moderator':
          return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`;
        default:
          return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`;
      }
    };
  
    const getStatusBadgeClasses = (status) => {
      return status === 'Completed' 
        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    };
    
    let stats = $derived([
  { 
    icon: Users, 
    label: 'Members', 
    value: `${group.GroupMembers?.length ?? 0}/${group.Group?.max_member_count ?? 0}` 
  },
  { 
    icon: DollarSign, 
    label: 'Total Transactions', 
    value: group.TotalGroupTransactions ?? 0 
  },
  { 
    icon: Activity, 
    label: 'Activities', 
    value: group.Group?.activity_count ?? 0 
  }
]);
  </script>
  
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Hero Section with Fixed Height and Better Spacing -->
    <div class="relative h-96">
      <img
        src={group.Group.group_image_url}
        alt={group.Group.name}
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-black/10 via-black/50 to-black/80"></div>
      <div class="absolute bottom-0 left-0 right-0 p-8 text-white">
        <div class="max-w-7xl mx-auto">
          <div class="flex items-center gap-3 mb-2">
            <h1 class="text-4xl font-bold">{group.Group.name}</h1>
            {#if group.Group.is_private}
              <Lock class="w-6 h-6" />
            {:else}
              <Unlock class="w-6 h-6" />
            {/if}
          </div>
          <p class="text-lg text-gray-200 max-w-2xl">{group.Group.description}</p>
        </div>
      </div>
    </div>
  
    <!-- Stats Section - Moved below hero without overlap -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        {#each stats as {icon: Icon, label, value}}
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform hover:-translate-y-1 transition-all duration-300">
            <div class="flex items-center space-x-4">
              <Icon class="w-8 h-8 text-purple-600 dark:text-purple-400" />
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                <p class="text-xl font-semibold text-gray-900 dark:text-white">{value}</p>
              </div>
            </div>
          </div>
        {/each}
      </div>
  
      <!-- Group Goals -->
      <div class="mt-12">
        <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Group Goals</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {#each group.GroupGoals as goal}
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{goal.name}</h3>
                <Target class="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">{goal.description || 'No description provided'}</p>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    ${goal.current_amount} of ${goal.target_amount}
                  </span>
                  <span class="text-sm font-medium text-purple-600 dark:text-purple-400">
                    {calculateProgress(goal.current_amount, goal.target_amount)}%
                  </span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    class="bg-purple-600 dark:bg-purple-500 rounded-full h-2.5 transition-all duration-300"
                    style="width: {calculateProgress(goal.current_amount, goal.target_amount)}%"
                  ></div>
                </div>
                <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar class="w-4 h-4 mr-2" />
                  <span>Deadline: {formatDate(goal.deadline)}</span>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
  
      <!-- Members Grid - Improved Layout -->
      <div class="mt-12">
        <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Members</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {#each group.GroupMembers as member}
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300">
              <img
                src={member.profile_avatar_url}
                alt={member.first_name}
                class="w-20 h-20 rounded-full object-cover ring-4 ring-purple-500/30 dark:ring-purple-400/30 mb-4"
              />
              <h3 class="font-semibold text-gray-900 dark:text-white text-lg mb-2">{member.first_name}</h3>
              <span class={getRoleBadgeClasses(member.role)}>
                {member.role}
              </span>
            </div>
          {/each}
        </div>
      </div>
  
      <!-- Expenses Section -->
      <div class="mt-12">
        <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
          <Receipt class="w-6 h-6" />
          Recent Expenses
        </h2>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Paid By</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {#each expenses as expense}
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{expense.description}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">${expense.amount.toFixed(2)}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{expense.category}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{expense.paidBy}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{formatDate(expense.date)}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  
      <!-- Transactions Section -->
      <div class="mt-12">
        <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
          <CreditCard class="w-6 h-6" />
          Recent Transactions
        </h2>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">From</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">To</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {#each transactions as transaction}
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{transaction.type}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">${transaction.amount.toFixed(2)}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{transaction.from}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{transaction.to}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{formatDate(transaction.date)}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  
      <!-- Pending Invitations Section -->
      {#if group.PendingInvitations.length > 0}
        <div class="mt-12">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Pending Invitations</h2>
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              {group.PendingInvitations.length} pending
            </span>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg divide-y divide-gray-200 dark:divide-gray-700">
            {#each group.PendingInvitations as invitation}
              <div class="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                <div class="flex items-center space-x-4">
                  <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                    <Mail class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">{invitation.invitee_user_email}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Sent: {formatDate(invitation.sent_at)}</p>
                  </div>
                </div>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  {invitation.status}
                </span>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>

  <style></style>