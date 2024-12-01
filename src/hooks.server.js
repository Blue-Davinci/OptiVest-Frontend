import { redirect, error } from '@sveltejs/kit';
import { checkAuthentication } from '$lib/helpers/auths';

// The hook function is an async function that takes an event and a resolve function
// checks whether a user is authenticated and which path is being accessed. Depending on which,
// it will redirect the user accordingly.
export const handle = async ({ event, resolve }) => {
	// authenticated endpoints
	const authenticatedPaths = ['/dashboard', '/logout', '/account'];
	const safelistPaths = ['/login', '/signup', '/login/verify'];
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

	/*const url = new URL(event.url);
	  // Check if the requested page is /login/verify
	  if (url.pathname === '/login/verify') {
		// Get the referer URL
		const referer = event.request.headers.get('referer');
		console.log('Referer:', referer);
		// If there's no referer or it's not from page X, redirect to home
		if (!referer || !referer.endsWith('/login')) {
			console.log('Redirecting! User is not coming from login page');
			return redirect(303, `/`);
		}
	  }
	*/
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
		event.locals.userInfromation = credentials.userinfo
		console.log('[H.S.J] Event Locals User:', event.locals.userInfromation.first_name);
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
	const response = await resolve(event);

	return response;
};
