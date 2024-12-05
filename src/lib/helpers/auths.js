import { encrypt, decrypt } from '$lib/helpers/encryption.js';


function checkAuthentication(cookies) {
	//we check if the user has a cookie;
	//if the user has a cookie and it's valid we return an object {status: true, user: user}
	//otherwise we return {status: false}
	let user = cookies.get('authtoken');
	let authexpiry = cookies.get('authexpiry');
	// we return a parsed user object
	let userInfo = cookies.get('user');
	let parsedUserInfo = {};
	if (userInfo) {
		parsedUserInfo = JSON.parse(userInfo);
	}
	if (!user || user === null) {
		return { status: false };
	} else {
		return { status: true, user: decrypt(user), authexpiry: authexpiry, userinfo: parsedUserInfo };
	}
}

function updateAuthentication(cookies, key, value) {
	try {
		// we get our user info
		let cookieInfo = checkAuthentication(cookies);
		if (!cookieInfo) {
			return false;
		}
		let userInfo = cookieInfo.userinfo;
		console.log('Cookie info before Update: ', cookieInfo, 'Key: ', key, 'Value: ', value);
		let apikey = { token: cookieInfo.user, expiry: cookieInfo.authexpiry };
		if (Object.prototype.hasOwnProperty.call(userInfo, key)) {
			console.log('User Info before update: ', userInfo);
			userInfo[key] = value;
			console.log('User Info after update: ', userInfo);
			// call saveAuthentication to save the updated user info
			// NOTE: we set the last parameter to true to indicate that we are updating the profile
			saveAuthentication(cookies, apikey, userInfo, true);
		}
		return true;
	} catch (err) {
		console.log('Error saving authentication: ', err);
		return false;
	}
}
// saveAuthentication() saves the user's authentication information to cookies
// we save the user's authentication token and the user's information to cookies
// This function also takes in an optional parameter isProfileUpdate which is set to false by default
// This parameter is used to determine if the user is updating their profile
// If they are, we skip the step for setting the apiKEY as it requires an expiry date
function saveAuthentication(cookies, apikey, user, isProfileUpdate = false) {
	//console.log("Profile Update Status: ",apikey, user, isProfileUpdate);
	try {
		if (!user) {
			return false;
		}
		// save a special auth cookie for the user
		// we check if the user is updating their profile, if so we skip this step
		if (!isProfileUpdate) {
			cookies.set('authtoken', encrypt(apikey.token), {
				path: '/',
				expires: new Date(apikey.expiry),
				secure: true,
				sameSite: 'None'
			});

			cookies.set('authexpiry', apikey.expiry, {
				path: '/',
				expires: new Date(apikey.expiry),
				secure: true,
				sameSite: 'None'
			});
		}
		// we serialize the user object and save it as a cookie
		let serializedUser = JSON.stringify(user);
		// save the user's name as a cookie too.
		// ToDo change this to original name!
		cookies.set('user', serializedUser, {
			// Corrected the placement of the closing parenthesis
			path: '/',
			expires: new Date(apikey.expiry),
			secure: true,
			sameSite: 'None'
		});
		return true;
	} catch (err) {
		console.log('Error saving authentication: ', err);
		return false;
	}
}
/* / Simple function to extract the username from the email
function extractUsername(email){
    console.log("getting email: ", email);
    return email.split('@')[0];
}
*/
// Delete authentication cookies
function deleteAuthentication(cookies) {
	try {
		cookies.delete('authtoken', { path: '/' });
		cookies.delete('username', { path: '/' });
		return true;
	} catch (err) {
		console.log('Error logging out', err);
		return false;
	}
}

export {
    checkAuthentication,
    updateAuthentication,
    saveAuthentication,
    deleteAuthentication
}