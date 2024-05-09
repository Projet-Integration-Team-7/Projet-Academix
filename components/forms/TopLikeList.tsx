import React, { useState, useEffect } from 'react';
import BarChart from '../charts/BarChart';

const TopLikeList = ({ likes }: any) => {
    const [userData, setUserData] = useState({
        labels: [],
        datasets: [{
            label: "likes of the thread posted",
            data: []
        }]
    });

    useEffect(() => {
        // Mettre à jour userData lorsque likes change
        setUserData({
            labels: likes.map((thread: any) => thread.authorInfo ?"Thread de "+ thread.authorInfo.name : 'pas defini'),
            datasets: [{
                label: "likes of the thread posted",
                data: likes.map((thread: any) => thread.likesCount),
                backgroundColor: ["#d9f99d"],
                borderColor: "BLACK",
                borderWidth: 2,
                barPercentage: 0.5,
                barThickness: 50,
                maxBarThickness: 70,
                minBarLength: 30,

            }]
        });
    }, [likes]); 
    return (
        
        <div className='flex md:space-x-20'>
            <div>
            <h2 className='font-bold  mb-20'>Top threads : </h2>
            
            <ul>
                {likes.map((thread: any) => (
                    <li key={thread._id}>
                        <div className='mt-5 mb-5'>
                        <p>Auteur du thread : {thread.authorInfo ? thread.authorInfo.name : 'Auteur inconnu'}</p>
                        <p>Nombre de likes du thread : {thread.likesCount}</p>
                        </div>
                    </li>
                ))}
            </ul>
            </div>
           <div>
         <h1 className='center-mid mb-5 mt-10 text-center'>Likes of the thread posted</h1>
            <div style={{width : 500}} className='text-center'>
            <BarChart 
            chartData={userData}/>
            </div>
            </div>
        
        </div>
    );
};

export default TopLikeList;
