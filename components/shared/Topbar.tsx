import {  SignOutButton, SignedIn,OrganizationSwitcher, currentUser} from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Image from "next/image";
import Link from "next/link";
import Notification from "../forms/Notification";

async function Topbar() {
    const user=await currentUser();

    if(!user) return null;
    return (
        <nav className="topbar">
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