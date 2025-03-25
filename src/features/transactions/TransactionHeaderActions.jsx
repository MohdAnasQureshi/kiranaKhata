import React, { useState } from "react";
import { HiChevronLeft } from "react-icons/hi2";
import { Modal } from "../../ui/Modal";
import { MdDeleteForever, MdModeEdit } from "react-icons/md";
import styled from "styled-components";
import PropTypes from "prop-types";
import {
  useSelectedTransactions,
  useTransactionDispatch,
} from "../../contexts/TransactionContext";
import AddTransactionForm from "./AddTransactionForm";
import ConfirmDelete from "../../ui/ConfirmDelete";
import { useDeleteTransaction } from "./useDeleteTransactions";
import { useParams } from "react-router-dom";

const ListOptions = styled.div`
  display: flex;
  align-items: "center";
  gap: 1.5rem;
  margin-right: 1rem;

  & > button {
    background-color: transparent;
    border: none;
    font-size: 2.4rem;
    padding: 2px;
    border-radius: 50%;
    &:active {
      background: #bbcbff;
      color: var(--color-brand-500);
    }
  }
  & :focus {
    outline: none;
    outline-offset: none;
  }
`;

const TransactionHeaderActions = ({ allTransactions }) => {
  const { customerId } = useParams();
  const selectedTransactions = useSelectedTransactions();
  const dispatch = useTransactionDispatch();
  const [selectedLength, setSelectedLength] = useState(0);
  const editTransactionId = selectedTransactions[0];
  const { amount, transactionDetails, transactionType } =
    allTransactions.data.filter(
      (transaction) => transaction._id === editTransactionId
    )[0] || {};

  const { mutate, isDeleting } = useDeleteTransaction(customerId);

  function handleSelectAll(e) {
    if (e.target.checked) {
      const allTransactionsIdsArray = allTransactions?.data?.map(
        (transaction) => transaction._id
      );
      dispatch({
        type: "SELECT_ALL_TRANSACTIONS",
        payload: allTransactionsIdsArray,
      });
      setSelectedLength(allTransactionsIdsArray.length);
    }
    if (!e.target.checked) {
      dispatch({ type: "CLEAR_SELECTION" });
      setSelectedLength(0);
    }
  }

  function deleteTransactions(selectedTransactonsArray) {
    if (selectedTransactonsArray.length > 1) {
      for (let i = 0; i < selectedTransactonsArray.length - 1; i++) {
        mutate(selectedTransactonsArray[i]);
      }
    }
    mutate(selectedTransactonsArray[selectedTransactonsArray.length - 1], {
      onSuccess: () => dispatch({ type: "CLEAR_SELECTION" }),
    });
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.8rem",
          fontWeight: 500,
          flexGrow: 1,
          fontSize: "2rem",
        }}
      >
        <HiChevronLeft
          style={{ cursor: "pointer", fontSize: "2rem" }}
          onClick={() => dispatch({ type: "CLEAR_SELECTION" })}
        />
        <div style={{ width: "35px", textAlign: "center" }}>
          {selectedTransactions?.length}
        </div>
        <input
          type="checkbox"
          id="select-all"
          onChange={(e) => handleSelectAll(e)}
          checked={selectedLength === selectedTransactions.length}
          style={{ width: "14px", height: "14px" }}
        />
        <label htmlFor="select-all">Select all</label>
      </div>
      <ListOptions>
        {selectedTransactions.length === 1 ? (
          <Modal>
            <Modal.Open opens="edit-list">
              <button>
                <MdModeEdit />
              </button>
            </Modal.Open>

            <Modal.Window
              name="edit-list"
              style={{
                width: "100vw",
                height: "40vh",
                top: "45%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                justifyContent: "center",
                padding: "0",
                textAlign: "center",
                fontSize: "2rem",
              }}
              overlayStyle={{
                backgroundColor: "var(--backdrop-color)",
              }}
              showCloseBtn={true}
            >
              Edit Transaction
              <AddTransactionForm
                transactionToEdit={{
                  editTransactionId,
                  amount,
                  transactionType,
                  transactionDetails,
                }}
              />
            </Modal.Window>
          </Modal>
        ) : (
          ""
        )}
        <Modal>
          <Modal.Open opens="delete-modal">
            <button>
              <MdDeleteForever />
            </button>
          </Modal.Open>
          <Modal.Window
            name="delete-modal"
            style={{
              width: "84vw",
              height: "35vh",
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              justifyContent: "center",
              padding: "2rem",
            }}
            overlayStyle={{
              backgroundColor: "var(--backdrop-color)",
            }}
            showCloseBtn={true}
          >
            <ConfirmDelete
              onConfirm={() => deleteTransactions(selectedTransactions)}
              disabled={isDeleting}
              content="Are you sure you want to delete it permanently ?"
              size="medium"
            />
          </Modal.Window>
        </Modal>
      </ListOptions>
    </>
  );
};

TransactionHeaderActions.propTypes = {
  allTransactions: PropTypes.object,
};

export default TransactionHeaderActions;
