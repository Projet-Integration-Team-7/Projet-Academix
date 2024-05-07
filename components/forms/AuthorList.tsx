import React, { useState, useEffect } from 'react';
import BarChart from '../charts/BarChart';


const AuthorList = ({ authors }) => {
    const [userData, setUserData] = useState({
        labels: [],
        datasets: [{
            label: "Top thread posted per User",
            data: []
        }]
    });

    useEffect(() => {
        // Mettre à jour userData lorsque likes change
        setUserData({
            labels: authors.map((author: any) => author.name),
            datasets: [{
                label: "Top thread posted per User",
                data: authors.map((author: any) => author.count),
                backgroundColor: ["#336699"],
                borderColor: "BLACK",
                borderWidth: 2,
                barPercentage: 0.5,
                barThickness: 50,
                maxBarThickness: 70,
                minBarLength: 30,

            }]
        });
    }, [authors]); 
    return (
        <div className='flex md:space-x-20'>
            <div >
            <h2 className='font-bold mb-20 '>Most Active Authors : </h2>
            <ul>
                {authors.map((author : any) => (
                    <li key={author.authorId}>
                        {author.name} - Threads: {author.count}
                        
                        
                    </li>
                ))}
            </ul>
            </div>

            <div>
            <h1 className='center-mid mb-5 text-center'>Top thread posted per User</h1>

            <div style={{width : 500}} className='text-center'>
            <BarChart 
            chartData={userData}/>
            </div>
            </div>
        </div>
    );
};

export default AuthorList;