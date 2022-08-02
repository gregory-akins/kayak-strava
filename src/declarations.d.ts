declare module "*.html" {
  const rawHtmlFile: string;
  export = rawHtmlFile;
}

declare module "*.bmp" {
  const src: string;
  export default src;
}

declare module "*.gif" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  const src: string;
  export default src;
}

declare module "@akinsgre/kayak-strava-utility" {
  export function authenticate(
    location: string,
    REACT_APP_CLIENT_ID: string,
    REACT_APP_CLIENT_SECRET: string
  );
  export function testAuthGetter(
    authTok: string,
    REACT_APP_CLIENT_ID: string,
    REACT_APP_CLIENT_SECRET: string
  );
}
