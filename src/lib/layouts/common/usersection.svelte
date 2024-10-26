<script>
	let { 
        userInfo,
        info = 'Track your financial goals and progress'
     } = $props();
</script>

{#if userInfo}
	<div class="mb-8 flex items-center gap-4">
		<img
			src={userInfo.profile_url}
			alt="Profile"
			class="h-16 w-16 rounded-full border-2 border-primary object-cover shadow-lg"
		/>
		<div>
			<h1 class="text-2xl font-bold">
				Welcome, {userInfo.first_name}
				{userInfo.last_name}
			</h1>
			<p class="text-muted-foreground">{info}</p>
		</div>
	</div>
{/if}
