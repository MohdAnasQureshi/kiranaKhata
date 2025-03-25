import React, { useEffect, useState } from "react";
import { FaArrowDown, FaArrowLeft } from "react-icons/fa";
import PropTypes from "prop-types";
import styled, { css, keyframes } from "styled-components";

const StyledAddAnimation = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4rem;
  background-color: var(--color-grey-200);
  padding: 1rem;
  font-size: 1.7rem;
  font-weight: 500;
  border-radius: 5px;
  position: fixed;
  bottom: ${({ $bottom }) => ($bottom ? $bottom : "75px")};
  right: 0px;
  left: 0px;
  padding-top: 2rem;
  @media (min-width: 1024px) {
    left: 30vw;
    ${({ $bigscreen }) =>
      $bigscreen &&
      css`
        flex-direction: row-reverse;
        justify-content: flex-end;
        padding: 2rem;
        padding-left: 5rem;
        bottom: auto;
        top: 215px;
      `}
  }
`;

const bounceAnimation = ({ $bigscreen, $windowWidth }) => keyframes`
  0%, 100% {
    transform: ${
      $bigscreen && $windowWidth >= 1024
        ? "translateX(-50%)"
        : "translateY(-50%)"
    };
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: ${
      $bigscreen && $windowWidth >= 1024 ? "translateX(0)" : "translateY(0)"
    };
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
`;

const Button = styled.button`
  font-size: 18px;
  color: #585858;
  width: 40px;
  height: 40px;
  border: 1px solid #e7eae8;
  border-radius: 8px;
  cursor: pointer;
  margin-right: 1rem;
  animation: ${({ $bigscreen, $windowWidth }) => css`
    ${bounceAnimation({ $bigscreen, $windowWidth })} 0.8s infinite ease-in-out
  `};
`;

const AddAnimation = ({ children, bottom, bigscreen }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <StyledAddAnimation $bottom={bottom} $bigscreen={bigscreen}>
      <p>{children}</p>
      <Button $bigscreen={bigscreen} $windowWidth={windowWidth}>
        {windowWidth >= 1024 && bigscreen ? <FaArrowLeft /> : <FaArrowDown />}
      </Button>
    </StyledAddAnimation>
  );
};

AddAnimation.propTypes = {
  children: PropTypes.string,
  bottom: PropTypes.string,
  bigscreen: PropTypes.bool,
};

export default AddAnimation;
