"use client";

// Importation des bibliothèques et composants nécessaires
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { fetchTopAuthors,fetchNumberOfUsers } from '@/lib/actions/statistics'; // Replace with your actual path

// Importation dynamique du StatisticsChart pour s'assurer qu'il est rendu uniquement côté client
// Importation dynamique pour s'assurer qu'elle est rendue côté client
const AuthorList = dynamic(() => import('@/components/forms/AuthorList'), { ssr: false });
const Statistics = () => {
    const [topAuthors, setTopAuthors] = useState([0]);
    const [numberUsers,setNumberUsers]=useState(0)
    useEffect(() => {
        const loadTopAuthors = async () => {
            const authors = await fetchTopAuthors();
            setTopAuthors(authors);
        };
        loadTopAuthors();
    }, []);
    useEffect(()=>{
     const loadNumberOfUsers=async() => {
        const numberOfUsers=await fetchNumberOfUsers();
        setNumberUsers(numberOfUsers)
        
     }
     loadNumberOfUsers();
    }
    
    )


    return (
        <>
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
            <nav className="flex justify-between mb-12 border-b border-gray-200 p-4 mt-5 mb-5">
                <h2 className="font-bold text-2xl text-white">Nombre d'utilisateurs sur le site au total</h2>
                </nav>
              <main className=' text-white text-xl'>
                    Nombre d'utilisateurs 
               <p>{numberUsers}</p>
              </main>
            
        </>
    );
};

export default Statistics;