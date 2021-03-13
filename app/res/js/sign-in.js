let auth2 = null;
gapi.load("auth2", () => {
    let clientId = document.head.querySelector("meta[name='google-signin-client_id']").content;
    auth2 = gapi.auth2.init({
        client_id: clientId,
        cookiepolicy: "single_host_origin"
    });
    
    let signInButton = document.getElementById("shp-google-sign-in");
    auth2.attachClickHandler(signInButton, { }, (googleUser) => {
        console.log(`Signed in as ${googleUser.getBasicProfile().getName()}!`);
    }, (error) => {
        console.log("Error signing in:");
        console.log(error);
    });
});