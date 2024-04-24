import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Exporte les routes pour le routeur de l'application Next
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  // Ici, vous pouvez ajouter des options supplémentaires pour le routeur si nécessaire
});
