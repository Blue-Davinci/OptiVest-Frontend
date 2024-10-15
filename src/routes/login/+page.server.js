import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from '$lib/settings/schema.js';

export const load = async () => {
  return {
    form: await superValidate(zod(formSchema)),
  };
};

export const actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return {
        status: 400,
        form,
      };
    }
    console.log(form);
    // Handle successful form submission here (e.g., saving data)
    return {
      form,
    };
  },
};
