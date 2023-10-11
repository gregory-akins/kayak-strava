import { useState, useEffect } from "react";
import axios from "axios";
import Activity from "./models/Activity";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { Container, Button } from "@mui/material";

import { useServiceConfig } from "@akinsgre/kayak-strava-utility";
import StravaRedirect from "./StravaRedirect";
const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 70,
  },
  {
    field: "date",
    headerName: "Activity Date",
    width: 70,
  },
  {
    field: "name",
    headerName: "Name",
    flex: 1,
  },
];

export default function App() {
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activities, setActivities] = useState<Array<Activity>>([]);
  const [page, setPage] = useState(1);
  const [needActivities, setNeedActivities] = useState<Boolean>(true);
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });

  function getActivities(page: number = 1) {
    let access: String = sessionStorage.getItem("accessToken");
    //ToDO let's fix the useServiceConfig to use a different name
    /*eslint-disable */
    useServiceConfig().then((value) => {
      if (access) {
        const callActivities: string = `${value.stravaUrl}/athlete/activities?page=${pageState.page}&access_token=${access}`;
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
    setPageState((old) => ({ ...old, isLoading: true }));
    getActivities();

    setPageState((old) => ({
      ...old,
      isLoading: false,
      data: activities,
      total: 10,
    }));
  }, [activities, needActivities, pageState.page, pageState.pageSize]);

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
        <Container style={{ marginTop: 100, marginBottom: 100 }}>
          <DataGrid
            autoHeight
            rows={pageState.data}
            rowCount={pageState.total}
            loading={pageState.isLoading}
            rowsPerPageOptions={[10, 30, 50, 70, 100]}
            pagination
            page={pageState.page - 1}
            pageSize={pageState.pageSize}
            paginationMode="server"
            onPageChange={(newPage) => {
              setPageState((old) => ({ ...old, page: newPage + 1 }));
            }}
            onPageSizeChange={(newPageSize) =>
              setPageState((old) => ({ ...old, pageSize: newPageSize }))
            }
            columns={columns}
          />
        </Container>
      </div>
    </div>
  );
}
