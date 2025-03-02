import React, {
  cloneElement,
  createContext,
  useContext,
  useState,
} from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";
import { useOutsideClick } from "../hooks/useOutsideClick";
import { HiXMark } from "react-icons/hi2";

const StyledModal = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 100px;
  right: 5px;
  gap: 0.5rem;
  padding: 2rem 4rem 3rem 2rem;
  font-size: 1.8rem;
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);

  & > * {
    padding: 0.5rem;
    cursor: pointer;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1000;
  transition: all 0.5s;
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;
  cursor: pointer;
  &:hover {
    background-color: var(--color-grey-200);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    /* Sometimes we need both */
    /* fill: var(--color-grey-500);
    stroke: var(--color-grey-500); */
    color: var(--color-grey-500);
  }
`;

export const ModalContext = createContext();

export function Modal({ children }) {
  const [openName, setOpenName] = useState("");

  const close = () => setOpenName("");
  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({ children, opens: opensWindowName }) {
  const { open } = useContext(ModalContext);

  return cloneElement(children, {
    onClick: () => {
      open(opensWindowName);
    },
  });
}
function Window({ children, name, style, overlayStyle, showCloseBtn = false }) {
  const { openName, close } = useContext(ModalContext);

  const ref = useOutsideClick(close);

  if (name !== openName) return null;

  return createPortal(
    <Overlay style={overlayStyle}>
      <StyledModal ref={ref} style={style}>
        {showCloseBtn && (
          <Button onClick={close}>
            <HiXMark />
          </Button>
        )}
        {children}
      </StyledModal>
    </Overlay>,
    document.body
  );
}

Modal.Open = Open;
Modal.Window = Window;

Modal.propTypes = {
  children: PropTypes.node,
};

Window.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string,
  width: PropTypes.string,
  style: PropTypes.object,
  overlayStyle: PropTypes.object,
  showCloseBtn: PropTypes.bool,
};
