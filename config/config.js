import prod from "./config-prod";
import dev from "./config-dev";

/*
const dev = {
  developer: {
    LOGGING: true
  },
};
*/

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === "production" ? prod : dev;

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  MAX_TITLE_SIZE: 120,
  MAX_URL_SIZE: 260,
  MAX_CONTENT_SIZE: 1000,
  ...config,
};
