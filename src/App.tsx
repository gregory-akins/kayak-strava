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
  Pagination,
  Typography,
} from "@mui/material";

import { useServiceConfig } from "@akinsgre/kayak-strava-utility";

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activities, setActivities] = useState<Array<Activity>>(null);
  const [page, setPage] = useState(1);
  const needActivities: Boolean = true;

  // use current access token to call all activities
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    getActivities(value);
  };

  function getActivities(page: number = 1) {
    const access: string = sessionStorage.getItem("accessToken");

    //ToDO let's fix the useServiceConfig to use a different name
    /*eslint-disable */

    useServiceConfig().then((value) => {
      const callActivities: string = `${value.stravaUrl}/athlete/activities?page=${page}&access_token=${access}`;
      console.log("Retrieving from ", callActivities);
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
        <Typography>Page: {page}</Typography>
        <Pagination
          count={1 + page}
          page={page}
          shape="rounded"
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
