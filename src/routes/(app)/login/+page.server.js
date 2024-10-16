import { superValidate, setError, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from '$lib/settings/schema.js';
import { fail} from '@sveltejs/kit';
import { VITE_API_BASE_URL_LOGIN } from '$env/static/private';
import { saveAuthentication } from '$lib/helpers/auths.js';

export const load = async () => {
  return {
    form: await superValidate(zod(formSchema)),
  };
};

export const actions = {
  default: async ({ request, cookies }) => {
    const form = await superValidate(request, zod(formSchema));
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
          // check if error is due to email or due to password and
          // set the error accordingly: { error: { email: 'must be a valid email address' } }
          if (errorData.error.email) {
            return setError(form, 'email', errorData.error.email);
          }else if (errorData.error.password) {
            return setError(form, 'password', errorData.error.password);
          }else{
            return message(form,{
              message:  errorData.error,
              status: "failure"
            }, {
              status: 403
            })
          }
        }
  
        const responseData = await response.json();
        console.log('API Response:', responseData);
        let isSuccesfulAuth = saveAuthentication(cookies, responseData.api_key, responseData.user);
        if (isSuccesfulAuth) {
					//successfulAuth();
					// console.log('[page.server.js] LOGIN Url Path: ', redirectTo);
          return message(
            form,
            {
              message: 'Login successful!',
              data: responseData.user,
              status: 'success',
            },
          );
				} else {
					return setError(form, 'password', 'could not persist user');;
				}
  

      } catch (error) {
        console.error('Fetch Error:', error);
        return fail(500, { form, error: 'An unexpected error occurred' });
      }
  },
};
