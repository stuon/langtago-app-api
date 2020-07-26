import config from "../config/config";

export function logAPI(method, data) {
  if (!config.diagnostic.ENABLE_LOGGING) return;

  console.log(`Calling API:'${method}', data='${data}'`);
}
