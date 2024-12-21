import styled from "styled-components";
import React from "react";

const StyledLogo = styled.div`
  text-align: center;
  font-size: 2.4rem;
  color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
`;

const Img = styled.img`
  height: 3.5rem;
  width: auto;
`;

function Logo() {
  return (
    <StyledLogo>
      <Img src="./kiranakhata-logo.png" alt="Logo" />
      <span>kiranaKhata</span>
    </StyledLogo>
  );
}

export default Logo;
