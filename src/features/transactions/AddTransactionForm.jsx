import React, { useEffect } from "react";
import Form from "../../ui/Form";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import { useAddTransaction } from "./useAddTransaction";
import toast from "react-hot-toast";
import { useLocation, useParams } from "react-router-dom";

import Textarea from "../../ui/Textarea";
import AllTransactions from "./AllTransactions";

const CustomerDetailRow = styled.div`
  font-size: 2rem;
  background-color: red;
`;

const TransactionForm = styled(Form)`
  display: grid;
  gap: 5px;
  position: fixed;
  right: 0px;
  left: 0px;
  bottom: 68px;
  margin: 0 auto;
  grid-template-columns: auto auto auto;
  padding: 0.5rem;
  width: 100vw;
  @media (min-width: 1024px) {
    left: 25vw;
    width: 48vw;
    bottom: 10px;
  }
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  align-items: center;
  text-align: center;

  &:nth-child(1) {
    grid-column-start: 1;
    grid-column-end: 2;
    justify-content: center;
  }
  &:nth-child(2) {
    grid-column-start: 2;
    grid-column-end: 4;
    justify-content: center;
  }

  &:nth-child(3) {
    grid-column-start: 1;
    grid-column-end: 3;
  }

  @media (min-width: 1024px) {
    &:nth-child(1) {
      grid-column-start: 1;
      grid-column-end: 2;
      justify-content: flex-start;
    }
  }
`;

const Label = styled.label`
  font-weight: 500;
  font-size: 1.7rem;
`;

const RadioInput = styled.input`
  appearance: none;
  border-radius: 50%;
  outline: none;
  border: 2px solid red;
  height: 15px;
  width: 15px;
  cursor: pointer;
  padding: 0;
  &:checked {
    background-color: ${({ color }) => color || "#ff6565"};
    outline: ${({ color }) => `2px solid ${color ? color : "red"}`};
    outline-offset: 1px;
  }
  &:focus {
    outline: ${({ color }) => `2px solid ${color ? color : "red"}`};
    outline-offset: 1px;
  }
`;

const AddTransactionForm = () => {
  const { customerId } = useParams(); // Get customerId from URL
  const { register, handleSubmit, reset, setValue } = useForm();
  const { mutate: addTransaction, isAdding } = useAddTransaction(
    reset,
    customerId
  );
  const location = useLocation();
  const { customerName, customerContact } = location.state || {};

  useEffect(() => {
    // Retrieve data from localStorage
    const amount = localStorage.getItem(`amount_${customerId}`);
    const transactionType = localStorage.getItem(
      `transactionType_${customerId}`
    );
    const transactionDetails = localStorage.getItem(
      `transactionDetails_${customerId}`
    );

    // Populate the form fields if data exists
    if (amount) setValue("amount", amount);
    if (transactionType) setValue("transactionType", transactionType);
    if (transactionDetails) setValue("transactionDetails", transactionDetails);
  }, [setValue]);

  function onAddTransaction(data) {
    if (!customerId) {
      toast.error("No customer added");
      return;
    }
    addTransaction(data);
    localStorage.setItem(`amount_${customerId}`, "");
    localStorage.setItem(`transactionType_${customerId}`, "");
    localStorage.setItem(`transactionDetails_${customerId}`, "");
  }

  function handleChange(e) {
    const { id, value } = e.target; // Get the element's id and value
    if (id === "amount") {
      localStorage.setItem(`amount_${customerId}`, value);
    }
    if (id === "debt" || id === "payment") {
      localStorage.setItem(`transactionType_${customerId}`, value);
    }
    if (id === "transactionDetails") {
      localStorage.setItem(`transactionDetails_${customerId}`, value);
    }
  }

  return (
    <>
      <CustomerDetailRow>
        {customerName} {customerContact}
      </CustomerDetailRow>
      <AllTransactions />
      <TransactionForm onSubmit={handleSubmit(onAddTransaction)}>
        <FormRow>
          <Input
            style={{
              maxWidth: "30vw",
              border: "1px solid var(--color-brand-700)",
              fontSize: "1.6rem",
            }}
            type="number"
            id="amount"
            placeholder="Amount.."
            min="0"
            step="0.01"
            disabled={isAdding}
            {...register("amount", {
              required: "Amount is required",
              onChange: handleChange,
            })}
          />
        </FormRow>
        <FormRow>
          <RadioInput
            type="radio"
            disabled={isAdding}
            name="transactionType"
            value="debt"
            id="debt"
            placeholder="Debt"
            {...register("transactionType", {
              required: "Required",
              onChange: handleChange,
            })}
          />
          <Label htmlFor="debt">Debt</Label>
          <RadioInput
            type="radio"
            disabled={isAdding}
            name="transactionType"
            value="payment"
            id="payment"
            color="#3db469"
            style={{ border: "2px solid green" }}
            {...register("transactionType", {
              required: "Required",
              onChange: handleChange,
            })}
          />
          <Label htmlFor="payment">Payment</Label>
        </FormRow>

        <FormRow>
          <Textarea
            type="text"
            id="transactionDetails"
            style={{
              width: "28rem",
              height: "4rem",
              fontSize: "1.7rem",
              border: "1px solid var(--color-brand-700)",
              resize: "none",
            }}
            disabled={isAdding}
            placeholder="Details.."
            {...register("transactionDetails", {
              onChange: handleChange,
            })}
          />
        </FormRow>

        <FormRow>
          <Button
            disabled={isAdding}
            style={{
              borderRadius: "50px",
              fontSize: "2.5rem",
              padding: "0.2rem 2.4rem",
            }}
          >
            +
          </Button>
        </FormRow>
      </TransactionForm>
    </>
  );
};

export default AddTransactionForm;
