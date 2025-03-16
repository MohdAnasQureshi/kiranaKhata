import React, { useContext } from "react";
import styled from "styled-components";
import Button from "./Button";
import Heading from "./Heading";
import PropTypes from "prop-types";
import { ModalContext } from "./Modal";
import { capitalizeFirstLetter } from "../utils/helpers";

const StyledConfirmDelete = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  & p {
    color: var(--color-grey-600);
    margin-bottom: 1rem;
    font-size: 1.8rem;
  }

  & div {
    display: flex;
    justify-content: center;
    gap: 1.2rem;
  }
`;

function ConfirmDelete({ resourceName, disabled, onConfirm, content, size }) {
  const { close } = useContext(ModalContext);

  return (
    <StyledConfirmDelete>
      <Heading as="h3">Delete {capitalizeFirstLetter(resourceName)}</Heading>
      <p>
        {content
          ? content
          : `Are you sure you want to delete this
        ${capitalizeFirstLetter(resourceName)} permanently? This action cannot be
        undone and all the transactions of this customer will be deleted
        permanently.`}
      </p>

      <div>
        <Button
          $variation="secondary"
          size={size}
          disabled={disabled}
          onClick={close}
        >
          Cancel
        </Button>
        <Button
          $variation="danger"
          size={size}
          disabled={disabled}
          onClick={onConfirm}
        >
          Delete
        </Button>
      </div>
    </StyledConfirmDelete>
  );
}

ConfirmDelete.propTypes = {
  resourceName: PropTypes.string,
  disabled: PropTypes.bool,
  onConfirm: PropTypes.func,
  content: PropTypes.string,
  size: PropTypes.string,
};

export default ConfirmDelete;
