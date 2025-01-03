import React, { useState } from "react";
import styled from "styled-components";
import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import { useForm } from "react-hook-form";
import { useAddCustomer } from "./useAddCustomer";
// import FileInput from "../../ui/FileInput";
// import Textarea from "../../ui/Textarea";

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.2rem 0;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }

  &:has(button) {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

const Label = styled.label`
  font-weight: 500;
  font-size: 2rem;
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
`;

const AddCustomerForm = () => {
  const { register, handleSubmit, reset, formState } = useForm();
  const { errors } = formState;
  const [serverErrorMessage, setServerErrorMessage] = useState("");

  const { mutate: addCustomer, isAdding } = useAddCustomer(
    setServerErrorMessage,
    reset
  );

  function onAddCustomer(data) {
    console.log(data);
    addCustomer(data);
  }

  function onError(errors) {
    console.log(errors);
  }

  return (
    <Form onSubmit={handleSubmit(onAddCustomer, onError)}>
      <FormRow>
        <Label htmlFor="customerName">Customer name</Label>
        <Input
          type="text"
          id="customerName"
          disabled={isAdding}
          {...register("customerName", {
            required: "Customer name is required",
          })}
        />
        {(errors?.customerName?.message || serverErrorMessage) && (
          <Error>{errors?.customerName?.message || serverErrorMessage}</Error>
        )}
      </FormRow>

      <FormRow>
        <Label htmlFor="customerContact">Customer contact</Label>
        <Input
          type="number"
          id="customerContact"
          disabled={isAdding}
          {...register("customerContact")}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        {/* <Button variation="secondary" type="reset">
          Cancel
        </Button> */}
        <Button disabled={isAdding}>Add Customer</Button>
      </FormRow>
    </Form>
  );
};

export default AddCustomerForm;
