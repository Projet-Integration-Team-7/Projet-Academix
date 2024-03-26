"use client";

import { useRouter } from "next/navigation";

import { Button } from "../ui/button";

interface PaginationProps {
  currentPage: number;
  hasNextPage: boolean;
  route: string;
}

function Pagination({ currentPage, hasNextPage, route }: PaginationProps) {
  const router = useRouter();

  const navigateToPage = (direction: string) => {
    let targetPage = currentPage;

    if (direction === "previous") {
      targetPage = Math.max(1, currentPage - 1);
    } else if (direction === "next") {
      targetPage = currentPage + 1;
    }

    if (targetPage > 1) {
      router.push(`/${route}?page=${targetPage}`);
    } else {
      router.push(`/${route}`);
    }
  };

  if (!hasNextPage && currentPage === 1) return null;

  
}

export default Pagination;
