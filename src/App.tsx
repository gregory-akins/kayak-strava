import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Activity from "./models/Activity";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { Container, Button, Checkbox } from "@mui/material";

import { useServiceConfig } from "@akinsgre/kayak-strava-utility";
import StravaRedirect from "./StravaRedirect";
function RenderImport(props: GridRenderCellParams<any, any>) {
  const [checked, setChecked] = useState(false); // Initiated react binded value with param from `rows`

  // Handler for user clicks to set checkbox mark or unset it
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setChecked(event.target.checked);
    // We'll need to get the row ID.. this should probably be something on the checkbox
  };
  //The bind for dynamic mark/unmark: checked={checked}
  //The handler for user clicks: onChange={handleChange}
  return <Checkbox id="1" checked={checked} onChange={handleChange} />;
}
const columns: GridColDef[] = [
  {
    field: "imported",
    headerName: "Import?",
    width: 150,
    renderCell: RenderImport,
  },
  {
    field: "id",
    headerName: "ID",
    width: 140,
  },
  {
    field: "date",
    headerName: "Activity Date",
    width: 120,
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

  const [totalActivities, setTotalActivities] = useState();

  const getTotalActivities = () => {
    let accessToken: String = sessionStorage.getItem("accessToken");
    //ToDO let's fix the useServiceConfig to use a different name
    /*eslint-disable */
    useServiceConfig().then((value) => {
      if (accessToken) {
        const callActivities: string = `${value.kayakStravaUrl}/athlete/totalactivities?&accessToken=${accessToken}`;
        axios
          .get(callActivities)
          .then((res) => res.data)
          .then((data) => {
            setTotalActivities(data);
          })
          .catch((error) => {
            if (error?.response?.status === 401) {
            }
          });
      }
    });

    /*eslint-enable */
  };
  const getActivities = async (page: number = 1) => {
    let accessToken: String = sessionStorage.getItem("accessToken");
    //ToDO let's fix the useServiceConfig to use a different name
    /*eslint-disable */
    useServiceConfig().then((value) => {
      if (accessToken) {
        const callActivities: string = `${value.kayakStravaUrl}/athlete/activities?page=${pageState.page}&accessToken=${accessToken}&per_page=${pageState.pageSize}`;

        axios
          .get(callActivities)
          .then((res) => res.data)
          .then((data) => {
            const kayakingData: Array<Activity> = [];
            data.forEach((element) => {
              const kayakElement: Activity = new Activity();
              kayakElement.id = element.id;
              kayakElement.type = element.type;
              kayakElement.name = element.name;
              kayakElement.date = element.start_date_local;
              kayakingData.push(kayakElement);
            });
            setActivities(kayakingData);
            setNeedActivities(false);
          })
          .catch((error) => {
            //
            if (error?.response?.status === 401) {
            }
          })
          .then((data) => {
            setIsLoading(false);
          });
      }
    });
    /*eslint-enable */
  };
  useMemo(() => getTotalActivities(), []);
  //uwc-debug
  useEffect(() => {
    setPageState((old) => ({ ...old, isLoading: true }));
    getActivities().then(() => {
      pageState.data = activities;
    });
    setPageState((old) => ({
      ...old,
      isLoading: false,
      data: activities,
    }));
  }, [pageState.page, pageState.pageSize]);
  //uwc-debug
  useEffect(() => {
    setPageState((old) => ({
      ...old,
      isLoading: false,
      data: activities,
      total: totalActivities,
    }));
  }, [activities, pageState.total]);

  useEffect(() => {
    setPageState((old) => ({
      ...old,
      total: totalActivities ? totalActivities : 4,
    }));
  }, [totalActivities]);
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
