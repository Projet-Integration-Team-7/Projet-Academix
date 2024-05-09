"use client";
import { Card, CardBody, CardFooter, Chip, CircularProgress } from '@nextui-org/react';

// Importation des bibliothèques et composants nécessaires
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { fetchTopAuthors,fetchNumberOfUsers,fetchNumberOfCommunities,fetchThreadsLikes } from '@/lib/actions/statistics'; // Replace with your actual path
import TopLikeList from '@/components/forms/TopLikeList';

// Importation dynamique du StatisticsChart pour s'assurer qu'il est rendu uniquement côté client
// Importation dynamique pour s'assurer qu'elle est rendue côté client
const AuthorList = dynamic(() => import('@/components/forms/AuthorList'), { ssr: false });
const Statistics = () => {
    const [topAuthors, setTopAuthors] = useState([0]);
    const [topThreadLikes, setTopThreadLikes] = useState([0]);

    const [numberUsers,setNumberUsers]=useState(0)
    const [numberCommunities,setNumberCommunities]=useState(0)
 
    useEffect(() => {
        const loadTopAuthors = async () => {
            const authors = await fetchTopAuthors();
            setTopAuthors(authors);
        };
        loadTopAuthors();
    }, []);

    useEffect(() => {
        const loadTopThreadsLikes = async () => {
            const topLikes = await fetchThreadsLikes();
            console.log("reponse : ", topLikes)
            setTopThreadLikes(topLikes);
        };
        loadTopThreadsLikes();
    }, []);

    useEffect(()=>{
     const loadNumberOfUsers=async() => {
        const numberOfUsers=await fetchNumberOfUsers();
        setNumberUsers(numberOfUsers)
        
     }
     loadNumberOfUsers();
    }
    
    
    )
    useEffect(()=>{
        const loadNumberOfCommunities=async() => {
           const numberOfCommunities=await fetchNumberOfCommunities();
           setNumberCommunities(numberOfCommunities)
           
        }
        loadNumberOfCommunities();
       })

    return (
        <>

        <section><h1  className="head-text mb-10">Statisitcs </h1></section>
    
            <nav className="flex justify-between mb-12 border-b border-gray-200 p-4">
                <h1 className="font-bold text-2xl text-white">Utilisateurs qui poste le plus</h1>
            </nav>
            <main className="p-4 text-white ">
                {topAuthors.length > 0 ? (
                    <AuthorList authors={topAuthors} />
                ) : (
                    <p>Loading top authors...</p>
                )}
            </main>
            <nav className="flex justify-between mb-12 border-b border-gray-200 p-4 mb-5 mt-5">
                <h1 className="font-bold text-2xl text-white">Threads avec le plus de like </h1>
            </nav>
            <main className="p-4 text-white ">
         
                {topThreadLikes.length > 0 ? (
                 
                 <TopLikeList likes={topThreadLikes} />

                ) : (
                    <p>Loading top Thread likes...</p>
                )}

            </main>
            <nav className="flex justify-between mb-12 border-b border-gray-200 p-4 mt-5 mb-5">
                <h2 className="font-bold text-2xl text-white">Nombre d'utilisateurs sur le site au total OBJECTIF : 100</h2>
                </nav>
                
                <div className='flex md:space-x-20 '>
                
              <main className=' text-white text-xl'>
                    Nombre d'utilisateurs 
                    <Card className="w-[240px] h-[240px] border-none bg-transparent">
      <CardBody className="flex justify-center items-center h-full relative">
        <CircularProgress
          classNames={{
            svg: "w-36 h-36 drop-shadow-md",
            indicator: "stroke-white", // Couleur du cercle (blanc)
            track: "stroke-white/10", // Couleur de la piste (blanc)
            value: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-semibold text-white", // Style de la valeur et centrage (blanc)
          }}
          value={numberUsers} // Valeur du chiffre
          strokeWidth={4}
          showValueLabel={true}
          format={(value) => `${value}%`} // Format personnalisé pour afficher le chiffre avec le pourcentage
        />
      </CardBody>
      <CardFooter className="justify-center items-center pt-0">
        <Chip
          classNames={{
            base: "border-1 border-white/30", // Couleur de la bordure (blanc)
            content: "text-white/90 text-small font-semibold", // Couleur du texte (blanc)
          }}
          variant="bordered"
        >
          {numberUsers} Utilisateurs
        </Chip>
      </CardFooter>
    </Card>
              </main>
        
              </div>
              <nav className="flex justify-between mb-12 border-b border-gray-200 p-4 mt-5 mb-5">
                <h2 className="font-bold text-2xl text-white">Nombre de communautés sur le site au total OBJECTIF : 100 </h2>
                </nav>
              <main className=' text-white text-xl'>
                    Nombre de communities au total
                    <Card className="w-[240px] h-[240px] border-none bg-transparent">
      <CardBody className="flex justify-center items-center h-full relative">
        <CircularProgress
          classNames={{
            svg: "w-36 h-36 drop-shadow-md",
            indicator: "stroke-white", // Couleur du cercle (blanc)
            track: "stroke-white/10", // Couleur de la piste (blanc)
            value: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-semibold text-white", // Style de la valeur et centrage (blanc)
          }}
          value={numberCommunities} // Valeur du chiffre
          strokeWidth={4}
          showValueLabel={true}
          format={(value) => `${value}%`} // Format personnalisé pour afficher le chiffre avec le pourcentage
        />
      </CardBody>
      <CardFooter className="justify-center items-center pt-0">
        <Chip
          classNames={{
            base: "border-1 border-white/30", // Couleur de la bordure (blanc)
            content: "text-white/90 text-small font-semibold", // Couleur du texte (blanc)
          }}
          variant="bordered"
        >
          {numberCommunities} Communautés
        </Chip>
      </CardFooter>
    </Card>
              </main>
        </>
    );
};

export default Statistics;