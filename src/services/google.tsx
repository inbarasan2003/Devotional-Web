export function GetGoogleAccess(): Promise<string> {
  return new Promise((resolve, reject) => {

    if (!(window as any).google) {
      reject(new Error("Google Identity Services not loaded"));
      return;
    }

    const client = (window as any).google.accounts.oauth2.initTokenClient({
      client_id:
        "745458751291-a67e777eqc0so95179i8mto5gabk2bjf.apps.googleusercontent.com",
      scope: "openid email profile",

      callback: (resp: any) => {
        if (resp?.access_token) resolve(resp.access_token);
        else reject(new Error("No access token from Google"));
      },
    });

    client.requestAccessToken();
  });
}