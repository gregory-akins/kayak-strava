import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useServiceConfig,
  authenticate,
  ServiceConfig,
  Athlete,
  refreshAuth,
  getAthlete,
  Token,
} from "@akinsgre/kayak-strava-utility";
import Button from "@mui/material/Button";
import { navigateToUrl } from "single-spa";
import Cookies from "js-cookie";

export default function StravaRedirect() {
  let clientId: string;
  let secret: string;
  let redirectUrl: string;
  const navigate = useNavigate();
  const location = useLocation();

  const [userName, setUserName] = useState("");

  useEffect(() => {
    const effectUser = async () => {
      //ToDO let's fix the useServiceConfig to use a different name
      /*eslint-disable */
      try {
        const config: ServiceConfig = await useServiceConfig();
        clientId = config.clientId;
        secret = config.clientSecret;
        redirectUrl = config.redirectUrl;

        // see if we have a access_token that works
        const cookieToken: any = Cookies.get("token");

        let userData: Athlete;
        //Checking if token isn't defined, current date is past the expiry date
        if (cookieToken === undefined) {
          console.log("There is no token");
          userData = await authenticate(config.clientId, config.clientSecret);
        } else {
          let token: Token = JSON.parse(cookieToken) as Token;
          console.log("Token will expire ", new Date(token.expiry * 1000));
          console.log("Now is ", new Date());
          console.log(
            "Token hasn't exired yet? ",
            token.expiry > Math.floor(Date.now() / 1000)
          );
          if (
            token != undefined &&
            token.expiry > Math.floor(Date.now() / 1000)
          ) {
            console.log("don't authenticate, just get the athlete", token);
            getAthlete(token.access_token)
              .then((data) => {
                console.log("Data 1", data);
                userData = {
                  firstname: data.firstname,
                  lastname: data.lastname,
                } as Athlete;
                setUserName(`${userData.firstname} ${userData.lastname}`);
              })
              .catch((error) => console.log("An error occurred", error));
            console.log("What just happened");
          } else {
            console.log(
              "We have a cookie with a refresh Token, Let's try to refresh the token"
            );
            token = await refreshAuth();
            //get the athlete

            userData = {
              firstname: token.athlete.firstname,
              lastname: token.athlete.lastname,
            } as Athlete;
          }
        }
        if (userData) {
          console.log(
            "When did we make it here?  This timey, wimey stuff is weird"
          );
          setUserName(`${userData.firstname} ${userData.lastname}`);
        }
      } catch (error) {}
    };
    effectUser();
  }, [location.pathname, navigate]);

  const handleAuthClick = () => {
    if (clientId) {
      const loginUrl = `http://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&approval_prompt=force&scope=activity:read_all&redirect_uri=${redirectUrl}/exchange_token`;
      navigateToUrl(loginUrl);
    }
  };

  return (
    <Button color="inherit" onClick={handleAuthClick}>
      {userName || "Authorize Strava"}
    </Button>
  );
}
