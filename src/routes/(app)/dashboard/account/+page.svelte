<script>
    import { 
        Settings, User, Award, Clock, TrendingUp, 
        Camera, Edit3, DollarSign, MapPin, Mail,
        ChevronRight, CreditCard, Wallet, PieChart,
        Activity, Calendar
    } from 'lucide-svelte';

    let {data} = $props();
    let accountStats = $derived(data?.data?.accountStats?.AccountStats || {});
    let awards = $derived(data?.data?.awards);
    let userInfo = $derived(data?.userInformation || {});
    let user = $derived(data?.data?.user || {});
    
    // Image selection related state
    let selectedFile = null;
    let previewUrl = $state(data.userInformation.profile_url);
    let showSuggestions = $state(false);
    let roboHashSuggestions = [1, 2, 3, 4].map(num => `https://robohash.org/${userInfo.first_name || 'user'}${num}`);

    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            selectedFile = file;
            previewUrl = URL.createObjectURL(file);
            showSuggestions = false;
        }
    }

    function selectRoboHashImage(url) {
        previewUrl = url;
        showSuggestions = false;
        // Here you would typically make an API call to update the profile image
    }

    function toggleSuggestions() {
        showSuggestions = !showSuggestions;
    }

    function updateProfile(event) {
        console.log('Profile update triggered');
    }

    // Mock activity timeline data
    const activities = [
        { 
            type: 'budget',
            description: 'Created new budget',
            amount: '$500',
            date: '2 hours ago'
        },
        {
            type: 'expense',
            description: 'Added new expense',
            amount: '$75',
            date: 'Yesterday'
        },
        {
            type: 'goal',
            description: 'Achieved savings goal',
            amount: '$1,000',
            date: '3 days ago'
        }
    ];
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Enhanced Header Section with Financial Overview -->
    <header class="bg-gradient-to-r from-purple-600 to-purple-800 pb-32">
        <div class="container mx-auto px-4 py-8">
            <div class="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                <div class="flex items-center gap-6">
                    <div class="relative group">
                        <div class="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
                            <img 
                                src={previewUrl} 
                                alt="Profile" 
                                class="w-full h-full object-cover"
                            />
                        </div>
                        <div class="absolute -bottom-2 right-0 flex gap-2">
                            <button 
                                class="bg-white dark:bg-gray-800 p-2 rounded-full text-purple-600 dark:text-purple-400 shadow-lg hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors"
                                onclick={() => document.getElementById('imageUpload').click()}
                            >
                                <Camera size={20} />
                            </button>
                            <button 
                                class="bg-white dark:bg-gray-800 p-2 rounded-full text-purple-600 dark:text-purple-400 shadow-lg hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors"
                                onclick={toggleSuggestions}
                            >
                                <User size={20} />
                            </button>
                        </div>
                        <input 
                            type="file" 
                            id="imageUpload" 
                            class="hidden" 
                            accept="image/*"
                            onchange={handleImageUpload}
                        />
                        
                        {#if showSuggestions}
                        <div class="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg z-10 w-64">
                            <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Suggested Avatars</h3>
                            <div class="grid grid-cols-2 gap-3">
                                {#each roboHashSuggestions as suggestion}
                                    <button 
                                        class="relative rounded-lg overflow-hidden border-2 border-transparent hover:border-purple-500 transition-all"
                                        onclick={() => selectRoboHashImage(suggestion)}
                                    >
                                        <img 
                                            src={suggestion} 
                                            alt="Avatar suggestion" 
                                            class="w-full h-24 object-cover"
                                        />
                                    </button>
                                {/each}
                            </div>
                        </div>
                        {/if}
                    </div>
                    <!-- Rest of the header content remains unchanged -->
                    <div>
                        <h1 class="text-3xl font-bold text-white mb-1">
                            {userInfo.first_name} {userInfo.last_name}
                        </h1>
                        <div class="flex items-center gap-2 text-purple-100">
                            <Mail size={16} />
                            <span>{user.email}</span>
                        </div>
                        <div class="flex items-center gap-2 text-purple-100 mt-1">
                            <MapPin size={16} />
                            <span>{user.country_code}</span>
                        </div>
                    </div>
                </div>
                <!-- Rest of the component remains exactly the same -->
                <!-- Enhanced Account Rating -->
                <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                    <div class="flex items-center justify-center gap-3 mb-2">
                        <Award class="text-yellow-300" size={28} />
                        <h2 class="text-white text-xl font-semibold">Account Rating</h2>
                    </div>
                    <p class="text-4xl font-bold text-white">
                        {Number(data.data.accountStats.AccountRating).toFixed(2)}
                    </p>
                    <p class="text-purple-100 mt-2">Based on your activity</p>
                </div>
            </div>
            
            <!-- Financial Quick Stats -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div class="flex items-center gap-2 text-purple-100 mb-2">
                        <Wallet size={20} />
                        <span>Total Income</span>
                    </div>
                    <p class="text-2xl font-bold text-white">${accountStats.TotalIncomeAmount}</p>
                </div>
                <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div class="flex items-center gap-2 text-purple-100 mb-2">
                        <CreditCard size={20} />
                        <span>Total Expenses</span>
                    </div>
                    <p class="text-2xl font-bold text-white">${accountStats.TotalExpenseAmount}</p>
                </div>
                <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div class="flex items-center gap-2 text-purple-100 mb-2">
                        <PieChart size={20} />
                        <span>Active Budgets</span>
                    </div>
                    <p class="text-2xl font-bold text-white">{accountStats.TotalBudgets}</p>
                </div>
                <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div class="flex items-center gap-2 text-purple-100 mb-2">
                        <TrendingUp size={20} />
                        <span>Active Goals</span>
                    </div>
                    <p class="text-2xl font-bold text-white">{accountStats.TotalGoals}</p>
                </div>
            </div>
        </div>
    </header>

    <main class="container mx-auto px-4 -mt-24">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Financial Overview Stats -->
            <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h2 class="text-xl font-bold mb-6 text-gray-900 dark:text-white">Financial Overview</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6">
                        <h3 class="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-4">Income Sources</h3>
                        <div class="space-y-4">
                            <div>
                                <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    <span>Total Sources</span>
                                    <span>{accountStats.TotalIncomeSources}</span>
                                </div>
                                <div class="flex justify-between text-lg font-semibold text-purple-900 dark:text-purple-100">
                                    <span>Total Amount</span>
                                    <span>${accountStats.TotalIncomeAmount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-6">
                        <h3 class="text-lg font-semibold text-pink-900 dark:text-pink-100 mb-4">Expenses</h3>
                        <div class="space-y-4">
                            <div>
                                <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    <span>Total Expenses</span>
                                    <span>{accountStats.TotalExpenses}</span>
                                </div>
                                <div class="flex justify-between text-lg font-semibold text-pink-900 dark:text-pink-100">
                                    <span>Total Amount</span>
                                    <span>${accountStats.TotalExpenseAmount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-6">
                        <h3 class="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-4">Budgets</h3>
                        <div class="space-y-4">
                            <div>
                                <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    <span>Active Budgets</span>
                                    <span>{accountStats.TotalBudgets}</span>
                                </div>
                                <div class="flex justify-between text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                                    <span>Average Amount</span>
                                    <span>${Number(accountStats.AvgBudgetAmount).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                        <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">Goals</h3>
                        <div class="space-y-4">
                            <div>
                                <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    <span>Active Goals</span>
                                    <span>{accountStats.TotalGoals}</span>
                                </div>
                                <div class="flex justify-between text-lg font-semibold text-blue-900 dark:text-blue-100">
                                    <span>Average Progress</span>
                                    <span>{Number(accountStats.AvgGoalProgress).toFixed(1)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Profile Completion -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">Profile Completion</h2>
                <div class="mb-4">
                    <div class="flex justify-between mb-2">
                        <span class="text-gray-600 dark:text-gray-400">Overall Progress</span>
                        <span class="font-medium dark:text-white">{accountStats.ProfileCompletion}%</span>
                    </div>
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                            class="bg-purple-500 h-2 rounded-full" 
                            style="width: {accountStats.ProfileCompletion}%"
                        ></div>
                    </div>
                </div>
                <ul class="space-y-3">
                    <li class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <User size={16} />
                        <span>Basic Info</span>
                        <span class="ml-auto">✓</span>
                    </li>
                    <li class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Settings size={16} />
                        <span>Preferences</span>
                        <span class="ml-auto">✓</span>
                    </li>
                    <li class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <TrendingUp size={16} />
                        <span>Investment Profile</span>
                        <span class="ml-auto">...</span>
                    </li>
                </ul>
            </div>
        </div>

        <!-- Activity Timeline -->
        <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mt-6">
            <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <Activity />
                Recent Activity
            </h2>
            <div class="space-y-4">
                {#each activities as activity}
                    <div class="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div class="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-full">
                            {#if activity.type === 'budget'}
                                <Wallet class="text-purple-600 dark:text-purple-400" size={20} />
                            {:else if activity.type === 'expense'}
                                <CreditCard class="text-purple-600 dark:text-purple-400" size={20} />
                            {:else}
                                <TrendingUp class="text-purple-600 dark:text-purple-400" size={20} />
                            {/if}
                        </div>
                        <div class="flex-1">
                            <div class="flex justify-between">
                                <h3 class="font-medium text-gray-900 dark:text-white">{activity.description}</h3>
                                <span class="text-purple-600 dark:text-purple-400 font-medium">{activity.amount}</span>
                            </div>
                            <p class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <Clock size={14} />
                                {activity.date}
                            </p>
                        </div>
                    </div>
                {/each}
            </div>
        </section>

        <!-- Enhanced Awards Section -->
        <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mt-6">
            <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <Award />
                Your Achievements
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each awards as award}
                    <div class="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 transform hover:scale-105 transition-transform">
                        <div class="flex items-center gap-4 mb-4">
                            <img src={award.award_image_url} alt={award.code} class="w-16 h-16"/>
                            <div>
                                <h3 class="font-semibold text-gray-900 dark:text-white">
                                    {award.code.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </h3>
                                <div class="inline-flex items-center px-2 py-1 bg-purple-200 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium mt-1">
                                    {award.points} points
                                </div>
                            </div>
                        </div>
                        <p class="text-sm text-gray-600 dark:text-gray-400">{award.description}</p>
                        <div class="mt-4 flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                            <Calendar size={14} />
                            <span>Earned on {new Date(award.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                {/each}
            </div>
        </section>

        <!-- Enhanced Investment Preferences -->
        <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mt-6">
            <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp />
                Investment Profile
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label for="" class="block text-gray-700 dark:text-gray-300 font-medium mb-2">Risk Tolerance</label>
                    <select 
                        class="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 outline-none transition-all"
                        value={user.risk_tolerance?.RiskToleranceType || ''}
                    >
                        <option value="">Select Risk Tolerance</option>
                        <option value="conservative">Conservative</option>
                        <option value="moderate">Moderate</option>
                        <option value="aggressive">Aggressive</option>
                    </select>
                    <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        This helps us understand your comfort level with investment risk
                    </p>
                </div>
                <div>
                    <label for="" class="block text-gray-700 dark:text-gray-300 font-medium mb-2">Investment Timeline</label>
                    <select 
                        class="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 outline-none transition-all"
                        value={user.time_horizon?.TimeHorizonType || ''}
                    >
                        <option value="">Select Timeline</option>
                        <option value="short">Short Term</option>
                        <option value="medium">Medium Term (5-10 years)</option>
                        <option value="long">Long Term (> 10 years)</option>
                    </select>
                    <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        How long do you plan to keep your investments?
                    </p>
                </div>
            </div>
        </section>

        <!-- Enhanced Profile Settings -->
        <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mt-6">
            <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <Settings />
                Profile Settings
            </h2>
            <form onsubmit={updateProfile} class="space-y-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label for="first_name" class="block text-gray-700 dark:text-gray-300 font-medium mb-2">First Name</label>
                        <input 
                            id="first_name"
                            type="text" 
                            value={userInfo.first_name}
                            class="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label for="" class="block text-gray-700 dark:text-gray-300 font-medium mb-2">Last Name</label>
                        <input 
                            type="text" 
                            value={userInfo.last_name}
                            class="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label for="" class="block text-gray-700 dark:text-gray-300 font-medium mb-2">Phone Number</label>
                        <input 
                            type="tel" 
                            value={user.phone_number}
                            class="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label for="" class="block text-gray-700 dark:text-gray-300 font-medium mb-2">Date of Birth</label>
                        <input 
                            type="date" 
                            value={user.dob?.split('T')[0]}
                            class="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label for="" class="block text-gray-700 dark:text-gray-300 font-medium mb-2">Country</label>
                        <select 
                            class="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 outline-none transition-all"
                            value={userInfo.country_code}
                        >
                            <option value="KE">Kenya</option>
                            <option value="US">United States</option>
                            <option value="GB">United Kingdom</option>
                        </select>
                    </div>
                    <div>
                        <label for="" class="block text-gray-700 dark:text-gray-300 font-medium mb-2">Currency</label>
                        <select 
                            class="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 outline-none transition-all"
                            value={userInfo.currency_code}
                        >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                            <option value="KES">KES</option>
                        </select>
                    </div>
                    <div class="md:col-span-2">
                        <label for="" class="block text-gray-700 dark:text-gray-300 font-medium mb-2">Address</label>
                        <input 
                            type="text" 
                            value={user.address}
                            class="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 outline-none transition-all"
                        />
                    </div>
                </div>
                <div class="flex justify-end">
                    <button 
                        type="submit"
                        class="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all font-medium flex items-center gap-2"
                    >
                        <Edit3 size={20} />
                        Save Changes
                    </button>
                </div>
            </form>
        </section>
    </main>
</div>

<style>
    /* Add any additional custom styles here */
</style>