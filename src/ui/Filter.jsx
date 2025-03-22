import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";
import styled, { css } from "styled-components";
import { Modal } from "./Modal";
import { FiFilter } from "react-icons/fi";
import { GoDotFill } from "react-icons/go";

const StyledFilter = styled.div`
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

const FilterLabel = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
`;

const FilterButton = styled.button`
  background-color: var(--color-grey-0);
  border: none;

  ${(props) =>
    props.$active &&
    css`
      background-color: var(--color-brand-600);
      color: var(--color-brand-50);
    `}

  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;
  /* To give the same height as select */
  padding: 0.44rem 0.8rem;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }
`;

const Filter = ({ filterField, options }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [appliedFilter, setAppliedFilter] = useState(
    localStorage.getItem("appliedFilter") || "all"
  );

  useEffect(() => {
    localStorage.setItem("appliedFilter", appliedFilter);
  }, [appliedFilter]);

  function handleClick(value) {
    searchParams.set(filterField, value);
    setSearchParams(searchParams);
    setAppliedFilter(value);
  }
  return (
    <StyledFilter>
      <Modal>
        <Modal.Open opens="filter-modal">
          <FilterLabel>
            Filter
            <FiFilter
              color={appliedFilter !== "all" ? "var(--color-brand-600)" : ""}
            />
            {appliedFilter !== "all" && (
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
          </FilterLabel>
        </Modal.Open>
        <Modal.Window
          name="filter-modal"
          style={{
            right: "15%",
            padding: "2rem",
            boxShadow: "0 4px 5px var(--color-grey-300)",
          }}
        >
          {options.map((option) => (
            <FilterButton
              key={option.value}
              onClick={() => handleClick(option.value)}
              $active={option.value === appliedFilter}
              disabled={option.value === appliedFilter}
            >
              {option.label}
            </FilterButton>
          ))}
        </Modal.Window>
      </Modal>
    </StyledFilter>
  );
};

Filter.propTypes = {
  filterField: PropTypes.string,
  options: PropTypes.array,
};

export default Filter;
