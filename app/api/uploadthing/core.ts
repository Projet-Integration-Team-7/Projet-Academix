import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { currentUser } from "@clerk/nextjs";

// Création de l'instance de Uploadthing
const f = createUploadthing();

// Fonction asynchrone pour obtenir l'utilisateur actuel
const getUser = async () => await currentUser();

// Définition du FileRouter pour votre application, pouvant contenir plusieurs FileRoutes
export const ourFileRouter = {
  // Définissez autant de FileRoutes que vous le souhaitez, chacune avec un routeSlug unique
  media: f({ image: { maxFileSize: "16MB", maxFileCount: 1 } })
    // Définissez les autorisations et les types de fichiers pour cette FileRoute
    .middleware(async ({ }) => {
      // Ce code s'exécute sur votre serveur avant le téléchargement
      const user = await getUser();

      // Si vous lancez une exception, l'utilisateur ne pourra pas télécharger
      if (!user) throw new UploadThingError("Unauthorized");

      // Tout ce qui est renvoyé ici est accessible dans onUploadComplete en tant que `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Ce code s'exécute sur votre serveur après le téléchargement
      console.log("Téléchargement terminé pour l'utilisateur :", metadata.userId);

      console.log("URL du fichier :", file.url);

      // !!! Tout ce qui est renvoyé ici est envoyé au callback `onClientUploadComplete` côté client
      return { uploadedBy: metadata.userId };
    }),
} 

export type OurFileRouter = typeof ourFileRouter;