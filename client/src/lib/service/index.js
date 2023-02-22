import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

//fetch products from the server
export const getProducts = () => {
  return new Promise((onSuccess, onFail) => {
    axios
      .get("/api/products")
      .then((response, error) => {
        if (!response || error) {
          return onFail(`Response failure : ${error}`);
        }
        onSuccess(response);
      })
      .catch((err) => onFail(err));
  });
};

//Get the user's name and id from the message body.

export const getUser = (body) => {
  return new Promise((onSuccess, onFail) => {
    console.log(body.profile) // realm return an object with user's profile details and email, we use the email to identify the user connected and retrieve profile details
    // check the object in the console to see properties
    axios
      .get(`/api/user/${body.profile.email}`,  {
        params: {
          email: body.profile.email
        }
      }) 
      .then((response, error) => {
        if (!response || error) {
          return onFail(`Response failure : ${error}`);
        }
        onSuccess(response.data);
      })
      .catch((err) => onFail(err));
  });
};

//Add a user to the database.
export const addUser = (body) => {
  return new Promise((onSuccess, onFail) => {
    axios
      .post("/api/users/add", body)
      .then((response, error) => {
        if (!response || error) {
          return onFail(`Response failure : ${error}`);
        }
        onSuccess(`user profile successfully created`);
      })
      .catch((err) => onFail(err));
  });
};

//Add order to database
export const addOrder = (body) => {
  return new Promise((onSuccess, onFail) => {
    axios
      .post("/api/orders/add", body)
      .then((response, error) => {
        if (!response || error) {
          return onFail(`Response failure : ${error}`);
        }
        onSuccess(`order successfully saved`);
      })
      .catch((err) => onFail(err));
  });
};

//Create a new payment intent Stripe if one does not exist already
export const processPayment = async (order) => {
  var stripePromise = loadStripe("pk_test_Y5ScLHaUyFGQYd13cNJeEMFx");
  const stripe = await stripePromise;
  axios.post("api/create-checkout-session", order).then((response) => {
    const sessionID = response.data.id;
    return stripe.redirectToCheckout({ sessionId: sessionID });
  });
};
