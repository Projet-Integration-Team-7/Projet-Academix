import { SignUp} from "@clerk/nextjs";
import { shadesOfPurple } from "@clerk/themes";

export default function CustomSignIn() {
    return (
        <div
            style={{
                position: "fixed", // Position the container fixed to the viewport
                top: 0, // Position at the top
                left: 0, // Position at the left
                width: "100%", // Cover the entire viewport width
                height: "100%", // Cover the entire viewport height
                backgroundImage: "url('/assets/Vault1.jpg')", // Set the background image
                backgroundSize: "cover", // Cover the entire area
                backgroundPosition: "center", // Center the background image
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div style={{ maxWidth: 400, width: "100%" }}> {/* Adjust the max-width of the sign-in box */}
                <SignUp
                    appearance={{
                        baseTheme: shadesOfPurple,
                        elements: {
                            formButtonPrimary: {
                                backgroundColor: "blue", // Set the background color to blue
                                color: "yellow", // Set the text color to yellow
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
}
