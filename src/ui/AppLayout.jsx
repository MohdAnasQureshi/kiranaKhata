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
  padding: 2rem 2rem 2rem;
  @media (min-width: 1024px) {
    right: 0px;
    bottom: 0px;
    width: 70vw;
  }
`;

const Container = styled.div`
  max-width: 120rem;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;

const AppLayout = () => {
  return (
    <StyledAppLayout>
      <Header />

      <Main>
        <Container>
          <Outlet />
        </Container>
      </Main>

      <BottomBar />
    </StyledAppLayout>
  );
};

export default AppLayout;
