<script>
    import {
		TOAST_TYPE_ERROR,
		TOAST_TYPE_SUCCESS,
	} from '$lib/settings/constants.js';
	import { TrendingUp, Edit } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { investmentRiskandTimelineSchema } from '$lib/settings/schema.js';
	import { toastManager } from '$lib/helpers/utilities.js';
	import * as Form from '$lib/components/ui/form';

	let { data, user } = $props();
	$inspect('User', user);

    let timeHorizonType = $state(user?.time_horizon ? user.time_horizon.TimeHorizonType : '');
    let riskTolerance = $state(user?.risk_tolerance ? user.risk_tolerance.RiskTolerance : '');

	const form = superForm(data.investmentRiskAndTimeLineForm, {
		validators: zodClient(investmentRiskandTimelineSchema),
		dataType: 'json',
		invalidateAll: true,
		onUpdated({ form }) {
			if (form.message && form.message.success) {
				toastManager(TOAST_TYPE_SUCCESS, form.message.message);
			} else if (form.message && !form.message.success) {
				toastManager(TOAST_TYPE_ERROR, form.message.message);
			}
		}
	});
	const {
		form: timeRiskForm,
		enhance: timeRiskEnhance,
		message: timeRiskMessage,
		delayed: timeRiskDelayed
	} = form;
</script>

<section class="mt-6 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
	<form method="POST" action="?/investmentpreferences" use:timeRiskEnhance>
		<h2 class="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
			<TrendingUp aria-hidden="true" />
			Investment Profile
		</h2>
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
            <input type="hidden" name="originaltimeline" bind:value={timeHorizonType} />
            <input type="hidden" name="originalrisk" bind:value={riskTolerance} />
			<div>
				<div class="relative">
					<Form.Field {form} name="risk">
						<Form.Control let:attrs>
							<Form.Label class="mb-2 block font-medium text-gray-700 dark:text-gray-300"
								>Risk Tolerance</Form.Label
							>
							<select
								{...attrs}
                                bind:value={$timeRiskForm.risk}
								name="risk"
								class="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 outline-none transition-all
                           focus:border-purple-500 focus:ring-2 focus:ring-purple-200
                           dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-purple-800"
								aria-describedby="risk-tolerance-description"
							>
								<option value="">Select Risk Tolerance</option>
								<option value="low">Low risk</option>
								<option value="medium">Moderate</option>
								<option value="hi">Aggressive</option>
							</select>
						</Form.Control>
						<Form.FieldErrors class="text-sm text-red-500 mt-1" />
					</Form.Field>
				</div>
				<p id="risk-tolerance-description" class="mt-2 text-sm text-gray-500 dark:text-gray-400">
					This helps us understand your comfort level with investment risk
				</p>
			</div>
			<div>
				<div class="relative">
					<Form.Field {form} name="timeline">
						<Form.Control let:attrs>
							<Form.Label class="mb-2 block font-medium text-gray-700 dark:text-gray-300"
								>Investment Timeline</Form.Label
							>
							<select
								{...attrs}
								name="timeline"
                                bind:value={$timeRiskForm.timeline}
								class="w-full rounded-lg border border-gray-200 bg-white p-3 text-gray-900 outline-none transition-all
                           focus:border-purple-500 focus:ring-2 focus:ring-purple-200
                           dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-purple-800"
								aria-describedby="time-horizon-description"
							>
								<option value="">Select Timeline</option>
								<option value="short">Short Term</option>
								<option value="medium">Medium Term</option>
								<option value="long">Long Term</option>
							</select>
						</Form.Control>
                        <Form.FieldErrors class="text-sm text-red-500 mt-1" />
					</Form.Field>
				</div>
				<p id="time-horizon-description" class="mt-2 text-sm text-gray-500 dark:text-gray-400">
					How long do you plan to keep your investments?
				</p>
			</div>
		</div>
		<div class="flex justify-end">
			<Form.Button
				type="submit"
				disabled={$timeRiskDelayed}
				class="flex items-center gap-2 rounded-lg bg-purple-600 px-8 py-3 font-medium text-white transition-all hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-800"
			>
				{#if $timeRiskDelayed}
					<svg
						width="20"
						height="20"
						fill="currentColor"
						class="mr-2 animate-spin"
						viewBox="0 0 1792 1792"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z"
						>
						</path>
					</svg>
					Updating...
					{toastManager(TOAST_TYPE_LOADING, 'Please wait...')}
				{:else}
					<Edit size={20} />
					Update
				{/if}
			</Form.Button>
		</div>
	</form>
</section>
