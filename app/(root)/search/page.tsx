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
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const { userId, q: searchString, page = '1' } = searchParams;
  const pageNumber = Number(page);
  const pageSize = 25;

  const result = await fetchUsers({
    userId: user.id,
    searchString,
    pageNumber,
    pageSize,
  });

  return (
    <section>
      <h1 className='head-text mb-10'>Search</h1>
      <Searchbar routeType='search' />
      <div className='mt-14 flex flex-col gap-9'>
        {result.users.length === 0 ? (
          <p className='no-result'>No Result</p>
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

export default Page;
