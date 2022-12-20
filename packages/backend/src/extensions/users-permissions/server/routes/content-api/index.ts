"use strict";

import authRoutes from "@strapi/plugin-users-permissions/server/routes/content-api/auth";
import userRoutes from "@strapi/plugin-users-permissions/server/routes/content-api/user";
import roleRoutes from "@strapi/plugin-users-permissions/server/routes/content-api/role";
import permissionsRoutes from "@strapi/plugin-users-permissions/server/routes/content-api/permissions";

const additionalRoutes = [
  {
    method: "POST",
    path: "/user",
    handler: "auth.register",
    config: {
      middlewares: ["plugin::users-permissions.rateLimit"],
      prefix: "",
    },
  },
];

export default {
  type: "content-api",
  routes: [
    ...authRoutes,
    ...additionalRoutes,
    ...userRoutes,
    ...roleRoutes,
    ...permissionsRoutes,
  ],
};
