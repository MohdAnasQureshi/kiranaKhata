import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Select from "./Select";
import { useSearchParams } from "react-router-dom";

const SortBy = ({ options }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [appliedSort, setAppliedSort] = useState(
    localStorage.getItem("appliedSort") || "recent"
  );

  useEffect(() => {
    localStorage.setItem("appliedSort", appliedSort);
  }, [appliedSort]);

  function handleChange(e) {
    searchParams.set("sortBy", e.target.value);
    setSearchParams(searchParams);
    setAppliedSort(e.target.value);
  }

  return (
    <Select options={options} onChange={handleChange} value={appliedSort} />
  );
};

SortBy.propTypes = {
  options: PropTypes.array.isRequired,
};

export default SortBy;
