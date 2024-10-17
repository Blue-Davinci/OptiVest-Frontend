import { redirect, error } from '@sveltejs/kit';
import { checkAuthentication } from '$lib/helpers/auths';

// The hook function is an async function that takes an event and a resolve function
// checks whether a user is authenticated and which path is being accessed. Depending on which,
// it will redirect the user accordingly.
export const handle = async ({ event, resolve }) => {
	// authenticated endpoints
	const authenticatedPaths = ['/dashboard', '/logout', '/account'];
	const safelistPaths = ['/login', '/signup'];
	const requestedPath = event.url.pathname;
	let credentials = checkAuthentication(event.cookies);
	console.log('Credentials Hook: ', credentials.user);
	//console.log("Enumeration: ", !credentials.status && !credentials.user)
	// Attempt to get the client address directly
	let clientAddress;
	try {
		clientAddress = event.getClientAddress();
	} catch (error) {
		console.error('Error determining client address:', error);
	}

	// Fallback to checking the 'X-Forwarded-For' header if direct access fails
	if (!clientAddress) {
		const forwardedFor = event.request.headers.get('x-forwarded-for');
		clientAddress = forwardedFor ? forwardedFor.split(',')[0] : 'Unknown';
	}
	console.log('[H.S.J] Request is accessing:', requestedPath === '/' ? '/Home' : requestedPath);
	console.log('[H.S.J] Received connection from: ', clientAddress);
	// Check if the requested path requires authentication or route is safef listed
	const requiresAuth = authenticatedPaths.some((path) => requestedPath.includes(path));
	console.log('Auth Path: ', requiresAuth);
	const isSafelist = safelistPaths.some((path) => requestedPath.includes(path));
	// Check if user is authenticated for every request and accessing specified paths
	if (!credentials.status && !credentials.user && requiresAuth) {
		console.log('Redirecting! User is not authenticated');
		if (requestedPath.includes('/api')) {
			console.log(
				'Redirecting! User is not authenticated and trying to access api: ',
				requestedPath
			);
			return redirect(303, `/login?redirectTo=/dashboard`);
		}
		return redirect(303, `/login?redirectTo=${requestedPath}`);
	} else if (credentials.status && credentials.user) {
		// otherwise if logged in and trying to access safelisted paths eg login or signup then
		// we redirect them to the home page
		if (isSafelist) {
			console.log('Redirecting! Autheneticated user but trying to acces safelisted path');
			return redirect(303, `/`);
		}
		// proceed with writting the locals
		// we also set the user's name and their img data.
		/*
		    country_code: 'KE',
    currency_code: 'USD',
    first_name: 'john',
    last_name: 'doe',
    profile_completed: 'true',
    profile_url: 'https://res.cloudinary.com/djg9a13ka/image/upload/v1721808901/avatars/avatar_1721808896310.png',
    user_role: 'regular'
		*/
		event.locals.userInfromation = credentials.userinfo
		// add isAdmin
		event.locals.isAdmin = credentials.userinfo.user_role === 'admin';
		// Safeguard the "/admin" path
		if (requestedPath.includes('/admin') && !event.locals.isAdmin) {
			console.log('Access denied! User is not an admin and trying to access admin path');
			return error(403, {
				title: 'Access Denied',
				message: `You do not have permission to access this page.`,
				info: 'Please contact your administrator if you believe this is a mistake.'
			});
		}
	}
	console.log('[H.S.J] Event Locals User:', event.locals.userInfromation.first_name);
	const response = await resolve(event);

	return response;
};