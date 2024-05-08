import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import '../globals.css';

// Métadonnées de l'application
export const metadata = {
    title: 'Academix',
    description: 'Une application Meta Academix avec Next.js 13'
};

// Configuration de la police Google Inter avec le sous-ensemble latin
const inter = Inter({ subsets: ["latin"] });

// Composant de mise en page racine
export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${inter.className} bg-dark-1`}>
                    <div className="w-full flex justify-center items-center min-h-screen">
                        {children} {/* Affiche les enfants du composant de mise en page */}
                    </div>
                </body>
            </html>
        </ClerkProvider>
    );
}