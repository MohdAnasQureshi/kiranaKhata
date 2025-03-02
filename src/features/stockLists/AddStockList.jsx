import React, { useEffect, useRef, useState } from "react";
import Button from "../../ui/Button";
import styled from "styled-components";
import { useAddStockList } from "./useAddStockList";
import { useForm } from "react-hook-form";

const StockListForm = styled.form`
  position: fixed;
  bottom: 65px;
  background: none;
  width: auto;
  left: 10px;
  right: 10px;
  border: none;
  margin: 1rem 0 1rem 0;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: flex-end;
  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }

  &:last-child {
    flex-shrink: 0;
  }

  &:has(button) {
    gap: 1rem;
  }

  @media (min-width: 1024px) {
    left: 31vw;
    bottom: 20px;
    max-width: 120rem;
    margin: auto;
  }
`;

const Textarea = styled.textarea`
  resize: none; /* Prevent resizing */
  overflow: auto; /* Scrollbar appears when content overflows */
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 2rem;
  padding: 1rem;
  border-color: var() (--color-grey-0);
  box-shadow: var(--shadow-sm);
  flex-grow: 1; /* Occupies the remaining space */
  width: 70vw;
  height: 5rem;
  min-height: 5rem;
  max-height: 18rem;
`;

const AddStockList = () => {
  const { register, handleSubmit, reset } = useForm();
  // const { errors } = formState;

  const { mutate: addStockList, isAdding } = useAddStockList();

  const [value, setValue] = useState(""); // State to track textarea value
  const textareaRef = useRef(null); // Ref for the textarea DOM element

  useEffect(() => {
    const savedText = localStorage.getItem("stockListContent");
    if (savedText) {
      setValue(savedText);
    }
  }, []);

  const handleChange = (e) => {
    setValue(e.target.value); // Update the value
    adjustHeight(e.target); // Adjust height dynamically
    localStorage.setItem("stockListContent", e.target.value);
  };

  const adjustHeight = (textarea) => {
    textarea.style.height = "5rem"; // Reset height first
    textarea.style.height = `${textarea.scrollHeight}px`; // Then adjust based on content
  };

  const [renderKey, setRenderKey] = useState(0); // Rename key to avoid conflict

  const onAddStockList = (data) => {
    addStockList(data, {
      onSuccess: () => {
        setValue("");
        localStorage.setItem("stockListContent", "");
        reset();
        setRenderKey((prevKey) => prevKey + 1); // Increment key to force re-render
      },
    });
  };

  return (
    <>
      <StockListForm key={renderKey} onSubmit={handleSubmit(onAddStockList)}>
        <Textarea
          ref={textareaRef}
          value={value}
          type="textarea"
          id="stockList"
          disabled={isAdding}
          placeholder="Start typing here..."
          {...register("stockList", {
            required: "No Stocks added",
            onChange: handleChange,
          })}
        />
        <Button
          style={{
            borderRadius: "50px",
            height: "5rem",
            fontSize: "2rem",
          }}
          disabled={isAdding}
        >
          +
        </Button>
      </StockListForm>
    </>
  );
};

export default AddStockList;
