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
  const [activities, setActivities] = useState<Array<Activity>>([]);
  const [page, setPage] = useState(1);
  const [needActivities, setNeedActivities] = useState<Boolean>(true);

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
            const kayakingData: Array<Activity> = [];
            data.forEach((element) => {
              if (element.type === "Kayaking") {
                const kayakElement: Activity = new Activity();
                kayakElement.id = element.id;
                kayakElement.type = element.type;
                kayakElement.name = element.name;
                kayakElement.date = element.start_date_local;

                kayakingData.push(kayakElement);
              }
            });
            console.log(`Do we have kayakingData`, kayakingData);

            setActivities(kayakingData);
            setNeedActivities(false);
          })
          .catch((error) => {
            console.error(error);
            if (error?.response?.status === 401) {
            }
          })
          .then((data) => {
            setIsLoading(false);
          });
      }
    });

    /*eslint-enable */
  }

  useEffect(() => {
    getActivities();
  }, [needActivities]);

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 300 },
    { field: "date", headerName: "Date", width: 150 },
  ];

  const rows: GridRowsProp = activities;

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
      <div>
        <DataGrid style={{ height: 900 }} rows={rows} columns={columns} />
      </div>
    </div>
  );
}
