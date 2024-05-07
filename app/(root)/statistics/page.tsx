"use client";

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
                <h1 className="font-bold text-2xl text-white">users qui poste le plus</h1>
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
                <h2 className="font-bold text-2xl text-white">Nombre d'utilisateurs sur le site au total</h2>
                </nav>
                
                <div className='flex md:space-x-20 '>
                
              <main className=' text-white text-xl'>
                    Nombre d'utilisateurs 
               <p>{numberUsers}</p>
        
              </main>
        
              </div>
              <nav className="flex justify-between mb-12 border-b border-gray-200 p-4 mt-5 mb-5">
                <h2 className="font-bold text-2xl text-white">Nombre d'utilisateurs sur le site au total</h2>
                </nav>
              <main className=' text-white text-xl'>
                    Nombre de communities au total
               <p>{numberCommunities}</p>
              </main>
        </>
    );
};

export default Statistics;