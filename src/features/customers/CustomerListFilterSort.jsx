import React from "react";
import ListOperations from "../../ui/ListOperations";
import Filter from "../../ui/Filter";
import SortBy from "../../ui/SortBy";

const CustomerListFilterSort = () => {
  return (
    <ListOperations>
      <Filter
        filterField="status"
        options={[
          {
            value: "all",
            label: "All",
          },
          { value: "debtors", label: "Debtors" },
          { value: "depositors", label: "Depositors" },
          { value: "settled", label: "Settled" },
        ]}
      />
      <SortBy
        options={[
          { value: "recent", label: "Most Recent" },
          { value: "highest-debt", label: "Highest Amount" },
          { value: "oldest", label: "Oldest Customer" },
          { value: "least-debt", label: "Least Amount" },
          { value: "name-asc", label: "By Name (A-Z)" },
          { value: "name-desc", label: "By Name (Z-A)" },
        ]}
      />
    </ListOperations>
  );
};

export default CustomerListFilterSort;
