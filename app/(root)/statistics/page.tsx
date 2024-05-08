"use client";

// Importation des bibliothèques et composants nécessaires
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { fetchTopAuthors, fetchNumberOfUsers, fetchNumberOfCommunities, fetchThreadsLikes } from '@/lib/actions/statistics';
import TopLikeList from '@/components/forms/TopLikeList';

// Importation dynamique de AuthorList pour s'assurer qu'il est rendu uniquement côté client
const AuthorList = dynamic(() => import('@/components/forms/AuthorList'), { ssr: false });

const Statistics = () => {
    const [topAuthors, setTopAuthors] = useState([]);
    const [topThreadLikes, setTopThreadLikes] = useState([]);
    const [numberUsers, setNumberUsers] = useState(0);
    const [numberCommunities, setNumberCommunities] = useState(0);
//chargement des meilleurs auteurs
    useEffect(() => {
        const loadTopAuthors = async () => {
            const authors = await fetchTopAuthors();
            setTopAuthors(authors);
        };
        loadTopAuthors();
    }, []);
//chargment des threads les plus aimés
    useEffect(() => {
        const loadTopThreadsLikes = async () => {
            const topLikes = await fetchThreadsLikes();
            setTopThreadLikes(topLikes);
        };
        loadTopThreadsLikes();
    }, []);
//chargement du nombre d'utilisateurs
    useEffect(() => {
        const loadNumberOfUsers = async () => {
            const numberOfUsers = await fetchNumberOfUsers();
            setNumberUsers(numberOfUsers);
        };
        loadNumberOfUsers();
    }, []);
//chargement du nombre de communautés
    useEffect(() => {
        const loadNumberOfCommunities = async () => {
            const numberOfCommunities = await fetchNumberOfCommunities();
            setNumberCommunities(numberOfCommunities);
        };
        loadNumberOfCommunities();
    }, []);
//affichage des statistiques
    return (
        <>
            <section><h1 className="head-text mb-10">Statistiques</h1></section>
            <nav className="flex justify-between mb-12 border-b border-gray-200 p-4">
                <h1 className="font-bold text-2xl text-white">Utilisateurs qui postent le plus</h1>
            </nav>
            <main className="p-4 text-white ">
                {topAuthors.length > 0 ? (
                    <AuthorList authors={topAuthors} />
                ) : (
                    <p>Chargement des meilleurs auteurs...</p>
                )}
            </main>
            <nav className="flex justify-between mb-12 border-b border-gray-200 p-4 mb-5 mt-5">
                <h1 className="font-bold text-2xl text-white">Threads avec le plus de likes</h1>
            </nav>
            <main className="p-4 text-white ">
                {topThreadLikes.length > 0 ? (
                    <TopLikeList likes={topThreadLikes} />
                ) : (
                    <p>Chargement des threads les plus aimés...</p>
                )}
            </main>
            <nav className="flex justify-between mb-12 border-b border-gray-200 p-4 mt-5 mb-5">
                <h2 className="font-bold text-2xl text-white">Nombre total d'utilisateurs sur le site</h2>
            </nav>
            <main className='text-white text-xl'>
                Nombre d'utilisateurs
                <p>{numberUsers}</p>
            </main>
            <nav className="flex justify-between mb-12 border-b border-gray-200 p-4 mt-5 mb-5">
                <h2 className="font-bold text-2xl text-white">Nombre total de communautés sur le site</h2>
            </nav>
            <main className='text-white text-xl'>
                Nombre de communautés
                <p>{numberCommunities}</p>
            </main>
        </>
    );
};

export default Statistics;