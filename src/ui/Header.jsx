import React from "react";
import styled from "styled-components";
import Logo from "./Logo";

const StyledHeader = styled.header`
  background-color: var(--color-brand-600);
  border-radius: 1px solid var(--color-grey-100);
  position: fixed;
  z-index: 1;
  top: 0;
  height: 50px;
  width: 100vw;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Header = () => {
  return (
    <StyledHeader>
      <Logo />
    </StyledHeader>
  );
};

export default Header;
