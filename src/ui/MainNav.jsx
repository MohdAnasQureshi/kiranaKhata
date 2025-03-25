import styled from "styled-components";
import React from "react";
import { NavLink } from "react-router-dom";
import { HiOutlineUserPlus, HiOutlineUsers } from "react-icons/hi2";
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";
import { AiOutlineHome } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";

const NavList = styled.ul`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  @media (min-width: 1024px) {
    flex-direction: column;
  }
`;

const StyledNavLink = styled(NavLink)`
  &:link,
  &:visited {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-direction: column;
    color: var(--color-grey-600);
    font-size: 1rem;
    font-weight: 500;
    padding: 0.8rem;
    transition: all 0.3s;
  }

  /* This works because react-router places the active class on the active NavLink */

  &:hover,
  &:active,
  &.active:link,
  &.active:visited {
    color: var(--color-grey-800);
    border-top: 2px solid var(--color-brand-600);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }

  &:hover svg,
  &:active svg,
  &.active:link svg,
  &.active:visited svg {
    color: var(--color-brand-600);
  }
  @media (min-width: 1024px) {
    &:link,
    :visited {
      flex-direction: row;
      justify-content: start;
      gap: 4rem;
      font-size: 1.8rem;
      padding: 2rem;
    }
    & svg {
      width: 3rem;
      height: 3rem;
    }

    &:hover,
    &:active {
      color: var(--color-grey-800);
      border-top: 0;
    }
    &.active:link,
    &.active:visited {
      color: var(--color-grey-800);
      border-top: 0;
      border-right: 2px solid var(--color-brand-600);
    }
    &:hover svg,
    &:active svg,
    &.active:link svg,
    &.active:visited svg {
      color: var(--color-brand-600);
      width: 3rem;
      height: 3rem;
    }
  }
`;

const StyledAddCustomer = styled(StyledNavLink)`
  &:link,
  :visited {
    padding-top: 0px;
  }

  & svg {
    color: var(--color-grey-400);
    height: 3.8rem;
    width: 3.8rem;
    transition: all 0.3s;
  }
  &:hover svg,
  &:active svg,
  &.active:link svg,
  &.active:visited svg {
    color: var(--color-brand-600);
    width: 4rem;
    height: 4rem;
  }

  @media (min-width: 1024px) {
    &:link,
    :visited {
      padding-top: 2rem;
    }
    & svg {
      color: var(--color-grey-600);
      height: 3.2rem;
      width: 3.2rem;
    }

    &:hover svg,
    &:active svg,
    &.active:link svg,
    &.active:visited svg {
      color: var(--color-brand-600);
      width: 3.2rem;
      height: 3.2rem;
    }
  }
`;

const MainNav = () => {
  return (
    <nav>
      <NavList>
        <li>
          <StyledNavLink to="/dashboard">
            <AiOutlineHome />
            <span>Home</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/customers">
            <HiOutlineUsers />
            <span>Customers</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledAddCustomer to="/addCustomer">
            <HiOutlineUserPlus />
            <span>Add Customer</span>
          </StyledAddCustomer>
        </li>
        <li>
          <StyledNavLink to="/stockOrderList">
            <HiOutlineClipboardDocumentCheck />
            <span>Stock List</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/settings">
            <IoSettingsOutline />
            <span>Settings</span>
          </StyledNavLink>
        </li>
      </NavList>
    </nav>
  );
};

export default MainNav;
