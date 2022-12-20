"use strict";

import routes from "./server/routes";

export default (plugin) => {
  plugin.routes = routes;
  return plugin;
};
