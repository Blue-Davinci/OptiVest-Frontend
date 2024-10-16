// passwordConfrimPasswordSchema //  setError, message
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';
import { passwordConfrimPasswordSchema } from '$lib/settings/schema.js';


export const load = async () => {
	return {
		form: await superValidate(zod(passwordConfrimPasswordSchema))
	};
};