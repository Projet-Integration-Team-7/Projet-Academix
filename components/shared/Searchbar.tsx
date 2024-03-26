"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Input } from "../ui/input";

interface SearchbarProps {
  routeType: string;
}

const Searchbar: React.FC<SearchbarProps> = ({ routeType }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // Perform a query after 0.3s of no input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        router.push(`/${routeType}?q=${searchTerm}`);
      } else {
        router.push(`/${routeType}`);
      }
    }, 300);

    // Cleanup function to clear the timeout
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, routeType]);

  const placeholderText = routeType !== "/search" ? "Search communities" : "Search creators";

  return (
    <div className='searchbar'>
      <Image
        src='/assets/search-gray.svg'
        alt='search'
        width={24}
        height={24}
        className='object-contain'
      />
      <Input
        id='text'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholderText}
        className='no-focus searchbar_input'
      />
    </div>
  );
}

export { Searchbar };

export default Searchbar;
