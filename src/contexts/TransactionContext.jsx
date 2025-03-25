import React, { useMemo } from "react";
import { createContext, useContextSelector } from "use-context-selector";
import { useReducer } from "react";
import PropTypes from "prop-types";

const TransactionContext = createContext(null);

const transactionReducer = (state, action) => {
  switch (action.type) {
    case "SELECT_TRANSACTION":
      return state.includes(action.payload)
        ? state.filter((id) => id !== action.payload) // Remove if already selected
        : [...state, action.payload]; // Add if not selected

    case "SELECT_ALL_TRANSACTIONS":
      return action.payload;

    case "CLEAR_SELECTION":
      return [];

    default:
      return state;
  }
};

export const TransactionProvider = ({ children }) => {
  const [selectedTransactions, dispatch] = useReducer(transactionReducer, []);

  const value = useMemo(
    () => ({ selectedTransactions, dispatch }),
    [selectedTransactions]
  );

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

TransactionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useSelectedTransactions = () =>
  useContextSelector(
    TransactionContext,
    (context) => context.selectedTransactions
  );

export const useTransactionDispatch = () =>
  useContextSelector(TransactionContext, (context) => context.dispatch);
