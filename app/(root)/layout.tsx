import React from "react";
import "@uploadthing/react/styles.css";
import { Inter } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import LeftSidebar from "@/components/shared/LeftSidebar";
import Bottombar from "@/components/shared/Bottombar";
import RightSidebar from "@/components/shared/RightSidebar";
import Topbar from "@/components/shared/Topbar";
// Utilisation de la police Inter avec le sous-ensemble latin

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'Academix',
  description: 'Une application Academix basée sur Next.js 13'
}
// Le composant RootLayout sert de mise en page principale pour l'application

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Le fournisseur Clerk gère l'authentification de l'utilisateur

    <ClerkProvider>
      <html lang='en'>
        <body className={inter.className}>
          {/* Barre supérieure de l'application */}

          <Topbar />

          <main className='flex flex-row'>
            {/* Barre latérale gauche de l'application */}

            <LeftSidebar />
            <section className='main-container'>
              {/* Contenu principal de l'application */}
              <div className='w-full max-w-4xl' style={{ position: 'relative', zIndex: 1 }}>
                {children}
              </div>
            </section>
            {/* Barre latérale droite de l'application */}

            <RightSidebar />
          </main>
          {/* Barre inférieure de l'application */}

          <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  );
}
