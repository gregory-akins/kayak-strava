import { useState, useEffect } from "react";
import axios from "axios";
import Activity from "./models/Activity";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

import { useServiceConfig } from "@akinsgre/kayak-strava-utility";

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activities, setActivities] = useState<Array<Activity>>(null);
  const needActivities: Boolean = true;

  // use current access token to call all activities
  function getActivities() {
    const access: string = sessionStorage.getItem("accessToken");
    let callActivities: string = "";
    //ToDO let's fix the useServiceConfig to use a different name
    /*eslint-disable */
    useServiceConfig().then((value) => {
      callActivities = `${value.stravaUrl}${access}`;
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
    });
    /*eslint-enable */
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
      <div>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activities?.map((list, index) => (
                <TableRow key={index}>
                  <TableCell>{list.type}</TableCell>
                  <TableCell>{list.name}</TableCell>
                  <TableCell>{new Date(list.date).toDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default App;
