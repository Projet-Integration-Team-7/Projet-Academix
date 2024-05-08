import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

// Exporter les routes pour Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,

});