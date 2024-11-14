import { redirect } from '@sveltejs/kit';

export const load = async({ url }) => {
    const email = url.searchParams.get('email') ?? '';
    const groupID = url.searchParams.get('groupID') ?? '';

    // if any is missing, return redirect back to /dashboard
    if (email === '' || groupID === ''){
        return redirect('/dashboard');
    }
}