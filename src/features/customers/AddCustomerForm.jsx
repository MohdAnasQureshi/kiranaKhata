import React, { useContext, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import { useForm } from "react-hook-form";
import { useAddCustomer } from "./useAddCustomer";
import { useNavigate } from "react-router-dom";
import { useEditCustomer } from "./useEditCustomer";
import { ModalContext } from "../../ui/Modal";

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

const AddCustomerForm = ({ customerToEdit = {} }) => {
  const { close } = useContext(ModalContext) || {};
  const { customerId: editCustomerId, ...editCustomerValues } = customerToEdit;
  const isEditSession = Boolean(editCustomerId);
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: isEditSession ? editCustomerValues : {},
  });
  const { errors } = formState;
  const [serverErrorMessage, setServerErrorMessage] = useState("");

  const { mutate: addCustomer, isAdding } = useAddCustomer(
    setServerErrorMessage,
    reset
  );

  const { mutate: editCustomer, isEditing } = useEditCustomer(
    setServerErrorMessage,
    close
  );

  function onAddCustomer(data) {
    if (isEditSession)
      editCustomer(
        { editedCustomerData: data, customerId: editCustomerId },
        {
          onSuccess: (editedCustomer) =>
            navigate(`/addTransaction/${editCustomerId}`, {
              state: {
                customerName: editedCustomer.data.customerName,
                customerContact: editedCustomer.data.customerContact,
              },
            }),
        }
      );
    else
      addCustomer(data, {
        onSuccess: (newCustomer) =>
          navigate(`/addTransaction/${newCustomer.data._id}`, {
            state: {
              customerName: newCustomer.data.customerName,
              customerContact: newCustomer.data.customerContact,
            },
          }),
      });
  }

  return (
    <Form onSubmit={handleSubmit(onAddCustomer)}>
      <FormRow>
        <Label htmlFor="customerName">Customer name</Label>
        <Input
          type="text"
          id="customerName"
          disabled={isAdding || isEditing}
          {...register("customerName", {
            required: "Customer name is required",
            onChange: () => setServerErrorMessage(""),
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
          disabled={isAdding || isEditing}
          {...register("customerContact")}
        />
      </FormRow>

      <FormRow>
        <Button disabled={isAdding || isEditing}>
          {isEditSession ? "Edit Customer" : "Add Customer"}
        </Button>
      </FormRow>
    </Form>
  );
};

AddCustomerForm.propTypes = {
  customerToEdit: PropTypes.object,
};

export default AddCustomerForm;
