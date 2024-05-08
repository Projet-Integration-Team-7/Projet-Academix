import { SignUp } from "@clerk/nextjs";
import { shadesOfPurple } from "@clerk/themes";

export default function CustomSignUp() {
    return (
        <div
            style={{
                position: "fixed", // Positionne le conteneur de manière fixe par rapport au viewport
                top: 0, // Positionne en haut
                left: 0, // Positionne à gauche
                width: "100%", // Couvre toute la largeur du viewport
                height: "100%", // Couvre toute la hauteur du viewport
                backgroundImage: "url('/assets/Vault1.jpg')", // Définit l'image de fond
                backgroundSize: "cover", // Couvre toute la zone
                backgroundPosition: "center", // Centre l'image de fond
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div style={{ maxWidth: 400, width: "100%" }}> {/* Ajuste la largeur maximale de la boîte d'inscription */}
                <SignUp
                    appearance={{
                        baseTheme: shadesOfPurple,
                        elements: {
                            formButtonPrimary: {
                                backgroundColor: "blue", // Définit la couleur de fond en bleu
                                color: "yellow", // Définit la couleur du texte en jaune
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
}