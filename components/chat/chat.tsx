"use client"
import dynamic from 'next/dynamic';
import './chat.css';

const ChatEngine = dynamic(() =>
    import("react-chat-engine").then((module) => module.ChatEngine),
    { ssr: false }
);

const Chat = ({projectID, userName, userSecret }) => {
    return (
        <ChatEngine
            height="80vh"
            width="100%"
            projectID={projectID}
            userName={userName}
            userSecret={userSecret}
            onNewMessage={() => new Audio('https://chat-engine-assets.s3.amazonaws.com/click.mp3').play()}
        />
    );
};

export default Chat;