import { SignIn } from "@clerk/nextjs";
import { shadesOfPurple } from "@clerk/themes";
import { frFR } from "@clerk/localizations";

/**
 * Composant CustomSignIn pour afficher une page de connexion personnalisée.
 * Utilise le thème `shadesOfPurple` de Clerk avec des modifications spécifiques.
 */
export default function CustomSignIn() {
    
        
        const backgroundStyle ={
                position: "fixed", // Fixe le conteneur dans le viewport
                top: 0, // Positionne en haut
                left: 0, // Positionne à gauche
                width: "100%", // Couvre la largeur entière du viewport
                height: "100%", // Couvre la hauteur entière du viewport
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
                <SignIn
                    appearance={{
                        baseTheme: shadesOfPurple,// Utilise le thème de base shadesOfPurple
                        elements: {
                            formButtonPrimary: {
                                backgroundColor: "blue", // Couleur de fond des boutons primaires à bleu
                                color: "yellow", // Couleur de texte des boutons primaires à jaune
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
}