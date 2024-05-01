import React from 'react';

const TopLikeList = ({ likes }: any) => {
    return (
        <div>
            <h2>Top threads</h2>
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
    );
};

export default TopLikeList;
