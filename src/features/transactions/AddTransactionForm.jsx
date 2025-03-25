import React, { useContext, useEffect } from "react";
import Form from "../../ui/Form";
import Textarea from "../../ui/Textarea";
import AllTransactions from "./AllTransactions";
import TransactionHeader from "./TransactionHeader";
import toast from "react-hot-toast";
import styled, { css } from "styled-components";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import PropTypes from "prop-types";
import { useAddTransaction } from "./useAddTransaction";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useEditTransaction } from "./useEditTransaction";
import { ModalContext } from "../../ui/Modal";
import { useTransactionDispatch } from "../../contexts/TransactionContext";

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

  ${({ $isEditSession }) =>
    $isEditSession &&
    css`
      position: static;
      bottom: 0;
      width: auto;
    `}

  @media (min-width: 1024px) {
    left: 25vw;
    width: 48vw;
    bottom: 10px;

    ${({ $isEditSession }) =>
      $isEditSession &&
      css`
        position: static;
        bottom: 0;
      `}
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
  padding-right: 1rem;
`;

const RadioInput = styled.input`
  appearance: none;
  border-radius: 50%;
  outline: 2px solid var(--color-grey-400);
  border: none;
  height: 12px;
  width: 12px;
  cursor: pointer;
  padding: 0;
  &:checked {
    background-color: ${({ color }) => color || "#ff6565"};
    outline: ${({ color }) => `2px solid ${color ? color : "red"}`};
    outline-offset: 2px;
  }
  &:focus {
    outline: ${({ color }) => `2px solid ${color ? color : "red"}`};
    outline-offset: 2px;
  }
`;

const AddTransactionForm = ({ transactionToEdit = {} }) => {
  const { customerId } = useParams(); // Get customerId from URL
  const { editTransactionId, ...editTransactionValues } = transactionToEdit;
  const isEditSession = Boolean(editTransactionId);
  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: isEditSession ? editTransactionValues : {},
  });
  const { mutate: addTransaction, isAdding } = useAddTransaction(
    reset,
    customerId
  );
  const { mutate: editTransaction, isEditing } = useEditTransaction(
    customerId,
    editTransactionId
  );
  const { close } = useContext(ModalContext) || {};
  const dispatch = useTransactionDispatch();
  useEffect(() => {
    // Retrieve data from localStorage
    const amount = localStorage.getItem(`amount_${customerId}`);
    const transactionDetails = localStorage.getItem(
      `transactionDetails_${customerId}`
    );

    // Populate the form fields if data exists
    if (amount) setValue("amount", amount);
    if (transactionDetails) setValue("transactionDetails", transactionDetails);
  }, [setValue]);

  function onAddTransaction(data) {
    if (!customerId) {
      toast.error("No customer added");
      return;
    }

    if (isEditSession) {
      editTransaction(data, {
        onSuccess: () => {
          dispatch({ type: "CLEAR_SELECTION" });
          close();
        },
      });
    } else {
      addTransaction(data);
      localStorage.setItem(`amount_${customerId}`, "");
      localStorage.setItem(`transactionDetails_${customerId}`, "");
    }
  }

  function handleChange(e) {
    const { id, value } = e.target; // Get the element's id and value
    if (!isEditSession) {
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
  }

  return (
    <>
      {!isEditSession && (
        <>
          <TransactionHeader customerId={customerId} />
          <AllTransactions />
        </>
      )}
      <TransactionForm
        onSubmit={handleSubmit(onAddTransaction)}
        $isEditSession={isEditSession}
      >
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
            disabled={isAdding || isEditing}
            {...register("amount", {
              required: "Amount is required",
              onChange: handleChange,
            })}
          />
        </FormRow>
        <FormRow>
          <RadioInput
            type="radio"
            disabled={isAdding || isEditing}
            name="transactionType"
            value="debt"
            id={`debt-${isEditSession ? "modal" : "main"}`}
            {...register("transactionType", {
              required: "Required",
              onChange: handleChange,
            })}
          />
          <Label htmlFor={`debt-${isEditSession ? "modal" : "main"}`}>
            Debt
          </Label>
          <RadioInput
            type="radio"
            disabled={isAdding || isEditing}
            name="transactionType"
            value="payment"
            id={`payment-${isEditSession ? "modal" : "main"}`}
            color="#3db469"
            {...register("transactionType", {
              required: "Required",
              onChange: handleChange,
            })}
          />
          <Label htmlFor={`payment-${isEditSession ? "modal" : "main"}`}>
            Payment
          </Label>
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
            disabled={isAdding || isEditing}
            placeholder="Details.."
            {...register("transactionDetails", {
              onChange: handleChange,
            })}
          />
        </FormRow>

        <FormRow>
          <Button
            disabled={isAdding || isEditing}
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

AddTransactionForm.propTypes = {
  transactionToEdit: PropTypes.object,
};

export default AddTransactionForm;
