"use client";
import { deleteThread } from "@/lib/actions/thread.action";
import { removeThreadFromUser } from "@/lib/actions/user.actions";
import Thread from "@/lib/models/thread.model";
import { Popover } from "@headlessui/react";
import Image from "next/image";
import { usePathname } from "next/navigation";


interface ThreadMenuProps {
  threadId: string;
  currentUserId: string;
  authorId: string;
}

/**
 * Composant ThreadMenu
 * 
 * Affiche un menu déroulant pour les threads avec différentes options, telles que la suppression d'un thread.
 * 
 * @component
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.threadId - L'ID du thread
 * @param {string} props.currentUserId - L'ID de l'utilisateur actuel
 * @param {string} props.authorId - L'ID de l'auteur du thread
 * @returns {JSX.Element} Le composant ThreadMenu
 */
const ThreadMenu = ({ threadId, currentUserId, authorId }: ThreadMenuProps) => {
  const pathname = usePathname();

  /**
   * Gère la suppression d'un thread.
   * 
   * @async
   * @function handleDelete
   * @returns {Promise<void>}
   * @throws {Error} Une erreur si la suppression échoue
   */
  const handleDelete = async () => {
    try {
      // Supprime le document en utilisant son ID
      deleteThread(threadId, pathname);
      removeThreadFromUser(currentUserId, threadId);

      // Gère toute autre logique ou mise à jour de l'interface utilisateur après la suppression réussie
    } catch (error: any) {
      // Gère les erreurs qui se produisent pendant le processus de suppression
      throw new Error("Erreur lors de la suppression du document:", error);
    }
  };

  return (
    <Popover>
      <Popover.Button className={" bg-transparent shadow-none"}>
        <div className='rounded-full ring-2 ring-dark'>
          <Image
            src="/assets/three_dots.svg"
            alt="Icône du menu du thread"
            height={24}
            width={24}
            className="flex cursor-pointer object-cover rounded-full p-0.5 transition ease-in-out bg-gray-300 border-[1px] border-gray-300 hover:border-gray-500"
          />
        </div>
      </Popover.Button>

      <Popover.Panel className="z-50 -translate-x-44">
        <div className={`absolute flex-auto rounded-md bg-white ${authorId === currentUserId ? 'ring-2 ring-gray-200' : ''} w-[200px]`}>
          {authorId === currentUserId && (
            <div
              className="group p-1 m-1 flex align-middle cursor-pointer object-contain rounded-lg bg-gray-300 border-2 transition ease-in-out hover:border-red-500 content-center"
              onClick={handleDelete}
            >
              <div className="align-middle content-center">
                <svg
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="m-1"
                >
                  <path
                    d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M14 10V17M10 10V17"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="p-4 group-hover:stroke-red-500 align-middle justify-center justify-self-center justify-items-center"
                  />
                </svg>
              </div>
              <span className="whitespace-normal text-sm pt-[2px] text-black group-hover:text-red-500">
                Supprimer Publication
              </span>
            </div>
          )}
        </div>
      </Popover.Panel>
    </Popover>
  );
};

export default ThreadMenu;
