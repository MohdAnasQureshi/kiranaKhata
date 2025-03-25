import React from "react";
import AddTransactionForm from "../features/transactions/AddTransactionForm";
import { TransactionProvider } from "../contexts/TransactionContext";

const AddTransaction = () => {
  return (
    <TransactionProvider>
      <AddTransactionForm />
    </TransactionProvider>
  );
};

export default AddTransaction;
