import React from 'react';

const TopLikeList = ({ likes } : any) => {
    return (
        <div>
            <h2>Top threads</h2>
            <ul>
                {likes.map(thread => (
                    <li key={thread._id}> {/* Utilisez une clé unique, comme _id */}
                        <p>Auteur du thread : {thread.authorName}</p>
                        <p>Contenu du thread : {thread.text}</p>
                        <p>Nombre de likes du thread : {thread.numberTopLikes}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TopLikeList;