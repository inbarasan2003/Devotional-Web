export function GetGoogleAccess(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!(window as any).google) {
      reject("Google not loaded");
      return;
    }

    const client = (window as any).google.accounts.oauth2.initTokenClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: "openid email profile",

      callback: (resp: any) => {
        if (resp.access_token) resolve(resp.access_token);
        else reject("No token");
      },
    });

    client.requestAccessToken();
  });
}