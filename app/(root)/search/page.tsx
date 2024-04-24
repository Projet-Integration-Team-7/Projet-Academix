import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";

import UserCard from "@/components/cards/UserCard";
import Searchbar from "@/components/shared/Searchbar";
import Pagination from "@/components/shared/Pagination";

import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";

async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  // Récupérer l'utilisateur actuel
  const user = await currentUser();
  if (!user) return null;

  // Récupérer les informations de l'utilisateur
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  // Récupérer les paramètres de recherche
  const { q: searchString, page = '1' } = searchParams;
  const pageNumber = Number(page);
  const pageSize = 25;

  // Récupérer les utilisateurs correspondant à la recherche
  const result = await fetchUsers({
    userId: user.id,
    searchString,
    pageNumber,
    pageSize,
  });
  // Rendre la section de recherche

  return (
    <section>
      <h1 className='head-text mb-10'>Search</h1>
      <Searchbar routeType='search' />
      <div className='mt-14 flex flex-col gap-9'>
        {result.users.length === 0 ? (
          <p className='no-result'>No Result</p>
        ) : (
          // Utiliser le map pour rendre une liste de composants UserCard

          result.users.map((person) => (
            <UserCard
              key={person.id}
              id={person.id}
              name={person.name}
              username={person.username}
              imgUrl={person.image}
              personType='User'
            />
          ))
        )}
      </div>
      <Pagination

        currentPage={pageNumber}
        hasNextPage={result.isNext}
        route='search'
      />
    </section>
  );
}

export default Page;
