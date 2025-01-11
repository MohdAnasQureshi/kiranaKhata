import React from "react";
import Form from "../../ui/Form";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import { useAddTransaction } from "./useAddTransaction";
import toast from "react-hot-toast";
import { useLocation, useParams } from "react-router-dom";

import Textarea from "../../ui/Textarea";

const TransactionForm = styled(Form)`
  display: grid;

  gap: 5px;
  /* width: 60vw; */
  margin: 0 auto; /* Optional: centers the grid container */
  position: fixed;
  right: 0px;
  left: 0px;
  bottom: 65px;
  /* background-color: red; */

  margin: 0 auto; /* Centers the grid container */

  grid-template-columns: auto auto auto;
  padding: 0.5rem;
  width: 100vw;
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  align-items: center;
  /* justify-content: end; */
  /* background-color: lightblue;  */
  /* padding: 20px; */
  text-align: center;

  /* padding: 1rem; */

  &:nth-child(1) {
    grid-column-start: 1;
    grid-column-end: 2;
    justify-content: center;
    /* padding-left: 10px; */
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

  /* &:nth-child(4) {
    width: 20vw;
  } */

  /* &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  } */
`;

const Label = styled.label`
  font-weight: 500;
  font-size: 2rem;
`;

const RadioInput = styled.input`
  appearance: none; /* Removes default radio button styling */
  border-radius: 50%; /* Makes it circular */
  outline: none;
  border: 2px solid red;
  height: 15px;
  width: 15px;
  cursor: pointer;
  padding: 0;
  &:checked {
    background-color: ${({ color }) => color || "#ff6565"};
  }
  &:focus {
    outline: ${({ color }) => `2px solid ${color ? color : "red"}`};
    outline-offset: 1px;
  }
`;

// const Error = styled.span`
//   font-size: 1.4rem;
//   color: var(--color-red-700);
// `;

const AddTransactionForm = () => {
  const { customerId } = useParams(); // Get customerId from URL
  const { register, handleSubmit, reset } = useForm();

  const { mutate: addTransaction, isAdding } = useAddTransaction(
    reset,
    customerId
  );
  const location = useLocation();
  const { customerName, customerContact } = location.state || {};

  function onAddTransaction(data) {
    if (!customerId) {
      toast.error("No customer added");
      return;
    }
    addTransaction(data);
  }

  return (
    <>
      <div>
        {customerName} {customerContact}
      </div>
      <TransactionForm onSubmit={handleSubmit(onAddTransaction)}>
        <FormRow>
          <Input
            style={{
              maxWidth: "30vw",
              border: "1px solid var(--color-brand-700)",
            }}
            type="number"
            id="amount"
            placeholder="Amount.."
            disabled={isAdding}
            {...register("amount", {
              required: "Amount is required",
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
              height: "4.5rem",
              fontSize: "2rem",
              border: "1px solid var(--color-brand-700)",
            }}
            disabled={isAdding}
            placeholder="Details.."
            {...register("transactionDetails")}
          />
        </FormRow>

        <FormRow>
          <Button
            disabled={isAdding}
            style={{
              borderRadius: "50px",
              fontSize: "3rem",
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
