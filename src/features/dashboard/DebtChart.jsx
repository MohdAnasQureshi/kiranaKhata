import React from "react";
import styled from "styled-components";
import DashboardBox from "./DashboardBox";
import Heading from "../../ui/Heading";
import PropTypes from "prop-types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";

const StyledDebtChart = styled(DashboardBox)`
  grid-column: 1 / -1;

  /* Hack to change grid line colors */
  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300);
  }
`;

function DebtChart({ customers }) {
  let isDarkMode = true;

  const allDates = eachDayOfInterval({
    start: subDays(new Date(), 20),
    end: new Date(),
  });

  const data = allDates.map((date) => {
    return {
      label: format(date, "MMM dd"),
      totalDebt: customers.data
        .filter((customer) => isSameDay(date, new Date(customer.updatedAt)))
        .reduce((acc, cur) => {
          if (cur.totalOutstandingDebt > 0)
            return acc + cur.totalOutstandingDebt;
          else return acc;
        }, 0),
    };
  });

  const colors = isDarkMode
    ? {
        totalDebt: { stroke: "#4f46e5", fill: "#4f46e5" },

        text: "#e5e7eb",
        background: "#18212f",
      }
    : {
        totalDebt: { stroke: "#4f46e5", fill: "#c7d2fe" },

        text: "#374151",
        background: "#fff",
      };

  return (
    <StyledDebtChart>
      <Heading as="h2">
        Debts from {format(allDates.at(0), "MMM dd yyyy")} &mdash;{" "}
        {format(allDates.at(-1), "MMM dd yyyy")}{" "}
      </Heading>

      <ResponsiveContainer height={300} width="100%" className="!pt-0 !pb-0">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="4" />
          <XAxis
            dataKey="label"
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <YAxis
            unit="Rs"
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
            domain={[0, "dataMax + 100"]}
          />

          <Tooltip contentStyle={{ backgroundColor: colors.background }} />
          <Bar
            dataKey="totalDebt"
            type="monotone"
            stroke={colors.totalDebt.stroke}
            fill={colors.totalDebt.fill}
            strokeWidth={4}
            name="Total Debt"
            unit=" Rs"
          />
        </BarChart>
      </ResponsiveContainer>
    </StyledDebtChart>
  );
}

DebtChart.propTypes = {
  customers: PropTypes.object.isRequired,
};

export default DebtChart;
