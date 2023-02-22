import * as Realm from "realm-web";
import { addUser, getUser } from "../../service";
import { app } from "../../service/mongoDB-sdk";
import {
  handleLogin,
  handleLogout,
  handleAuthenticationErrors,
} from "../../state/actions/authentication";

//User registration is successful, dispatch the action to update the user profile.
const useAuthentication = (dispatch) => {
  function handleUserRegistration(newUser) {
    const userProfile = {
      ...newUser,
      password: undefined,
      confirm_password: undefined,
    };
    return new Promise((resolve) => {
      app.emailPasswordAuth
        .registerUser(newUser.email, newUser.password)
        .then(() => {
          const credentials = Realm.Credentials.emailPassword(
            newUser.email,
            newUser.password
          );
          app.logIn(credentials).then((user) => {
            addUser(userProfile);
            dispatch(handleLogin(userProfile));
            resolve(user);
          });
        })
        .catch((err) => dispatch(handleAuthenticationErrors(err)));
    });
  }
  async function handleUserLogout() {
    console.dir(app.currentUser);
    app.currentUser
      ?.logOut()
      .then(() => {
        dispatch(handleLogout());
        console.log("user successfully log out");
      })
      .catch((err) => console.log(err));
  }
  async function handleUserLogin(email, password) {
    return new Promise((resolve) => {
      app
        .logIn(Realm.Credentials.emailPassword(email, password))
        .then(async () => {
          // verify current user
          const currentUser = await app.currentUser;
          // retrieve user profile
          getUser(currentUser).then((userProfile) => {
            console.log(userProfile)
            dispatch(handleLogin(userProfile));
            resolve(userProfile);
          });
        })
        .catch((err) => dispatch(handleAuthenticationErrors(err)));
    });
  }

  async function handleAuthentication() {
    const currentUser = await app.currentUser;
    return new Promise(resolve => {
      getUser(currentUser)
      .then((userProfile) => {
        resolve(userProfile)
        dispatch(handleLogin(userProfile))
      })
      .catch((err) => dispatch(handleAuthenticationErrors(err)));
    })
  }

  return {
    handleUserRegistration,
    handleUserLogout,
    handleUserLogin,
    handleAuthentication,
  };
};

export default useAuthentication;
