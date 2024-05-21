"use client";
import { Popover } from "@headlessui/react";
import Image from "next/image";



interface ProfileMenuProps {
  userId: string;
}

/**
 * Composant représentant le menu de profil.
 * 
 * @component
 * @param {Object} props - Les propriétés du composant.
 * @param {string} props.userId - L'identifiant de l'utilisateur.
 * @returns {JSX.Element} Le menu de profil.
 */
const ProfileMenu = ({userId}: ProfileMenuProps) => {
    return (
        <Popover>
            <Popover.Button>
                <div className='rounded-full ring-2 ring-dark'>
                    <Image
                        src="/assets/three_dots.svg"
                        alt="profile menu icon"
                        height={24}
                        width={24}
                        className="flex cursor-pointer object-cover rounded-full p-0.5 transition ease-in-out bg-gray-300 border-[1px] border-gray-300 hover:border-gray-500"
                    />
                </div>
            </Popover.Button>

            <Popover.Panel>
                <div className=""></div>
            </Popover.Panel>
        </Popover>
    );
};

export default ProfileMenu;
