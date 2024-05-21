"use client"

import {sidebarLinks} from "@/constants/";
import { SignOutButton, SignedIn,useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter} from "next/navigation";


/**
 * Composant représentant la barre latérale gauche de l'application.
 * Cette barre latérale affiche les liens de navigation et les options de déconnexion.
 */

function LeftSidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const {userId} = useAuth();

    return (
        <section className="custom-scrollbar leftsidebar">
            <div className="flex w-full flex-1 flex-col gap-6 px-6">
            {sidebarLinks.map((link) => {
                const isActive = (pathname.includes(link.route) && link.route.
                length > 1) || pathname === link.route;

                if(link.route ==='/profile') link.route =`${link.route}/${userId}`
                
                return (
                    <div>
                        <div key={`link-${link.label}`}>
                            <Link
                            href={link.route}
                            key={link.label}
                            className={`leftsidebar_link ${isActive && 'bg-primary-500'}`}
                            >
                                <Image
                                    src={link.imgURL}
                                    alt={link.label}
                                    width={24}
                                    height={24}
                                />
                                <p className="text-light-1 max-lg:hidden">
                                    {link.label}</p>
                            </Link>
                        </div>
                    </div>
                )}
             )}
            </div>
            <div className="mt-10 px-6">
                <SignedIn>
                    <SignOutButton signOutCallback={() => {
                        router.push('/sign-in')}
                }>
                        <div className="flex cursor-pointer gap-4 p-4">
                            <Image src="/assets/logout.svg" alt="logout icon" width={24} height={24} />
                            <p className="text-light-2 max-lg:hidden">Se deconnecter</p>
                        </div>
                    </SignOutButton>
                </SignedIn>

            </div>
        </section>
    )
}

export default LeftSidebar;