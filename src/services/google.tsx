export function GetGoogleAccess(): Promise<string> {

  //If Google is not loaded, it rejects with an error.
  return new Promise((resolve, reject) => {
    //Checks if the google object is not available on window
    if (!(window as any).google) {
      reject("Google not loaded");
      return;
    }

    //Creates a Google OAuth client with app ID and required user details
    const client = (window as any).google.accounts.oauth2.initTokenClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: "openid email profile",

      //Handles the Google login response and returns the token or error
      callback: (resp: any) => {
        if (resp.access_token) resolve(resp.access_token);
        else reject("No token");
      },
    });

    client.requestAccessToken();
  });
}