import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"
import '../globals.css'
// Métadonnées de l'application pour améliorer le SEO et la lisibilité sur les réseaux sociaux.

export const metadata = {
    title: 'Academix',
    description: 'A Next.js 13 Meta Academix app'

}

// Configuration de la police Inter avec un sous-ensemble spécifique.

const inter = Inter({ subsets: ["latin"] })

/**
 * RootLayout est un composant de mise en page racine pour l'application Next.js.
 * Il enveloppe les enfants dans un contexte d'authentification et applique une police et des styles globaux.
 * @param children - Les composants enfants qui seront rendus à l'intérieur de cette mise en page.
 */
export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        // Enveloppe les enfants dans un contexte d'authentification Clerk.
        <ClerkProvider>
            <html lang="fr">
                <body className={`${inter.className} bg-dark-1`}>
                    <div className="w-full flex justify-center items-center min-h-screen">

                        {children}

                    </div>

                </body>

            </html>
        </ClerkProvider>
    )
}