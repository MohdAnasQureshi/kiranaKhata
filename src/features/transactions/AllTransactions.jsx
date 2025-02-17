import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTransactions } from "./useTransactions";
import { capitalizeFirstLetter, formatDate } from "../../utils/helpers";
import ScrollBar from "../../ui/ScrollBar";
import styled from "styled-components";
import Spinner from "../../ui/Spinner";

const TransactionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TransactionDetail = styled.div`
  background-color: ${({ type }) =>
    type === "debt" ? "#ffececc1" : " #e7fff0c9"};
  padding: 1rem 1rem 0.7rem 1rem;
  box-shadow: 0 2px 4px
    ${({ type }) => (type === "debt" ? "#d861611d" : " #4fc37b1e")};
  border-radius: var(--border-radius-lg);
  width: max-content;
  max-width: 70vw;
  margin-left: ${({ type }) => (type === "debt" ? "auto" : 0)};
`;
const Amount = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 2.4rem;
  font-weight: 650;
  color: ${({ type }) => (type === "debt" ? "#ff4c4cdd" : "#3db469d7")};
`;
const Date = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  padding-top: 0.2rem;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
`;
const Type = styled.span`
  font-size: 1rem;
`;
const Details = styled.div`
  font-size: 1.5rem;
  word-wrap: break-word;
`;

const AllTransactions = () => {
  const { customerId } = useParams();
  const { isLoading, error, allTransactions, refetch, isFetching } =
    useTransactions(customerId);

  useEffect(() => {
    refetch();
  }, [refetch, customerId]);

  if (isLoading || isFetching) return <Spinner />;
  if (error) return <div>Error: {error.message}</div>;
  if (allTransactions?.data?.length === 0) {
    return <div>No transactions found for this customer.</div>;
  }
  return (
    <ScrollBar backgroundColor="transparent" showButtons={false} height="58dvh">
      <TransactionContainer>
        {allTransactions?.data.map((transaction) => (
          <TransactionDetail
            key={transaction._id}
            type={transaction.transactionType}
          >
            <Amount type={transaction.transactionType}>
              {transaction.amount}
              <Type>
                ({capitalizeFirstLetter(transaction.transactionType)})
              </Type>
            </Amount>
            <Details>{transaction.transactionDetails}</Details>
            <Date>{formatDate(transaction.transactionDate)}</Date>
          </TransactionDetail>
        ))}
      </TransactionContainer>
    </ScrollBar>
  );
};

export default AllTransactions;
