import React from 'react';

const AuthorList = ({ authors }) => {
    return (
        <div>
            <h2>Utilisateurs les plus actifs</h2>
            <ul>
                {authors.map(author => (
                    <li key={author.authorId}>
                        {author.name} - Threads: {author.count}
                        
                        
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AuthorList;