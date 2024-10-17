/*
		event.locals.userrole = credentials.user.user_role;
		event.countrycode = credentials.userinfo.country_code;
		event.locals.currencycode = credentials.userinfo.currency_code;
		event.locals.firstname = credentials.userinfo.first_name;
        event.locals.lastname = credentials.userinfo.last_name;
		event.locals.userimg = credentials.userinfo.profile_url;
		event.locals.profilecompleted = credentials.userinfo.profile_completed;
		event.locals.isAdmin = credentials.userinfo.user_role === 'admin';
        */

export const load = async ({ locals }) => {
    let userInformation = locals.userInfromation;
    //console.log("[L.S.J] Root User:",userInformation);

    return{
        userInformation
    }
};

