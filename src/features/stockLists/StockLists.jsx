import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import toast from "react-hot-toast";
import ScrollBar from "../../ui/ScrollBar";
import Spinner from "../../ui/Spinner";
import ConfirmDelete from "../../ui/ConfirmDelete";
import EditStockList from "./EditStockList";
import StockListHeader from "./StockListHeader";
import { formatAndGetDate, formatDate } from "../../utils/helpers";
import { useStockOrderLists } from "./useStockOrderLists";
import { useDeleteStockLists } from "./useDeleteStockLists";
import { MdDeleteForever, MdModeEdit } from "react-icons/md";
import { IoMdCopy } from "react-icons/io";
import { Modal } from "../../ui/Modal";
import { GoChevronDown } from "react-icons/go";

const StockDetails = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 1.6rem;
  width: max-content;
  background-color: var(--color-brand-100);
  border: 1px solid var(--color-grey-400);
  color: #000;
  border-radius: 10px;
  border-top-left-radius: 0;
  padding: 1rem 2.5rem 0.8rem 1rem;
  position: relative;
  white-space: pre-wrap;
  max-width: 80vw;
  /* Add translucent blue overlay when selected */
  ${({ selected }) =>
    selected &&
    css`
      &::before {
        content: "";
        position: absolute;
        top: -4px;
        left: -5px;
        width: 90vw;
        height: calc(100% + 8px);
        margin: 2px solid red;
        background-color: rgba(120, 149, 255, 0.283);
        z-index: 0;
      }
    `}

  @media (max-width: 376px) {
    /* iPhone SE (375px wide) */
    font-size: 14px;
  }

  @media (max-width: 320px) {
    /* Older, smaller devices */
    font-size: 12px;
  }
`;

const DateLabel = styled.div`
  font-size: 1.5rem;
  border-radius: var(--border-radius-lg);
  color: var(--color-grey-700);
  position: fixed;
  background-color: var(--color-brand-50);
  padding: 0.5rem;
  left: 50%;
  top: 115px;
  z-index: 10;
  transform: translate(-50%, -50%);

  @media (min-width: 1024px) {
    left: 65%;
  }
  @media (max-width: 376px) {
    /* iPhone SE (375px wide) */
    font-size: 12px;
  }
`;

const DateLabel2 = styled.div`
  font-size: 1.5rem;
  border-radius: var(--border-radius-lg);
  color: var(--color-grey-700);

  background-color: var(--color-brand-50);
  padding: 0.5rem;
  margin: auto;
  @media (max-width: 376px) {
    /* iPhone SE (375px wide) */
    font-size: 12px;
  }
`;

const StockLists = () => {
  const [currentDate, setCurrentDate] = useState("");
  const { isLoading, stockOrderLists } = useStockOrderLists();
  const scrollBarRef = useRef(null);
  const today = new Date();
  const yesterday = new Date(Date.now() - 86400000);
  const [hoverItemId, setHoverItemId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const searchedStocksLists = stockOrderLists?.data.filter((list) =>
    list?.stockList?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    // Automatically scroll to bottom when stockOrderLists updates
    if (stockOrderLists) {
      scrollBarRef.current?.scrollToBottom();
    }
  }, [stockOrderLists]);

  useEffect(() => {
    const container = scrollBarRef.current?.getContentRef();
    if (!container) return;

    const items = container.querySelectorAll(".content-item");
    if (!items) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentDate(entry.target.dataset.list);
          }
        });
      },
      {
        root: container,
        rootMargin: "0px 0px -90% 0px", // Adjust to observe elements as if from the top
        threshold: 0.001,
      }
    );

    items.forEach((item) => observer.observe(item));

    return () => {
      observer.disconnect();
    };
  }, [stockOrderLists, searchedStocksLists]);

  const [selectedLists, setSelectedLists] = useState([]);

  const holdTimer = useRef(null);
  const touchStartY = useRef(0);
  const isScrolling = useRef(false);
  const longPressTriggered = useRef(false);

  // Handle touch start (Start timer for long press)
  const handleTouchStart = (e, listId) => {
    touchStartY.current = e.touches[0].clientY;
    isScrolling.current = false;
    longPressTriggered.current = false;
    holdTimer.current = setTimeout(() => {
      if (!isScrolling.current) {
        if (selectedLists.length === 0) {
          setSelectedLists((selectedLists) =>
            selectedLists.includes(listId)
              ? selectedLists.filter(
                  (selectedListId) => selectedListId !== listId
                )
              : [...selectedLists, listId]
          );
          longPressTriggered.current = true;
        }
      }
    }, 400);
  };

  // Detect scrolling (Cancel long press if user moves too much)
  const handleTouchMove = (e) => {
    const touchCurrentY = e.touches[0].clientY;
    if (Math.abs(touchCurrentY - touchStartY.current) > 10) {
      isScrolling.current = true;
      clearTimeout(holdTimer.current); // Cancel long press
    }
  };

  // Cancel long press if the user lifts their finger before 200ms
  const handleTouchEnd = () => {
    clearTimeout(holdTimer.current);
    if (longPressTriggered.current) return;
  };

  function handleClick(listId) {
    setSelectedLists((selectedLists) =>
      selectedLists.includes(listId)
        ? selectedLists.filter((selectedListId) => selectedListId !== listId)
        : [...selectedLists, listId]
    );
  }

  const { mutate: deleteStockList, isDeleting } = useDeleteStockLists();

  function deleteStockLists(selectedListsIdsArray) {
    selectedListsIdsArray.forEach((stockListId) =>
      deleteStockList(stockListId)
    );
    setSelectedLists([]);
  }

  function handleCopy(listId) {
    if (!navigator.clipboard) {
      console.error("Clipboard API not supported");
      toast.error("Clipboard copy not supported in this browser.");
      return;
    }

    let textToCopy;
    if (listId)
      textToCopy = stockOrderLists?.data
        ?.filter((list) => list._id === listId)
        .map((list) => list.stockList)
        .join("\n");
    else
      textToCopy = stockOrderLists?.data
        ?.filter((list) => selectedLists.includes(list._id))
        .map((list) => list.stockList)
        .join("\n");

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => toast.success("Text Copied"))
      .catch((err) => console.error("Failed to copy: ", err));
  }

  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(
      "maxTouchPoints" in navigator
        ? navigator.maxTouchPoints > 0
        : window.matchMedia("(pointer: coarse)").matches
    );
  }, []);

  const [showOptions, setShowOptions] = useState("");

  if (isLoading) return <Spinner />;
  return (
    <>
      <StockListHeader
        selectedLists={selectedLists}
        setSelectedLists={setSelectedLists}
        stockOrderLists={stockOrderLists}
        handleCopy={handleCopy}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        scrollBarRef={scrollBarRef}
        deleteStockLists={deleteStockLists}
        isDeleting={isDeleting}
      />

      {currentDate && (
        <DateLabel>
          {currentDate === formatAndGetDate(today)
            ? `Today, ${currentDate}`
            : currentDate === formatAndGetDate(yesterday)
              ? `Yesterday, ${currentDate}`
              : currentDate}
        </DateLabel>
      )}

      <ScrollBar
        backgroundColor="transparent"
        showButtons={false}
        height="calc(100dvh - 240px)"
        ref={scrollBarRef}
      >
        {searchedStocksLists.length === 0 ? "No Stock List found!!" : ""}
        {searchedStocksLists?.map((list, index, arr) => {
          const currentFormattedDate = formatAndGetDate(list.createdAt);
          const previousFormattedDate =
            index > 0 ? formatAndGetDate(arr[index - 1].createdAt) : null;

          const isNewDate =
            index === 0 || currentFormattedDate !== previousFormattedDate;

          return (
            <React.Fragment key={list._id}>
              {isNewDate && (
                <DateLabel2>
                  {currentFormattedDate === formatAndGetDate(today)
                    ? `Today`
                    : currentFormattedDate === formatAndGetDate(yesterday)
                      ? "Yesterday"
                      : currentFormattedDate}
                </DateLabel2>
              )}
              <StockDetails
                className="content-item"
                data-list={formatAndGetDate(list.createdAt)}
                onTouchStart={(e) => handleTouchStart(e, list._id)}
                onTouchEnd={handleTouchEnd}
                onTouchMove={(e) => handleTouchMove(e)}
                selected={selectedLists.includes(list._id) ? true : false}
                onMouseOver={() => setHoverItemId(list._id)}
                onMouseLeave={() => {
                  setHoverItemId(null);
                  setShowOptions("");
                }}
                onClick={
                  selectedLists.length > 0 ? () => handleClick(list._id) : null
                }
              >
                {list.stockList}
                <span
                  style={{
                    fontSize: "1rem",
                    fontWeight: "500",
                    paddingTop: "0.5rem",
                  }}
                >
                  {formatDate(list.createdAt)}
                </span>
                {!isTouch && hoverItemId === list._id && (
                  <>
                    <div
                      style={{
                        position: "absolute",
                        right: "1rem",
                        top: "0.5rem",
                      }}
                    >
                      <GoChevronDown
                        onClick={() =>
                          setShowOptions((showOptions) =>
                            showOptions === list._id ? "" : list._id
                          )
                        }
                        size={5}
                        style={{
                          backgroundColor: "white",
                          width: "32px",
                          fontSize: "1rem",
                          borderRadius: "50px",
                          height: "20px",
                          color: "var(--color-grey-600)",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                    {showOptions === list._id && (
                      <div
                        style={{
                          position: "absolute",
                          top: "30px",
                          right: "-18px",
                          fontSize: "1.5rem",
                          backgroundColor: "white",
                          borderRadius: "50px",
                          padding: "0.7rem",
                          border: "1px solid gray",
                          boxShadow: "0 3px 3px gray",
                          zIndex: "10",
                          display: "flex",
                          alignItems: "center",
                          gap: "1.5rem",
                          justifyContent: "space-between",
                        }}
                      >
                        <Modal>
                          <Modal.Open opens="delete-modal">
                            <DeleteListButton />
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
                              onConfirm={() => deleteStockLists([list._id])}
                              disabled={isDeleting}
                              content="Are you sure you want to delete it permanently ?"
                              size="medium"
                            />
                          </Modal.Window>
                        </Modal>

                        <CopyListButton onClick={() => handleCopy(list._id)} />

                        <Modal>
                          <Modal.Open opens="edit-list">
                            <EditListButton />
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
                              selectedLists={[list._id]}
                              setSelectedLists={setSelectedLists}
                            />
                          </Modal.Window>
                        </Modal>
                      </div>
                    )}
                  </>
                )}
              </StockDetails>
            </React.Fragment>
          );
        })}
      </ScrollBar>
    </>
  );
};

const DeleteListButton = styled(MdDeleteForever)`
  cursor: pointer;
  &:hover {
    color: var(--color-brand-700);
  }
`;
const EditListButton = styled(MdModeEdit)`
  cursor: pointer;
  &:hover {
    color: var(--color-brand-700);
  }
`;
const CopyListButton = styled(IoMdCopy)`
  cursor: pointer;
  &:hover {
    color: var(--color-brand-700);
  }
`;

export default StockLists;
