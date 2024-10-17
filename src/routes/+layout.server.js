
export const load = async ({ locals }) => {
    let userInformation = locals.userInfromation;
    //console.log("[L.S.J] Root User:",userInformation);

    return{
        userInformation
    }
};

