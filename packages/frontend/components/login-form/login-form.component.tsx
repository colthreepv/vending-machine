import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import useLogin from '../../src/hooks/login.hooks';

const LoginForm = () => {
  const { isLoggedIn, login, error } = useLogin();
  const router = useRouter()
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState('');

  if (isLoggedIn) router.push('/');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login(username, password);
  }

  return (
    <form className='flex flex-col gap-4' style={{ minHeight: '30vh' }} onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        className="input w-full max-w-xs"
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        className="input w-full max-w-xs"
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit" className="btn btn-primary">Sign in</button>
      {error && <div>{error}</div>}
    </form>
  );
}

export default LoginForm
