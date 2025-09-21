import React from "react";
import styled from "styled-components";
import Logo from "./Logo";
import UserAvatar from "../features/authentication/UserAvatar";

const StyledHeader = styled.header`
  background-color: var(--color-brand-100);
  border-radius: 1px solid var(--color-grey-100);
  border-bottom: 1px solid var(--color-grey-500);
  position: fixed;
  padding: 2rem 1rem;
  z-index: 1;
  top: 0;
  height: 50px;
  width: 100vw;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Header = () => {
  return (
    <StyledHeader>
      <Logo />
      <UserAvatar />
    </StyledHeader>
  );
};

export default Header;
