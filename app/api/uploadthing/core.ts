import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { currentUser } from "@clerk/nextjs";
const f = createUploadthing();

const getUser = async () => await currentUser();
// FileRouter pour votre application, peut contenir plusieurs FileRoutes
export const ourFileRouter = {
  // Définissez autant de FileRoutes que vous le souhaitez, chacun avec un routeSlug unique
  media: f({ image: { maxFileSize: "16MB", maxFileCount: 1 } })
    // Définir les autorisations et les types de fichiers pour ce FileRoute
    .middleware(async ({ req }) => {
      // Ce code s'exécute sur votre serveur avant le téléchargement
      const user = await getUser();

      // Si vous lancez, l'utilisateur ne pourra pas télécharger
      if (!user) throw new UploadThingError("Unauthorized");

      // Tout ce qui est renvoyé ici est accessible dans onUploadComplete en tant que « métadonnées »
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Ce code S'EXÉCUTE SUR VOTRE SERVEUR après le téléchargement
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);
      // !!! Tout ce qui est renvoyé ici est envoyé au rappel `onClientUploadComplete` côté client
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;