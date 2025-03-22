import React from "react";
import { Modal } from "./Modal";
import styled from "styled-components";
import PropTypes from "prop-types";
import { BsSortAlphaDown } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";

const StyledSelect = styled.div`
  border: 1px solid var(--color-grey-200);
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  border-radius: var(--border-radius-sm);
  padding: 0.4rem;
  display: flex;
  gap: 0.4rem;
  &:active {
    background-color: var(--color-grey-300);
  }
`;

const SortOption = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  border-radius: var(--border-radius-sm);
  padding: 0 1rem 0 0;

  & :nth-child(1) {
    flex-grow: 1;
  }

  &:active {
    background-color: var(--color-grey-200);
    color: var(--color-brand-700);
  }
`;

const RadioInput = styled.input`
  appearance: none;
  border-radius: 50%;
  outline: 2px solid var(--color-grey-400);
  border: none;
  height: 10px;
  width: 10px;
  cursor: pointer;
  padding: 0;
  &:checked {
    background-color: var(--color-brand-600);
    outline: 2px solid var(--color-brand-600);
    outline-offset: 2px;
  }
  &:focus {
    outline: 2px solid var(--color-brand-600);
    outline-offset: 2px;
  }
`;

const Label = styled.label`
  border: none;
  border-radius: var(--border-radius-sm);
  color: ${({ color }) => color};
  font-weight: 500;
  font-size: 1.5rem;
  padding: 0.44rem 0.8rem;
  transition: all 0.4s;
  cursor: pointer;
`;

const SortLabel = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
`;

const Select = ({ options, onChange, value: currentSortBy }) => {
  return (
    <StyledSelect>
      <Modal>
        <Modal.Open opens="sort-modal">
          <SortLabel>
            Sort
            <BsSortAlphaDown
              size={18}
              color={currentSortBy !== "recent" ? "var(--color-brand-600)" : ""}
            />
            {currentSortBy !== "recent" && (
              <GoDotFill
                size={15}
                style={{
                  position: "absolute",
                  top: "20%",
                  right: "2px",
                  transform: " translateY(-50%) translateX(50%)",
                  color: "var(--color-brand-600)",
                }}
              />
            )}
          </SortLabel>
        </Modal.Open>
        <Modal.Window
          name="sort-modal"
          style={{
            justifyContent: "center",
            padding: "2rem",
            boxShadow: "0 4px 5px var(--color-grey-300)",
          }}
        >
          {options.map((option) => (
            <SortOption key={option.value}>
              <Label
                htmlFor={option.value}
                color={
                  option.value === currentSortBy
                    ? "var(--color-brand-800)"
                    : "var(--color-grey-500)"
                }
              >
                {option.label}
              </Label>
              <RadioInput
                name="sortBy"
                type="radio"
                onChange={onChange}
                value={option.value}
                id={option.value}
                checked={option.value === currentSortBy}
                disabled={option.value === currentSortBy}
              />
            </SortOption>
          ))}
        </Modal.Window>
      </Modal>
    </StyledSelect>
  );
};

Select.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default Select;
