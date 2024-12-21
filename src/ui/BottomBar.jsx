import React from "react";
import styled from "styled-components";
import MainNav from "./MainNav";

const StyledBottomBar = styled.div`
  background-color: var(--color-grey-0);
  border-top: 1px solid var(--color-grey-200);
  box-shadow: 0 -4px 6px var(--color-grey-100);
  position: fixed;
  bottom: 0;
  width: 100vw;
  height: 65px;
`;

const BottomBar = () => {
  return (
    <StyledBottomBar>
      <MainNav />
    </StyledBottomBar>
  );
};

export default BottomBar;
