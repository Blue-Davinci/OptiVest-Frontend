import { superValidate, setError } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from '$lib/settings/schema.js';
import { fail} from '@sveltejs/kit';
import { VITE_API_BASE_URL_LOGIN } from '$env/static/private';

export const load = async () => {
  return {
    form: await superValidate(zod(formSchema)),
  };
};

export const actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400,{form});
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log(form.data);
    // Handle successful form submission here (e.g., saving data)
    try {
        const response = await fetch(VITE_API_BASE_URL_LOGIN, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form.data),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          return setError(form, 'email', 'E-mail already exists.');
        }
  
        const responseData = await response.json();
        console.log('API Response:', responseData);
  
        // Handle successful form submission here (e.g., saving data)
        return {
          form,
          responseData,
        };
      } catch (error) {
        console.error('Fetch Error:', error);
        return fail(500, { form, error: 'An unexpected error occurred' });
      }
  },
};
