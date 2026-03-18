import { axiosInstance } from "./auth-Instance";

//Class To group related functions and manage them in one place.
class AuthService {

  //Stores functions to notify when logout happens
  private listeners: any[] = [];

  //Gets the token from storage
  getAccessToken() {
    return sessionStorage.getItem("authToken");
  }

  //Saves the token to storage
  setAccessToken(token: string) {
    sessionStorage.setItem("authToken", token);
  }

  //Sends the Google token to the backend and returns the app token
  async loginWithGoogle(token: string) {
    const { data } = await axiosInstance.post("/auth/google-login", {
      googleToken: token,
    });

    return data.data;
  }

  //Adds a logout listener and returns a cleanup function to remove it later
  onLogout(handler: any) {

    //add a function to a list
    //this refer the current object
    this.listeners.push(handler);

    return () => {
      this.listeners = this.listeners.filter((h) => h !== handler);
    };
  }

  //Removes the token and calls all logout listeners
  triggerLogout() {
    sessionStorage.removeItem("authToken");

    // call all listeners
    this.listeners.forEach((h) => h());
  }
}
//Creates an instance of AuthService and exports it
export const authService = new AuthService();