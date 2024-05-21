"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Input } from "../ui/input";

interface SearchbarProps {
  routeType: string;
}

/**
 * Composant de la barre de recherche.
 * 
 * @component
 * @param {Object} props - Les propriétés du composant.
 * @param {string} props.routeType - Le type de route.
 * @returns {JSX.Element} Le composant de la barre de recherche.
 */
const Searchbar: React.FC<SearchbarProps> = ({ routeType }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // Effectue une requête après 0,3s sans saisie
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        router.push(`/${routeType}?q=${searchTerm}`);
      } else {
        router.push(`/${routeType}`);
      }
    }, 300);

    // Fonction de nettoyage pour annuler le délai d'attente
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, routeType]);

  const placeholderText = routeType !== "/search" ? "Chercher utilisateur" : "Rechercher des créateurs";

  return (
    <div className='searchbar flex items-center border-b-2 py-2 '>
      <Image
        src='/assets/search-gray.svg'
        alt='Icône de recherche'
        width={24}
        height={24}
        className='absolute left-3'
      />
      <Input
        id='text'
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholderText}
        className='pl-10 pr-3 py-1 w-full bg-transparent focus:outline-none focus:w-auto focus:bg-white transition-all duration-500 ease-in-out'
      />
    </div>
  );
}

export { Searchbar };

export default Searchbar;
