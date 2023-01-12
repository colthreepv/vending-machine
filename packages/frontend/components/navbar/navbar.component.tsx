import { useRouter } from 'next/router';
import styled from 'styled-components'
import useLogin from '../../src/hooks/login.hooks';

const NavbarContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
`

const RightAlignedItem = styled.div`
  display: flex;
  align-self: center;
  margin-left: auto;
  cursor: pointer;
`

const LoginButton = () => {
  const router = useRouter()

  return (
    <button className='btn btn-primary' onClick={() => router.push('/login')}>login</button>
  )
}

const LogoutButton = () => {
  const router = useRouter()

  return (
    <button className='btn btn-primary' onClick={() => router.push('/')}>logout</button>
  )
}

const LoggedInUser = () => {
  const { userData } = useLogin();

  if (userData == null) return null

  return (
    <div className='flex items-center space-x-4'>
      <span className='font-semibold text-xl'>{userData.sub}</span>
      <span className='font-mono text-md text-gray-400'>{userData.role}</span>
      <LogoutButton />
    </div>
  )
}

const Navbar = () => {
  const { isLoggedIn } = useLogin();

  console.log({ isLoggedIn })

  return <NavbarContainer>
    {!isLoggedIn && (<LoginButton />)}
    {isLoggedIn && (<LoggedInUser />)}
    <RightAlignedItem onClick={() => console.log('missing implementation 😥')}>🍔</RightAlignedItem>
  </NavbarContainer >;
};

export default Navbar
