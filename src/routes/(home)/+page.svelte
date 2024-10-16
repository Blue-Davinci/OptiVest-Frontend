<script>
        import { fly, slide } from 'svelte/transition';
    import Header from '$lib/layouts/landing/header.svelte';
    import Features from '$lib/layouts/landing/features.svelte';
    import AdvancedFeatures from '$lib/layouts/landing/advancedfeatures.svelte';
    import Plans from '$lib/layouts/landing/plans.svelte';
    import UserStories from '$lib/layouts/landing/userstories.svelte';
    import ContactUs from '$lib/layouts/landing/contactus.svelte';
    import Footer from '$lib/layouts/landing/footer.svelte';
</script>


<div in:fly={{ x: -200, duration: 1000 }} out:slide={{ duration: 400 }}>
  <Header />
  <Features />
  <AdvancedFeatures />
  <Plans />
  <UserStories />
  <ContactUs />
  <Footer />
</div>




<!-- Contact Us Section -->

