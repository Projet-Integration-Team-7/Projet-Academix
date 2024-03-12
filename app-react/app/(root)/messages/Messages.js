import { useRouter } from 'next/router';
import { ChatEngine } from 'chat-engine';
import './Messages.css';

const Messages = () => {
  const router = useRouter();
  const { username, userSecret } = router.query;

  return (
    <ChatEngine
      height="100vh"
      projectID="ae98d825-7c13-4e73-9b3d-05688c4a56f0"
      username={username || 'test'}
      userSecret={userSecret || '1234'}
    />
  );
};

export default Messages;