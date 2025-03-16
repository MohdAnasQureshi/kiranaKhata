import React, { useEffect, useRef, useState } from "react";
import ScrollBar from "../../ui/ScrollBar";
import styled, { css } from "styled-components";
import Spinner from "../../ui/Spinner";
import { formatAndGetDate, formatDate } from "../../utils/helpers";
import { useStockOrderLists } from "./useStockOrderLists";
import { useDeleteStockLists } from "./useDeleteStockLists";
import { MdDeleteForever, MdModeEdit } from "react-icons/md";
import { HiChevronLeft } from "react-icons/hi";
import { IoMdCopy } from "react-icons/io";
import toast from "react-hot-toast";
import { Modal } from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import EditStockList from "./EditStockList";
import { FiSearch } from "react-icons/fi";
import Input from "../../ui/Input";
import { IoClose } from "react-icons/io5";
import { GoChevronDown } from "react-icons/go";

const StockListsHeader = styled.div`
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
  padding: 1rem 10rem 1rem 1rem;
  position: relative;
  white-space: pre-wrap;

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

const StockLists = () => {
  const [currentDate, setCurrentDate] = useState("");
  const { isLoading, stockOrderLists } = useStockOrderLists();
  const scrollBarRef = useRef(null);

  const today = new Date();
  const yesterday = new Date(Date.now() - 86400000);

  const [hoverItemId, setHoverItemId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef(null);
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
    }, 400); // Long press time: 200ms
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
  const [selectedLength, setSelectedLength] = useState(0);

  function deleteStockLists(selectedListsIdsArray) {
    selectedListsIdsArray.forEach((stockListId) =>
      deleteStockList(stockListId)
    );
    setSelectedLists([]);
  }

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
  // console.log(isTouch);

  useEffect(() => {
    const blockBack = () => {
      window.history.pushState(null, "", window.location.href);
    };

    const handleBackButton = (event) => {
      event.preventDefault();
      setSelectedLists([]); // Set some state when back is pressed
      console.log("Back button clicked!");
    };

    blockBack();
    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [setSelectedLists]);

  const [searchActive, setSearchActive] = useState(false);
  const [showOptions, setShowOptions] = useState("");
  function handleSearchClose() {
    setSearchActive(false);
    setSearchTerm("");
    setTimeout(() => {
      scrollBarRef.current?.scrollToBottom();
    }, 0);
  }

  if (isLoading) return <Spinner />;
  return (
    <>
      <StockListsHeader
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
      </StockListsHeader>
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
              {currentDate && (
                <DateLabel>
                  {currentDate === formatAndGetDate(today)
                    ? `Today, ${currentDate}`
                    : currentDate === formatAndGetDate(yesterday)
                      ? `Yesterday, ${currentDate}`
                      : currentDate}
                </DateLabel>
              )}
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
                </span>{" "}
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
                            <MdDeleteForever style={{ cursor: "pointer" }} />
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

                        <IoMdCopy
                          style={{ cursor: "pointer" }}
                          onClick={() => handleCopy(list._id)}
                        />

                        <Modal>
                          <Modal.Open opens="edit-list">
                            <MdModeEdit style={{ cursor: "pointer" }} />
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

export default StockLists;
