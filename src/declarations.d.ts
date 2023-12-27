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
  export interface ServiceConfig {
    stravaUrl: string;
    kayakStravaUrl:string;
    clientId: string;
    clientSecret: string;
    redirectUrl: string;
  }
  export function useServiceConfig(): Promise<ServiceConfig>;
  export function authenticate(

  ): Athlete;
  export function refreshStravaAuth(): Promise<Token>;
  export function getAthlete(accessToken: String): Promise<Athlete>;
  export interface Token {
    access_token: string;
    refresh_token: string;
    expiry: number;
    athlete: Athlete;
  }
  export interface Athlete {
    id: number;
    username: string;
    firstname: string;
    lastname: string;
  }
}
