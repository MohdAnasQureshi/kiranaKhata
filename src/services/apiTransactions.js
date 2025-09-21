import axios from "axios";

export async function addTransaction(transaction, customerId) {
  const { data, error } = await axios.post(
    `http://192.168.1.20:8000/api/v1/shopOwners/transactions/add-transaction/${customerId}`,
    transaction,
    {
      withCredentials: true,
    }
  );

  if (error) {
    console.error(error.request.response);
    throw new Error("Transaction cannot be added");
  }
  return data;
}

export async function getAllTransactions(customerId) {
  const { data, error } = await axios.get(
    `http://192.168.1.20:8000/api/v1/shopOwners/transactions/all-transactions/${customerId}`,
    {
      withCredentials: true,
    }
  );

  if (error) {
    console.error(error.request.response);
    throw new Error("Transactions cannot be found");
  }
  return data;
}

export async function editTransaction(
  editedTransaction,
  customerId,
  transactionId
) {
  const { data, error } = await axios.put(
    `http://192.168.1.20:8000/api/v1/shopOwners/transactions/edit-transaction/${customerId}/${transactionId}`,
    editedTransaction,
    {
      withCredentials: true,
    }
  );

  if (error) {
    console.error(error.request.response);
    throw new Error("Transaction cannot be edited");
  }
  return data;
}

export async function deleteTransaction(customerId, transactionId) {
  const { data, error } = await axios.delete(
    `http://192.168.1.20:8000/api/v1/shopOwners/transactions/delete-transaction/${customerId}/${transactionId}`,
    {
      withCredentials: true,
    }
  );

  if (error) {
    console.error(error.request.response);
    throw new Error("Transaction cannot be deleted");
  }
  return data;
}
