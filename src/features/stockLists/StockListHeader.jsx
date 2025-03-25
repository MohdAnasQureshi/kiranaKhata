import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import EditStockList from "./EditStockList";
import styled, { css } from "styled-components";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Input from "../../ui/Input";
import { IoClose } from "react-icons/io5";
import { HiChevronLeft } from "react-icons/hi";
import { Modal } from "../../ui/Modal";
import { MdDeleteForever, MdModeEdit } from "react-icons/md";
import { IoMdCopy } from "react-icons/io";
import { FiSearch } from "react-icons/fi";

const StyledStockListsHeader = styled.div`
  font-size: 2rem;
  font-weight: 500;
  padding: 0.4rem;
  padding-left: 1rem;
  background-color: var(--color-indigo-100);
  display: flex;
  flex-direction: row;
  align-items: center;

  ${({ $showoptions }) =>
    $showoptions &&
    css`
      justify-content: space-between;
      font-size: 1.8rem;
      font-weight: 400;
      padding: 0.5rem;
    `}
`;

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

const SearchInput = styled(Input)`
  border-radius: 50px;
  border: 1px solid;
  width: 100%;
  font-size: 1.5rem;
  padding: 0.5rem;
  padding-left: 2rem;
`;

const SearchWrapper = styled.div`
  position: relative;
  padding: 0 15px 0 15px;
  width: 100%;
  transition: 0.5s ease;
`;

const SearchIcon = styled(FiSearch)`
  color: #464646;
  font-size: 22px;
  fill: #ffffff;
  cursor: pointer;
`;

const CloseButton = styled(IoClose)`
  position: absolute;
  right: 28px;
  top: 50%;
  transform: translateY(-50%);
  color: gray;
  font-size: 24px;
  transition: 0.4s ease;
  cursor: pointer;
  &:active {
    color: red;
  }
`;

const StockListHeader = ({
  selectedLists,
  setSelectedLists,
  stockOrderLists,
  searchTerm,
  setSearchTerm,
  handleCopy,
  scrollBarRef,
  deleteStockLists,
  isDeleting,
}) => {
  const searchInputRef = useRef(null);
  const [selectedLength, setSelectedLength] = useState(0);
  const [searchActive, setSearchActive] = useState(false);

  useEffect(() => {
    const blockBack = () => {
      window.history.pushState(null, "", window.location.href);
    };

    const handleBackButton = (event) => {
      event.preventDefault();
      setSelectedLists([]);
    };

    blockBack();
    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [setSelectedLists]);
  function handleSelectAll(e) {
    if (e.target.checked) {
      const allStockListsIdsArray = stockOrderLists?.data?.map(
        (list) => list._id
      );
      setSelectedLists(allStockListsIdsArray);
      setSelectedLength(allStockListsIdsArray.length);
    }
    if (!e.target.checked) {
      setSelectedLists([]);
      setSelectedLength(0);
    }
  }

  function handleSearchClose() {
    setSearchActive(false);
    setSearchTerm("");
    setTimeout(() => {
      scrollBarRef.current?.scrollToBottom();
    }, 0);
  }

  return (
    <StyledStockListsHeader
      $showoptions={selectedLists?.length > 0 ? true : undefined}
    >
      {selectedLists?.length > 0 ? (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <HiChevronLeft
              style={{ cursor: "pointer", fontSize: "2.4rem" }}
              onClick={() => setSelectedLists([])}
            />
            <div style={{ width: "30px", textAlign: "center" }}>
              {selectedLists?.length}
            </div>
            <input
              type="checkbox"
              id="select-all"
              onChange={(e) => handleSelectAll(e)}
              checked={selectedLength === selectedLists.length}
              style={{ width: "14px", height: "14px" }}
            />
            <label htmlFor="select-all">Select all</label>
          </div>
          <ListOptions>
            {selectedLists.length === 1 ? (
              <Modal>
                <Modal.Open opens="edit-list">
                  <button>
                    <MdModeEdit />
                  </button>
                </Modal.Open>

                <Modal.Window
                  name="edit-list"
                  style={{
                    width: "84vw",
                    height: "60vh",
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
                  <EditStockList
                    stockOrderLists={stockOrderLists}
                    selectedLists={selectedLists}
                    setSelectedLists={setSelectedLists}
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
                  onConfirm={() => deleteStockLists(selectedLists)}
                  disabled={isDeleting}
                  content="Are you sure you want to delete it permanently ?"
                  size="medium"
                />
              </Modal.Window>
            </Modal>

            <button onClick={handleCopy}>
              <IoMdCopy />
            </button>
          </ListOptions>
        </>
      ) : searchActive ? (
        <SearchWrapper>
          <SearchInput
            ref={searchInputRef}
            id="search"
            type="text"
            placeholder="Search stock lists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <CloseButton onClick={handleSearchClose} />
        </SearchWrapper>
      ) : (
        <div>
          All Stocks Lists [{stockOrderLists?.data.length}]
          <span
            style={{ position: "absolute", right: "1.5rem", top: "0.7rem" }}
            onClick={() => {
              setSearchActive(true);
              setTimeout(() => {
                searchInputRef.current?.focus(); // Auto-focus after state update
              }, 0);
            }}
          >
            <SearchIcon />
          </span>
        </div>
      )}
    </StyledStockListsHeader>
  );
};

StockListHeader.propTypes = {
  selectedLists: PropTypes.array,
  setSelectedLists: PropTypes.func,
  stockOrderLists: PropTypes.object,
  searchTerm: PropTypes.string,
  setSearchTerm: PropTypes.func,
  handleCopy: PropTypes.func,
  scrollBarRef: PropTypes.object,
  deleteStockLists: PropTypes.func,
  isDeleting: PropTypes.bool,
};

export default StockListHeader;
