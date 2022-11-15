export function authenticate() {
  return true;
}

export interface ServiceConfig {
  stravaUrl: string;
  clientId: string;
  clientSecret: string;
  redirectUrl: string;
}

export async function useServiceConfig(): Promise<ServiceConfig> {
  var promise = new Promise<ServiceConfig>((resolve, reject) => {
    const serviceConfig: ServiceConfig = {
      stravaUrl: "",
      clientId: "",
      clientSecret: "",
      redirectUrl: "",
    };
    resolve(serviceConfig);
  });
  return promise;
}
