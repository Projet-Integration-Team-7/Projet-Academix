import {  SignOutButton, SignedIn,OrganizationSwitcher, currentUser} from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Image from "next/image";
import Link from "next/link";
import Notification from "../forms/Notification";

async function Topbar() {
    const numberOfBubbles = 100; // Total number of bubbles

    const user = await currentUser();

    if(!user) return null;
    return (
        <nav className="topbar">
            {/*Array.from({ length: numberOfBubbles }).map((_, index) => (
                <div 
                    key={index} 
                    className="bubble" 
                    style={{ 
                        left: `${Math.random() * 100}%`,  // Random horizontal start position
                        animationDelay: `${-Math.random() * 15}s`,  // Random delay for each bubble
                        animationDuration: `${10 + Math.random() * 10}s`  // Random duration between 10 and 20 seconds
                    }}
                ></div>
            ))*/}
            <Link href="/" className="flex items-center gap-4">
                <Image src="/assets/logo_blanc.png" alt="logo" width={28} height={28}/>
                <p className="text-heading3-bold text-light-1 max-xs:hidden">Academix</p>
            </Link>

            <div className=" flex align-middle place-items-center gap-4">

                {user && <Notification currentUserId= {JSON.parse(JSON.stringify(user.id))} />}

                <div className="flex items-center gap-4">
                    <div className="block md:hidden">
                        <SignedIn>
                            <SignOutButton>
                                <div className="flex cursor-pointer">
                                    <Image src="/assets/logout.svg" alt="logout icon" width={24} height={24} />
                                </div>
                            </SignOutButton>
                        </SignedIn>
                    </div>
                    <OrganizationSwitcher
                        appearance={{
                            baseTheme: dark,
                            elements: {
                                organizationSwitcherTrigger:
                                "py-2 px-4"
                            }
                        }}
                
                    />
                </div>
            </div>

        </nav>
    )
    
}

export default Topbar;