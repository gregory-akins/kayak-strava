import React, { useState, useEffect } from "react";
import axios from "axios";
import Activity from "./models/Activity";
import { authenticate } from "@akinsgre/kayak-strava-utility";

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activities, setActivities] = useState<Array<Activity>>(null);

  //Strava Credentials
  let clientID = "${REACT_APP_CLIENT_ID}";
  let clientSecret = "${REACT_APP_CLIENT_SECRET}";

  // use current access token to call all activities
  function getActivities() {
    const access: string = localStorage.getItem("accessToken");
    //const callActivities = `https://www.strava.com/api/v3/athlete/activities?access_token=${access}`;
    const callActivities = `http://localhost:8080/activities.json?${access}`;

    axios
      .get(callActivities)
      .then((res) => res.data)
      .then((data) => setActivities(data))
      .then((data) => setIsLoading(false));
  }
  function showActivities(isLoading, activities) {
    if (!isLoading) {
      return <div>There are {activities.length} activites</div>;
    } else {
      return <>Loading</>;
    }
  }

  useEffect(() => {
    getActivities();
  });

  return (
    <div className="App">
      <div>{showActivities(isLoading, activities)}</div>
      <div>{JSON.stringify(activities)}</div>
      <div>User {localStorage.getItem("username")}</div>
    </div>
  );
}

export default App;
