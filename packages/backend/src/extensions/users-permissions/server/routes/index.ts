"use strict";

import contentApi from "./content-api";

export default {
  admin: require("@strapi/plugin-users-permissions/server/routes/admin"),
  "content-api": contentApi,
};
