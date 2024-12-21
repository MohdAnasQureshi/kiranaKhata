import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import styled from "styled-components";
import BottomBar from "./BottomBar";

const StyledAppLayout = styled.div`
  height: 100vh;
`;

const Main = styled.main`
  background-color: var(--color-grey-50);
  position: fixed;
  top: 50px;
  bottom: 65px;
  width: 100vw;
  padding: 4rem 4.8rem 6.4rem;
  overflow: scroll;
`;

const AppLayout = () => {
  return (
    <StyledAppLayout>
      <Header />
      <Main>
        <Outlet />
      </Main>
      <BottomBar />
    </StyledAppLayout>
  );
};

export default AppLayout;
