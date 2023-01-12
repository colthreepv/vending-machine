import { useRouter } from 'next/router';
import styled from 'styled-components'
import useLogin from '../../hooks/login.hooks';

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

const LoginButton = styled.button`
  min-height: 40px;
  background-color: blueviolet;
  font-size: large;
`

const Navbar = () => {
  const { isLoggedIn } = useLogin();
  const router = useRouter()

  return <NavbarContainer>
    {!isLoggedIn && (<LoginButton onClick={() => router.push('/login')}>login</LoginButton>)}
    <RightAlignedItem onClick={() => console.log('missing implementation 😥')}>🍔</RightAlignedItem>
  </NavbarContainer>;
};

export default Navbar
