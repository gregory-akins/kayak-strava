import React, { useState, useEffect } from "react";
import axios from "axios";
import Activity from "./models/Activity";
import { authenticate } from "@akinsgre/kayak-strava-utility";

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activities, setActivities] = useState<Array<Activity>>(null);
  const needActivities: Boolean = true;

  //Strava Credentials
  let clientID = "${REACT_APP_CLIENT_ID}";

  // use current access token to call all activities
  function getActivities() {
    const access: string = localStorage.getItem("accessToken");
    const url: string = process.env.REACT_APP_STRAVA_URL;
    const callActivities = `${url}${access}`;
    axios
      .get(callActivities)
      .then((res) => res.data)
      .then((data) => {
        const kayakingData = [];
        data.forEach((element) => {
          if (element.type === "Kayaking") {
            const kayakElement = {
              type: element.type,
              name: element.name,
              date: element.start_date_local,
            };
            kayakingData.push(kayakElement);
          }
        });
        setActivities(kayakingData);
      })
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
  }, [needActivities]);

  return (
    <div className="App">
      <div>{showActivities(isLoading, activities)}</div>
      <div>{JSON.stringify(activities)}</div>
      <div>User {localStorage.getItem("username")}</div>
    </div>
  );
}

export default App;
