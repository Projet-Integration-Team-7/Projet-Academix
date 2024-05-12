import { SignUp} from "@clerk/nextjs";
import { shadesOfPurple } from "@clerk/themes";
/**
 * CustomSignUp fournit un formulaire d'inscription stylisé utilisant les composants Clerk.
 * Il positionne une boîte d'inscription fixée au centre du viewport avec un arrière-plan plein écran.
 */
export default function CustomSignIn() {
    
        
            const backgroundStyle ={
                position: "fixed", // Fixe le conteneur à l'affichage
                top: 0, // En haut de la vue
                left: 0, // À gauche de la vue
                width: "100%", // Largeur couvrant tout le viewport
                height: "100%", // Hauteur couvrant tout le viewport
                backgroundImage: "url('/assets/fond5.png')", // Définit l'image de fond
                backgroundSize: "cover", // Assure que l'image de fond couvre tout l'espace disponible
                backgroundPosition: "center", // Centre l'image de fond
                display: "flex",
                justifyContent: "center",
                alignItems: "center",// Centre le contenu (horizontalement et verticalement)
            };
            const formContainerStyle = {
                maxWidth: 400, // Définit la largeur maximale de la boîte de formulaire à 400px
                width: "100%" // Assure que la largeur est responsive
            };

                return (
                    <div style={backgroundStyle}>
                   <div style={formContainerStyle}>
                <SignUp
                    appearance={{
                        baseTheme: shadesOfPurple,//Utilise le theme de couleur shadesOfPurple
                        elements: {
                            formButtonPrimary: {
                                backgroundColor: "blue", // Couleur de fonds bleue pour le bouton principal
                                color: "yellow", // Couleur de texte jaune pour le bouton principal
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
}
