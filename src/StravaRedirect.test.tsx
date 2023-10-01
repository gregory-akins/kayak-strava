import React from "react";
import { render } from "@testing-library/react";
import StravaRedirect from "./StravaRedirect";

import { BrowserRouter as Router } from "react-router-dom";

describe("Root component", () => {
  it("should be in the document", () => {
    const { getByText } = render(
      <Router>
        <StravaRedirect />
      </Router>
    );
    expect(getByText(/Authorize/i)).toBeInTheDocument();
  });
  it("Should check token expiry if Cookie exists", () => {
    const utils = jest.createMockFromModule<
      typeof import("@akinsgre/kayak-strava-utility")
    >("@akinsgre/kayak-strava-utility");

    Object.defineProperty(window.document, "cookie", {
      writable: true,
      value:
        'token="{%22access_token%22:%22e98bdfb0bc1934433cc35a5747ae5cddc7c82257%22%2C%22refresh_token%22:%22c1ff26c2e66b95cfb71cf696ffff47076451714c%22%2C%22expiry%22:1682467460%2C%22athlete%22:{%22id%22:2171737%2C%22username%22:%22greg_akins%22%2C%22resource_state%22:2%2C%22firstname%22:%22Greg%22%2C%22lastname%22:%22Akins%22%2C%22bio%22:%22Team%20Flounder%22%2C%22city%22:%22Scottdale%22%2C%22state%22:%22PA%22%2C%22country%22:%22United%20States%22%2C%22sex%22:%22M%22%2C%22premium%22:true%2C%22summit%22:true%2C%22created_at%22:%222013-05-16T22:24:11Z%22%2C%22updated_at%22:%222022-06-08T06:19:40Z%22%2C%22badge_type_id%22:1%2C%22weight%22:79%2C%22profile_medium%22:%22https://dgalywyr863hv.cloudfront.net/pictures/athletes/2171737/3437215/2/medium.jpg%22%2C%22profile%22:%22https://dgalywyr863hv.cloudfront.net/pictures/athletes/2171737/3437215/2/large.jpg%22%2C%22friend%22:null%2C%22follower%22:null}}"',
    });
    const { getByText } = render(
      <Router>
        <StravaRedirect />
      </Router>
    );
    expect(getByText(/Authorize/i)).toBeInTheDocument();
  });
});
