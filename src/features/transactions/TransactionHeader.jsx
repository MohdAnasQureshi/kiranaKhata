import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { HiChevronLeft, HiPhone } from "react-icons/hi";
import { HiChatBubbleOvalLeftEllipsis } from "react-icons/hi2";
import { IoLogoWhatsapp } from "react-icons/io";
import { useTransactions } from "./useTransactions";
import { capitalizeFirstLetter, formatCurrency } from "../../utils/helpers";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal } from "../../ui/Modal";
import AddCustomerForm from "../customers/AddCustomerForm";
import ConfirmDelete from "../../ui/ConfirmDelete";
import { useDeleteCustomer } from "../customers/useDeleteCustomer";
import { useMoveBack } from "../../hooks/useMoveBack";
import { MdDeleteForever, MdModeEdit } from "react-icons/md";

const CustomerDetailRow = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 5px;
  font-size: 2.3rem;
  font-weight: 500;
  gap: 1rem;
  background-color: var(--color-indigo-100);
  height: 45px;
  z-index: 12;

  & svg {
    color: var(--color-indigo-700);
    height: ${({ $customernamelength }) => {
      return $customernamelength > 10 ? "2.2rem" : "2.6rem";
    }};
    width: ${({ $customernamelength }) => {
      return $customernamelength > 10 ? "2.2rem" : "2.6rem";
    }};
  }

  & svg:active {
    color: var(--color-grey-600);
  }

  @media (min-width: 1024px) {
    left: 30vw;
  }
`;

const Customer = styled.div`
  width: 50vw;
  overflow-wrap: break-word;
  display: flex;
  gap: 1rem;
  align-items: center;
  font-size: ${({ $customernamelength }) => {
    return $customernamelength > 10 ? "1.6rem" : "2rem";
  }};
`;

const CustomerContacts = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
`;

const TotalAmount = styled.span`
  font-size: ${({ $customernamelength }) => {
    return $customernamelength > 10 ? "1.2rem" : "1.4rem";
  }};
  color: ${({ $totaldebt }) => ($totaldebt >= 0 ? "red" : "green")};
`;

const Link = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50px;
  position: relative;
  overflow: hidden; /* Prevents any unwanted stretching */
  z-index: 0;
  cursor: pointer;
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background-color: var(--color-grey-400);
    border-radius: 50px;
    opacity: 0;
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
    transform: scale(0.9); /* Slightly smaller initially */
  }

  &:active::after {
    opacity: 1;
    transform: scale(1); /* Expands to full size */
  }
  svg {
    position: relative;
    z-index: 1;
  }
`;

const TransactionHeader = ({ customerId }) => {
  const navigate = useNavigate();
  const { allTransactions, isFetching } = useTransactions(customerId);
  const location = useLocation();
  const { customerName, customerContact } = location.state || {};
  const { mutate: deleteCustomer, isDeleting } = useDeleteCustomer();
  const moveBack = useMoveBack();
  const totalDebt = allTransactions?.data.reduce((debt, current) => {
    if (current.transactionType === "debt") {
      return (debt = debt + current.amount);
    } else return (debt = debt - current.amount);
  }, 0);

  function onDeleteCustomer() {
    deleteCustomer(customerId, {
      onSuccess: () => navigate("/"),
    });
  }

  return (
    <CustomerDetailRow $customernamelength={customerName.length}>
      <HiChevronLeft onClick={moveBack} style={{ cursor: "pointer" }} />
      <Customer $customernamelength={customerName.length}>
        {capitalizeFirstLetter(customerName)}
        <TotalAmount
          $totaldebt={totalDebt}
          $customernamelength={customerName.length}
        >
          {isFetching
            ? ""
            : totalDebt >= 0
              ? `debt: ${formatCurrency(totalDebt)}`
              : `deposit: ${formatCurrency(Math.abs(totalDebt))}`}
        </TotalAmount>
      </Customer>
      <CustomerContacts>
        <Link
          href={`https://wa.me/${customerContact}?text=${encodeURIComponent(`Dear customer payment of Rs ${totalDebt} is pending to be paid at shopOwner. Please pay the due amount as early as possible. Click this link to download the detailed bill. `)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IoLogoWhatsapp />
        </Link>

        <Link
          href={`sms:${customerContact}?body=${encodeURIComponent(`Dear customer payment of Rs ${totalDebt} is pending to be paid at shopOwner. Please pay the due amount as early as possible.`)}`}
        >
          <HiChatBubbleOvalLeftEllipsis />
        </Link>

        <Link href={`tel:${customerContact}`}>
          <HiPhone />
        </Link>
        <Modal>
          <Modal.Open opens="options-modal">
            <Link as="div">
              <BsThreeDotsVertical />
            </Link>
          </Modal.Open>
          <Modal.Window name="options-modal">
            <Modal.Open opens="editModal">
              <div>
                Edit <MdModeEdit />
              </div>
            </Modal.Open>
            <Modal.Open opens="deleteModal">
              <div>
                Delete <MdDeleteForever />
              </div>
            </Modal.Open>
            <div>Settings</div>
          </Modal.Window>

          <Modal.Window
            name="editModal"
            style={{
              width: "84vw",
              height: "55vh",
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
            <AddCustomerForm
              customerToEdit={{ customerId, customerContact, customerName }}
            />
          </Modal.Window>

          <Modal.Window
            name="deleteModal"
            style={{
              width: "84vw",
              height: "50vh",
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
              disabled={isDeleting}
              resourceName={customerName}
              onConfirm={onDeleteCustomer}
            />
          </Modal.Window>
        </Modal>
      </CustomerContacts>
    </CustomerDetailRow>
  );
};

TransactionHeader.propTypes = {
  customerId: PropTypes.string.isRequired,
};

export default TransactionHeader;
