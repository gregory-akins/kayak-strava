import { useState, useEffect } from "react";
import axios from "axios";
import Activity from "./models/Activity";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Typography,
  Checkbox,
  Button,
} from "@mui/material";

import { useServiceConfig } from "@akinsgre/kayak-strava-utility";
import StravaRedirect from "./StravaRedirect";

export default function App() {
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
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
    let access: String = sessionStorage.getItem("accessToken");

    //ToDO let's fix the useServiceConfig to use a different name
    /*eslint-disable */

    useServiceConfig().then((value) => {
      if (!access) {
        //TODO be smarter about this.. auth should live in one spot and potentially could happen before any API call
      } else {
        const callActivities: string = `${value.stravaUrl}/athlete/activities?page=${page}&access_token=${access}`;

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
          .catch((error) => {
            if (error.response.status === 401) {
            }
          })
          .then((data) => setIsLoading(false));
      }
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
  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 150 },
    { field: "desc", headerName: "Description", width: 150 },
  ];

  const rows: GridRowsProp = [{ id: 1, name: "Still", desc: "In Progress" }];

  return (
    <div className="App">
      <StravaRedirect />
      <Button
        variant="contained"
        onClick={(activity) => {
          activities?.forEach((element) => {});
        }}
      >
        Import
      </Button>
      <div style={{ height: 300, width: "100%" }}>
        <DataGrid rows={rows} columns={columns} />
      </div>
    </div>
  );
}
