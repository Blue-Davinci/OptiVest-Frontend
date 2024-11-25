<script>
    import { onMount } from 'svelte';
    import { 
        Briefcase, Brain, Clock, Layout, ChartLine,
        Mail, Globe, Github, Shield,
        Users, Zap, Heart, DollarSign,
        TrendingUp, Wallet, BookOpen
    } from 'lucide-svelte';
    
    let isVisible = false;
    let activeTab = 'personal';
    
    onMount(() => {
        isVisible = true;
        startCountAnimation();
    });

    let stats = [
        { value: 0, target: 10000, label: 'Active Users', prefix: '' },
        { value: 0, target: 50, label: 'Managed Assets (M)', prefix: '$' },
        { value: 0, target: 99.9, label: 'Uptime', prefix: '', suffix: '%' }
    ];

    function startCountAnimation() {
        stats.forEach((stat, index) => {
            const duration = 2000; // 2 seconds
            const steps = 60;
            const increment = stat.target / steps;
            let current = 0;
            
            const interval = setInterval(() => {
                if (current >= stat.target) {
                    clearInterval(interval);
                    stats[index].value = stat.target;
                } else {
                    current += increment;
                    stats[index].value = Math.min(current, stat.target);
                }
                stats = stats; // Trigger reactivity
            }, duration / steps);
        });
    }

    const coreFeatures = [
        {
            icon: ChartLine,
            name: 'Advanced Portfolio Analytics',
            description: 'Real-time market analysis with AI-powered insights and risk assessment'
        },
        {
            icon: DollarSign,
            name: 'Smart Budgeting',
            description: 'Automated expense tracking and personalized savings recommendations'
        },
        {
            icon: TrendingUp,
            name: 'Investment Strategies',
            description: 'Customized investment plans based on your goals and risk tolerance'
        },
        {
            icon: Wallet,
            name: 'Expense Management',
            description: 'Comprehensive tracking and categorization of all financial transactions'
        },
        {
            icon: BookOpen,
            name: 'Financial Education',
            description: 'Interactive learning modules and real-world financial scenarios'
        },
        {
            icon: Shield,
            name: 'Security First',
            description: 'Bank-level encryption and multi-factor authentication'
        }
    ];

    const teamMembers = [
        {
            name: 'Blue Davinci',
            role: 'Founder & Lead Developer',
            image: 'https://avatars.githubusercontent.com/u/52623427?s=400&u=520ed5ce2568f7bfcdee2c5ef9ab7c1963d4daa4&v=4',
            github: 'https://github.com/Blue-Davinci',
            skills: ['Full Stack Development', 'Financial Systems', 'AI Integration']
        }
    ];

    const companyValues = [
        {
            icon: Shield,
            title: 'Trust & Security',
            desc: 'Your financial data is protected with military-grade encryption'
        },
        {
            icon: Heart,
            title: 'Customer First',
            desc: 'Every feature is designed with our users in mind'
        },
        {
            icon: Zap,
            title: 'Innovation',
            desc: 'Constantly evolving with cutting-edge technology'
        },
        {
            icon: Users,
            title: 'Community',
            desc: 'Building a supportive financial community'
        }
    ];

    function handleTabChange(tab) {
        activeTab = tab;
    }
</script>

<div class="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 dark:text-white transition-colors duration-300">
<!-- Header Section -->
<header class="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
    <!-- Animated background shapes -->
    <div class="absolute inset-0 overflow-hidden">
        <div class="absolute w-[500px] h-[500px] -top-48 -left-48 bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-3xl animate-blob"></div>
        <div class="absolute w-[500px] h-[500px] -bottom-48 -right-48 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div class="absolute w-[500px] h-[500px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
    </div>

    <!-- Geometric patterns -->
    <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');">
    </div>

    <div class="relative container mx-auto px-4 py-24">
        <div class="text-center space-y-8 max-w-6xl mx-auto">
            <!-- Logo with glow effect -->
            <div class="relative inline-block">
                <div class="absolute inset-0 bg-purple-500/20 dark:bg-purple-500/40 blur-2xl rounded-full"></div>
                <img 
                    src="/optivest-high-resolution-logo-transparent.png" 
                    alt="OptiVest Logo" 
                    class="relative mx-auto h-32 mb-8 transform hover:scale-105 transition-transform duration-300" 
                />
            </div>

            <!-- Main heading with gradient and animation -->
            <div class="space-y-6">
                <h1 class="text-6xl md:text-7xl font-bold mb-6 animate-fade-in">
                    <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 animate-gradient">
                        Revolutionizing
                    </span>
                    <br />
                    <span class="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 animate-gradient animation-delay-2000">
                        Financial Management
                    </span>
                </h1>

                <!-- Subtitle with glass effect -->
                <div class="relative group">
                    <div class="absolute inset-0 bg-white/50 dark:bg-gray-800/50 rounded-2xl blur"></div>
                    <p class="relative text-2xl md:text-3xl text-gray-700 dark:text-gray-200 max-w-3xl mx-auto leading-relaxed p-6 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20">
                        Empowering individuals and businesses to achieve their financial goals with 
                        <span class="text-purple-600 dark:text-purple-400 font-semibold">confidence</span> and 
                        <span class="text-blue-600 dark:text-blue-400 font-semibold">ease</span>.
                    </p>
                </div>

                <!-- CTA Buttons -->
                <div class="flex justify-center gap-6 mt-12">
                    <button class="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
                        Get Started
                    </button>
                    <button class="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg border border-gray-200 dark:border-gray-700">
                        Learn More
                    </button>
                </div>

                <!-- Floating stats -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                    {#each [
                        { number: '100+', label: 'Active Users' },
                        { number: '$100k+', label: 'Managed Assets' },
                        { number: '99.9%', label: 'Uptime' }
                    ] as stat}
                    <div class="backdrop-blur-md bg-white/30 dark:bg-gray-800/30 p-6 rounded-2xl border border-white/20 dark:border-gray-700/20 hover:transform hover:scale-105 transition-all duration-300">
                        <div class="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">{stat.number}</div>
                        <div class="text-gray-700 dark:text-gray-300">{stat.label}</div>
                    </div>
                    {/each}
                </div>
            </div>
        </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div class="w-6 h-10 rounded-full border-2 border-gray-600 dark:border-gray-400 flex justify-center p-2">
            <div class="w-1 h-3 bg-gray-600 dark:bg-gray-400 rounded-full animate-scroll"></div>
        </div>
    </div>
</header>

<!-- Mission Section -->
<section class="relative py-32 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-purple-50/10 dark:via-purple-900/10 to-transparent"></div>
    
    <div class="container mx-auto px-4 relative">
        <div class="max-w-5xl mx-auto">
            <!-- Section header -->
            <div class="text-center mb-16">
                <span class="text-purple-600 dark:text-purple-400 text-sm font-semibold tracking-wider uppercase">Our Purpose</span>
                <h2 class="text-4xl md:text-5xl font-bold text-blue-900 dark:text-white mt-4 mb-6">Our Mission</h2>
                <div class="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full"></div>
            </div>

            <!-- Mission content -->
            <div class="grid md:grid-cols-2 gap-12 items-center">
                <!-- Mission statement -->
                <div class="space-y-6">
                    <p class="text-2xl text-gray-700 dark:text-gray-300 leading-relaxed">
                        To democratize financial planning by offering an 
                        <span class="text-purple-600 dark:text-purple-400 font-semibold">all-in-one platform</span> 
                        for investments, budgeting, debt management, and goal tracking.
                    </p>
                    <div class="space-y-4">
                        {#each [
                            'Simplify complex financial decisions',
                            'Provide accessible financial tools',
                            'Empower financial independence',
                            'Ensure data security and privacy'
                        ] as point}
                        <div class="flex items-center space-x-3">
                            <div class="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400"></div>
                            <p class="text-gray-700 dark:text-gray-300">{point}</p>
                        </div>
                        {/each}
                    </div>
                </div>

                <!-- Visual element -->
                <div class="relative group">
                    <div class="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div class="relative bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl">
                        <div class="grid grid-cols-2 gap-6">
                            {#each [
                                { number: '24/7', label: 'Support' },
                                { number: '100%', label: 'Transparent' },
                                { number: '256-bit', label: 'Encryption' },
                                { number: 'AI', label: 'Powered' }
                            ] as stat}
                            <div class="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                <div class="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">{stat.number}</div>
                                <div class="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                            </div>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

    <!-- Why Choose OptiVest -->
    <section class="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div class="container mx-auto px-4">
            <h2 class="text-4xl font-bold text-center text-blue-900 dark:text-white mb-16">Why Choose OptiVest?</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {#each [
                    {
                        icon: Briefcase,
                        title: 'Comprehensive Financial Management',
                        description: 'A unified platform to streamline your finances.'
                    },
                    {
                        icon: Brain,
                        title: 'AI-Driven Recommendations',
                        description: 'Personalized insights powered by advanced analytics.'
                    },
                    {
                        icon: Clock,
                        title: 'Real-Time Updates',
                        description: 'Stay informed with live data integration and alerts.'
                    },
                    {
                        icon: Layout,
                        title: 'User-Friendly Dashboard',
                        description: 'Navigate your financial world effortlessly.'
                    }
                ] as feature}
                <div class="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
                    <div class="mb-6 text-purple-600 dark:text-purple-400">
                        <svelte:component this={feature.icon} size={32} />
                    </div>
                    <h3 class="text-xl font-semibold text-blue-900 dark:text-white mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {feature.title}
                    </h3>
                    <p class="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </div>
                {/each}
            </div>
        </div>
    </section>

    <!-- Core Features -->
    <section id="features" class="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div class="container mx-auto px-4">
            <div class="text-center mb-16">
                <span class="text-purple-600 dark:text-purple-400 text-sm font-semibold tracking-wider uppercase">What We Offer</span>
                <h2 class="text-4xl md:text-5xl font-bold text-blue-900 dark:text-white mt-4">Core Features</h2>
                <div class="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full mt-6"></div>
            </div>
    
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {#each coreFeatures as feature}
                <div class="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
                    <div class="mb-6 text-purple-600 dark:text-purple-400 transform group-hover:scale-110 transition-transform">
                        <svelte:component this={feature.icon} size={32} />
                    </div>
                    <h3 class="text-xl font-semibold text-blue-900 dark:text-white mb-4">{feature.name}</h3>
                    <p class="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </div>
                {/each}
            </div>
        </div>
    </section>

    <!-- Developer Section -->
<section class="py-20">
    <div class="container mx-auto px-4">
        <div class="text-center mb-16">
            <span class="text-purple-600 dark:text-purple-400 text-sm font-semibold tracking-wider uppercase">Our Team</span>
            <h2 class="text-4xl md:text-5xl font-bold text-blue-900 dark:text-white mt-4">Meet the Innovators</h2>
            <div class="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full mt-6"></div>
        </div>

        <div class="flex justify-center">
            {#each teamMembers as member}
            <div class="group max-w-2xl mx-auto text-center">
                <div class="relative mb-6">
                    <div class="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                    <img src={member.image} alt={member.name} class="relative w-48 h-48 mx-auto rounded-full shadow-2xl object-cover" />
                </div>
                <div class="text-center">
                    <h3 class="text-2xl font-bold text-blue-900 dark:text-white mb-2">{member.name}</h3>
                    <p class="text-purple-600 dark:text-purple-400 mb-4">{member.role}</p>
                    <div class="flex flex-wrap justify-center gap-2 mb-4">
                        {#each member.skills as skill}
                        <span class="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-full text-sm">
                            {skill}
                        </span>
                        {/each}
                    </div>
                    <a href={member.github} class="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 dark:text-purple-400">
                        <Github size={20} />
                        <span>GitHub Profile</span>
                    </a>
                </div>
            </div>
            {/each}
        </div>
    </div>
</section>
    

    <!-- Values Section -->
    <section class="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div class="container mx-auto px-4">
            <div class="text-center mb-16">
                <span class="text-purple-600 dark:text-purple-400 text-sm font-semibold tracking-wider uppercase">Our Principles</span>
                <h2 class="text-4xl md:text-5xl font-bold text-blue-900 dark:text-white mt-4">Company Values</h2>
                <div class="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full mt-6"></div>
            </div>
    
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {#each companyValues as value}
                <div class="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center">
                    <div class="mb-6 text-purple-600 dark:text-purple-400 transform group-hover:scale-110 transition-transform">
                        <svelte:component this={value.icon} size={36} />
                    </div>
                    <h3 class="text-xl font-semibold text-blue-900 dark:text-white mb-4">{value.title}</h3>
                    <p class="text-gray-600 dark:text-gray-300">{value.desc}</p>
                </div>
                {/each}
            </div>
        </div>
    </section>

    <!-- Contact Section -->
<!-- Contact Section -->
<section id="contact" class="py-20 bg-gradient-to-b from-blue-900 to-purple-900 text-white">
    <div class="container mx-auto px-4">
        <div class="text-center mb-16">
            <span class="text-purple-300 text-sm font-semibold tracking-wider uppercase">Get In Touch</span>
            <h2 class="text-4xl md:text-5xl font-bold mt-4 mb-6">Contact Us</h2>
            <div class="w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto rounded-full"></div>
        </div>

        <div class="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
            <!-- Contact Information -->
            <div class="space-y-8">
                <div class="text-center md:text-left">
                    <h3 class="text-2xl font-semibold mb-4">Let's Connect</h3>
                    <p class="text-gray-300">Have questions about OptiVest? We're here to help!</p>
                </div>
                
                <div class="space-y-6">
                    <a href="mailto:support@optivest.com" 
                       class="flex items-center gap-3 text-lg hover:text-purple-300 transition-colors group">
                        <Mail size={24} class="group-hover:scale-110 transition-transform" />
                        support@optivest.com
                    </a>
                    <a href="https://www.optivest.com" 
                       class="flex items-center gap-3 text-lg hover:text-purple-300 transition-colors group">
                        <Globe size={24} class="group-hover:scale-110 transition-transform" />
                        www.optivest.com
                    </a>
                </div>
            </div>

            <!-- Contact Form Link -->
            <div class="text-center md:text-left space-y-6">
                <h3 class="text-2xl font-semibold mb-4">Ready to Start?</h3>
                <p class="text-gray-300 mb-8">Fill out our detailed contact form and we'll get back to you within 24 hours.</p>
                <a href="/#contact" 
                   class="inline-block px-8 py-4 bg-white text-purple-900 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-white/25">
                    Go to Contact Form
                </a>
            </div>
        </div>
    </div>
</section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div class="text-center md:text-left">
                    <h3 class="text-lg font-semibold mb-4">About OptiVest</h3>
                    <p class="text-gray-400">Revolutionizing financial management through innovative solutions.</p>
                </div>
                <div class="text-center">
                    <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
                    <ul class="space-y-2">
                        <li><a href="#features" class="text-gray-400 hover:text-purple-400 transition-colors">Features</a></li>
                        <li><a href="/#plans" class="text-gray-400 hover:text-purple-400 transition-colors">Pricing</a></li>
                        <li><a href="#1" class="text-gray-400 hover:text-purple-400 transition-colors">Blog</a></li>
                    </ul>
                </div>
                <div class="text-center md:text-right">
                    <h3 class="text-lg font-semibold mb-4">Follow Us</h3>
                    <div class="flex justify-center md:justify-end gap-4">
                        <a href="#1" class="text-gray-400 hover:text-purple-400 transition-colors">
                            <Github size={24} />
                        </a>
                        <a href="#1" class="text-gray-400 hover:text-purple-400 transition-colors">
                            <Globe size={24} />
                        </a>
                    </div>
                </div>
            </div>
            <div class="border-t border-gray-800 pt-8 text-center">
                <p class="text-gray-400">&copy; {new Date().getFullYear()} OptiVest. All rights reserved.</p>
            </div>
        </div>
    </footer>
</div>

<style>
    /* Add any custom styles here */
    @keyframes blob {
        0% { transform: translate(0px, 0px) scale(1); }
        33% { transform: translate(30px, -50px) scale(1.1); }
        66% { transform: translate(-20px, 20px) scale(0.9); }
        100% { transform: translate(0px, 0px) scale(1); }
    }

    @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }

    @keyframes scroll {
        0% { transform: translateY(0); }
        50% { transform: translateY(6px); }
        100% { transform: translateY(0); }
    }

    .animate-blob {
        animation: blob 7s infinite;
    }

    .animate-gradient {
        animation: gradient 8s ease infinite;
        background-size: 200% 200%;
    }

    .animate-scroll {
        animation: scroll 2s ease infinite;
    }

    .animation-delay-2000 {
        animation-delay: 2s;
    }

    .animation-delay-4000 {
        animation-delay: 4s;
    }
</style>