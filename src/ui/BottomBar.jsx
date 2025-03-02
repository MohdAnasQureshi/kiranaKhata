import React from "react";
import styled from "styled-components";
import MainNav from "./MainNav";

const StyledBottomBar = styled.div`
  background-color: var(--color-grey-0);
  border-top: 1px solid var(--color-grey-300);
  position: fixed;
  bottom: 0;
  width: 100vw;
  height: var(--height-bottombar);
  @media (min-width: 1024px) {
    height: 100vh;
    left: 0px;
    top: 50px;
    width: 30vw;
    padding: 3rem;
    border: none;
    border-right: 1px solid var(--color-grey-300);
  }
`;

const BottomBar = () => {
  return (
    <StyledBottomBar>
      <MainNav />
    </StyledBottomBar>
  );
};

export default BottomBar;
