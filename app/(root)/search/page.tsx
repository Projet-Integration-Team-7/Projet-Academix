import {CircularProgress} from "@nextui-org/progress";

import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import UserCard from "@/components/cards/UserCard";
import Searchbar from "@/components/shared/Searchbar";
import Pagination from "@/components/shared/Pagination";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";

// Définition de la fonction Page
async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  // Récupération de l'utilisateur actuel
  const user = await currentUser();

  // Si l'utilisateur n'existe pas, on retourne null
  if (!user) return null;

  // Récupération des informations de l'utilisateur
  const userInfo = await fetchUser(user.id);

  // Si l'utilisateur n'a pas encore été intégré, on le redirige vers la page d'intégration
  if (!userInfo?.onboarded) redirect("/onboarding");

  // Récupération des paramètres de recherche
  const { userId, q: searchString, page = '1' } = searchParams;
  const pageNumber = Number(page);
  const pageSize = 25;

  // Récupération des utilisateurs correspondant aux critères de recherche
  const result = await fetchUsers({
    userId: user.id,
    searchString,
    pageNumber,
    pageSize,
  });

  // Affichage des résultats de la recherche
  return (
    <section>
      <h1 className='head-text mb-10'>Recherche</h1>
      <Searchbar routeType='search' />
      <div className='mt-14 flex flex-col gap-9'>
        {result.users.length === 0 ? (
          <p className='no-result'>Aucun résultat</p>
        ) : (
          result.users.map((person) => (
            <UserCard
              key={person.id}
              id={person.id}
              name={person.name}
              username={person.username}
              imgUrl={person.image}
              personType='User'
              usage="search"
            />
          ))
        )}
      </div>
      <Pagination
        path='search'
        pageNumber={pageNumber}
        isNext={result.isNext}
      />
    </section>
  );
}

// Exportation de la fonction Page
export default Page;