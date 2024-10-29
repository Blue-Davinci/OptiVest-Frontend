
<script>
    import { onMount } from 'svelte';
    let placeholderImage = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
    
    // Typing animation state
    let displayText = $state('');
    let fullText = 'Expert Guidance to Optimize Your Financial Growth and Security';
    let typewriterComplete = $state(false);

    onMount(() => {
        // Start the typing animation
        let index = 0;
        const typeInterval = setInterval(() => {
            if (index < fullText.length) {
                displayText += fullText[index];
                index++;
            } else {
                clearInterval(typeInterval);
                typewriterComplete = true;
            }
        }, 50);
    });
</script>

<section class="relative bg-gradient-to-b from-blue-900 to-black py-20 overflow-hidden">
    <!-- Animated background particles -->
    <div class="absolute inset-0 overflow-hidden">
        <div class="particles-container animate-float"></div>
    </div>

    <!-- Animated gradient overlay -->
    <div class="absolute inset-0 bg-gradient-to-r from-blue-900/50 via-purple-900/50 to-blue-900/50 animate-gradient-x"></div>

    <div class="container relative mx-auto px-4">
        <div class="flex flex-col items-center text-center">
            <!-- Animated heading with typewriter effect -->
            <h1 class="mb-6 max-w-3xl text-4xl font-bold text-white md:text-5xl opacity-0 animate-fade-in">
                {displayText}
                <span class="typing-cursor" class:hidden={typewriterComplete}>|</span>
            </h1>

            <!-- Animated paragraph with fade-in and slide-up -->
            <p class="mb-8 max-w-2xl text-lg text-white md:text-xl opacity-0 animate-fade-in-up delay-500">
                Our expert guidance will optimize your financial portfolio and lay the foundation for a
                secure and prosperous future.
            </p>

            <!-- Animated buttons with enhanced hover effects -->
            <div class="mb-12 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 opacity-0 animate-fade-in-up delay-700">
                <a
                    href="#get-started"
                    class="group relative overflow-hidden rounded-md bg-blue-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:scale-105"
                >
                    <span class="relative z-10">Get Started</span>
                    <div class="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-blue-500 to-blue-700 transition-transform duration-500 ease-out"></div>
                </a>
                <a
                    href="#learn-more"
                    class="group relative overflow-hidden rounded-md border border-white px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-white hover:text-blue-600 hover:shadow-lg hover:scale-105"
                >
                    <span class="relative z-10">Visit Github</span>
                    <div class="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-white transition-transform duration-500 ease-out"></div>
                </a>
            </div>

            <!-- Animated image container with floating effect -->
            <div class="w-full max-w-4xl opacity-0 animate-fade-in-up delay-1000">
                <div class="relative group">
                    <img
                        src={placeholderImage}
                        alt="Finanzen Dashboard Preview"
                        class="w-full rounded-lg shadow-xl transition-all duration-700 group-hover:scale-[1.02] group-hover:shadow-2xl animate-float"
                    />
                    <!-- Glare effect -->
                    <div class="absolute inset-0 rounded-lg bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
    /* Particle animation */
    .particles-container::before,
    .particles-container::after {
        content: '';
        position: absolute;
        width: 2px;
        height: 2px;
        background: white;
        box-shadow: 0 0 20px white;
        border-radius: 50%;
    }

    .particles-container::before {
        animation: particleLeft 15s infinite linear;
    }

    .particles-container::after {
        animation: particleRight 15s infinite linear;
    }

    /* Typing cursor animation */
    .typing-cursor {
        animation: blink 1s step-end infinite;
    }

    @keyframes blink {
        from, to { opacity: 1; }
        50% { opacity: 0; }
    }

    /* Floating animation */
    @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }

    /* Gradient animation */
    @keyframes gradient-x {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
    }

    /* Particle animations */
    @keyframes particleLeft {
        0% { transform: translate(0, 0) rotate(0deg); }
        100% { transform: translate(-1000px, 1000px) rotate(360deg); }
    }

    @keyframes particleRight {
        0% { transform: translate(0, 0) rotate(0deg); }
        100% { transform: translate(1000px, -1000px) rotate(-360deg); }
    }

    /* Utility animations */
    .animate-float {
        animation: float 6s ease-in-out infinite;
    }

    .animate-gradient-x {
        animation: gradient-x 15s ease infinite;
        background-size: 400% 400%;
    }

    .animate-fade-in {
        animation: fadeIn 1s ease-out forwards;
    }

    .animate-fade-in-up {
        animation: fadeInUp 1s ease-out forwards;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Delay utilities */
    .delay-500 {
        animation-delay: 500ms;
    }

    .delay-700 {
        animation-delay: 700ms;
    }

    .delay-1000 {
        animation-delay: 1000ms;
    }
</style>
