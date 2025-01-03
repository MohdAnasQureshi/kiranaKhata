import React from "react";
// import { useForm } from "react-hook-form";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import styled from "styled-components";
import { useAddStockList } from "./useAddStockList";
import { useForm } from "react-hook-form";

const Textarea = styled.textarea`
  resize: none; /* Prevent resizing */
  overflow: auto; /* Scrollbar appears when content overflows */
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 0.8rem 1.2rem;
  font-size: 1.8rem;
  border-color: var() (--color-grey-0);
  box-shadow: var(--shadow-sm);
`;

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

const AddStockList = () => {
  const { register, handleSubmit, reset, formState } = useForm();
  const { errors } = formState;

  const { mutate: addStockList, isAdding } = useAddStockList(reset);

  function onAddStockList(data) {
    console.log(data);
    addStockList(data);
  }

  return (
    <>
      <div>Add new stock list</div>
      <Form onSubmit={handleSubmit(onAddStockList)}>
        <FormRow>
          <Label htmlFor="stockList">Stock List</Label>
          <Textarea
            type="textarea"
            id="stockList"
            rows={10}
            cols={10}
            disabled={isAdding}
            placeholder="Start typing here..."
            {...register("stockList", {
              required: "No Stocks added",
            })}
          />
          {errors?.stockList?.message && (
            <Error>{errors?.stockList?.message}</Error>
          )}
        </FormRow>

        <FormRow>
          <Button disabled={isAdding}>Add List</Button>
        </FormRow>
      </Form>
    </>
  );
};

export default AddStockList;
