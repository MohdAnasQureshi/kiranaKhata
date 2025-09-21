import React from "react";
import { HiOutlineBanknotes } from "react-icons/hi2";
import PropTypes from "prop-types";
import Stat from "./Stat";
import { formatCurrency } from "../../utils/helpers";
import { FcDebt } from "react-icons/fc";
import { LuUsers } from "react-icons/lu";

function Stats({ customers }) {
  const totalCustomers = customers.data.length;
  let totalDebtors = 0;

  const totalDebtAmount = customers.data.reduce((debt, current) => {
    if (current.totalOutstandingDebt > 0) {
      totalDebtors++;
      return (debt += current.totalOutstandingDebt);
    } else return debt;
  }, 0);

  return (
    <>
      <Stat
        title="Total Customers"
        color="blue"
        icon={<LuUsers />}
        value={totalCustomers}
      />
      <Stat
        title="Total Debt"
        color="red"
        icon={<HiOutlineBanknotes />}
        value={formatCurrency(totalDebtAmount)}
      />
      <Stat
        title="Total Debtors"
        color="indigo"
        icon={<FcDebt />}
        value={totalDebtors}
      />
    </>
  );
}

Stats.propTypes = {
  customers: PropTypes.object,
};

export default Stats;
