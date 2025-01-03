import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const ScrollContainer = styled.div`
  position: relative;
  height: 100%;
  overflow: auto; /* Prevent default scrollbars */
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: auto;
  height: ${(height) => height || "auto"};
  padding-right: ${({ showbuttons }) => (showbuttons ? "1rem" : "0")};
`;

const Scroll = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 16px;
  z-index: 10; /* Ensures it overlays the content */
  display: grid;
  grid-template: ${({ showbuttons }) =>
    showbuttons ? "auto 1fr auto / 1fr" : "1fr / 1fr"};
  gap: 0.5rem;
  align-items: center;
`;

const TracknThumb = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;

const Track = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background-color: ${(props) => props.$backgroundcolor};
  border-radius: 8px;
  cursor: pointer;
`;

const Thumb = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 50px; /* Fixed height for the thumb */
  background-color: var(--color-brand-500);
  border-radius: 8px;
  cursor: grab;
  transition: background-color 0.2s;

  &:active {
    cursor: grabbing;
    background-color: var(--color-brand-700);
  }
  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
  }

  &::before {
    top: 8px;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid white;
  }

  &::after {
    bottom: 8px;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid white;
  }
`;

const ScrollBar = ({ children, backgroundColor, showButtons, height }) => {
  const contentRef = useRef(null);
  const scrollTrackRef = useRef(null);
  const scrollThumbRef = useRef(null);
  const observer = useRef(null);

  const [thumbHeight, setThumbHeight] = useState(20);
  const [isDragging, setIsDragging] = useState(false);
  const [scrollStartPosition, setScrollStartPosition] = useState(0);
  const [initialContentScrollTop, setInitialContentScrollTop] = useState(0);

  const [thumbVisible, setThumbVisible] = useState(false);
  const visibilityTimer = useRef(null);
  const showThumb = () => {
    setThumbVisible(true);
    clearTimeout(visibilityTimer.current);
    visibilityTimer.current = setTimeout(() => {
      setThumbVisible(false);
    }, 2000); // Hide thumb after 2 seconds of inactivity
  };

  function handleResize() {
    setThumbHeight(40);
  }

  function handleThumbPosition() {
    if (
      !contentRef.current ||
      !scrollTrackRef.current ||
      !scrollThumbRef.current
    ) {
      return;
    }

    const { scrollTop: contentTop, scrollHeight: contentHeight } =
      contentRef.current;
    const { clientHeight: trackHeight } = scrollTrackRef.current;

    let newTop =
      (contentTop / (contentHeight - contentRef.current.clientHeight)) *
      (trackHeight - thumbHeight);

    newTop = Math.min(newTop, trackHeight - thumbHeight);

    const thumb = scrollThumbRef.current;
    requestAnimationFrame(() => {
      thumb.style.top = `${newTop}px`;
    });
  }

  function handleTrackClick(e) {
    e.preventDefault();
    e.stopPropagation();
    const { current: track } = scrollTrackRef;
    const { current: content } = contentRef;
    if (track && content) {
      const clientY = e.clientY || e.touches[0].clientY; // Use touch position if available
      const rect = track.getBoundingClientRect();
      const trackTop = rect.top;
      const thumbOffset = -(thumbHeight / 2);
      const clickRatio =
        (clientY - trackTop + thumbOffset) / track.clientHeight;
      const scrollAmount = Math.floor(clickRatio * content.scrollHeight);
      content.scrollTo({
        top: scrollAmount,
        behavior: "smooth",
      });
    }
  }

  useEffect(() => {
    const content = contentRef.current;
    const track = scrollTrackRef.current;

    if (content) {
      observer.current = new ResizeObserver(() => {
        handleResize();
        handleThumbPosition();
      });
      observer.current.observe(content);
      content.addEventListener("scroll", handleThumbPosition, {
        passive: true,
      });
      content.addEventListener("scroll", showThumb);
      return () => {
        observer.current?.unobserve(content);
        content.removeEventListener("scroll", handleThumbPosition);
        content.removeEventListener("scroll", showThumb);
      };
    }

    if (track) {
      observer.current = new ResizeObserver(() => {
        handleResize();
      });
      observer.current.observe(content);
      track.addEventListener("touchstart", handleTrackClick, { passive: true });
      track.addEventListener("touchstart", showThumb);
      return () => {
        observer.current?.unobserve(content);
        track.removeEventListener("touchstart", handleTrackClick);
        track.removeEventListener("touchstart", showThumb);
      };
    }
  }, [handleResize, handleThumbPosition]);

  function handleThumbMousedown(e) {
    e.preventDefault();
    e.stopPropagation();
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    setScrollStartPosition(clientY);
    if (contentRef.current)
      setInitialContentScrollTop(contentRef.current.scrollTop);
    setIsDragging(true);
  }

  function handleThumbMouseup(e) {
    e.preventDefault();
    e.stopPropagation();
    if (isDragging) {
      setIsDragging(false);
    }
  }

  function handleThumbMousemove(e) {
    if (contentRef.current) {
      if (isDragging) {
        const clientY = e.clientY || e.touches?.[0]?.clientY; // Handle touch events
        e.preventDefault(); // Prevent pull-to-refresh
        e.stopPropagation();
        const {
          scrollHeight: contentScrollHeight,
          clientHeight: contentClientHeight,
        } = contentRef.current;

        const trackHeight = scrollTrackRef.current?.clientHeight || 0;
        const deltaY =
          ((clientY - scrollStartPosition) / (trackHeight - thumbHeight)) *
          (contentScrollHeight - contentClientHeight); // Adjust scroll proportionally

        const newScrollTop = Math.min(
          initialContentScrollTop + deltaY,
          contentScrollHeight - contentClientHeight
        );

        contentRef.current.scrollTop = Math.max(newScrollTop, 0);
      }
    }
  }

  function handleThumbTouchStart(e) {
    e.preventDefault();
    e.stopPropagation();

    const touchY = e.touches[0].clientY; // Get the touch Y position
    setScrollStartPosition(touchY);
    if (contentRef.current) {
      setInitialContentScrollTop(contentRef.current.scrollTop);
    }
    setIsDragging(true);
  }

  useEffect(() => {
    const handleThumbTouchmove = (e) => {
      if (isDragging) handleThumbMousemove(e);
    };
    const handleThumbTouchend = (e) => handleThumbMouseup(e);

    document.addEventListener("mousemove", handleThumbMousemove);
    document.addEventListener("mouseup", handleThumbMouseup);

    // Add passive: false only for thumb-related events
    scrollThumbRef.current?.addEventListener(
      "touchmove",
      handleThumbTouchmove,
      { passive: false }
    );
    scrollThumbRef.current?.addEventListener("touchend", handleThumbTouchend);

    return () => {
      document.removeEventListener("mousemove", handleThumbMousemove);
      document.removeEventListener("mouseup", handleThumbMouseup);

      scrollThumbRef.current?.removeEventListener(
        "touchmove",
        handleThumbTouchmove
      );
      scrollThumbRef.current?.removeEventListener(
        "touchend",
        handleThumbTouchend
      );
    };
  }, [isDragging]);

  useEffect(() => {
    return () => {
      // Clear visibility timer when component unmounts
      clearTimeout(visibilityTimer.current);
    };
  }, []);

  function handleScrollButton(direction) {
    const { current: content } = contentRef;
    if (content) {
      const scrollAmount = direction === "down" ? 200 : -200;
      content.scrollBy({ top: scrollAmount, behavior: "smooth" });
    }
  }

  return (
    <ScrollContainer
      className="container"
      onTouchMove={(e) => {
        if (isDragging) e.preventDefault(); // Prevent default only when dragging
      }}
    >
      <Content
        className="content"
        id="custom-scrollbars-content"
        ref={contentRef}
        showbuttons={showButtons ? "true" : undefined}
        height={height}
      >
        {children}
      </Content>
      <Scroll
        className="scrollbar"
        showbuttons={showButtons ? "true" : undefined}
      >
        {showButtons && (
          <button
            className="button button--up"
            onClick={() => handleScrollButton("up")}
            onTouchStart={() => handleScrollButton("up")}
          >
            ↑
          </button>
        )}
        <TracknThumb
          className="track-and-thumb"
          role="scrollbar"
          aria-controls="custom-scrollbars-content"
        >
          <Track
            className="track"
            ref={scrollTrackRef}
            onClick={handleTrackClick}
            onTouchStart={handleTrackClick}
            $backgroundcolor={backgroundColor}
            style={{
              cursor: isDragging ? "grabbing" : undefined,
            }}
          ></Track>
          <Thumb
            className="thumb"
            ref={scrollThumbRef}
            onMouseDown={handleThumbMousedown}
            $isvisible={thumbVisible ? "true" : undefined}
            onTouchStart={handleThumbTouchStart}
            style={{
              height: `${thumbHeight}px`,
              cursor: isDragging ? "grabbing" : "grab",
              opacity: thumbVisible ? 0.5 : 0,
              transition: "opacity 0.3s",
            }}
          ></Thumb>
        </TracknThumb>
        {showButtons && (
          <button
            className="button button--down"
            onClick={() => handleScrollButton("down")}
            onTouchStart={() => handleScrollButton("down")}
          >
            ↓
          </button>
        )}
      </Scroll>
    </ScrollContainer>
  );
};

ScrollBar.propTypes = {
  children: PropTypes.node.isRequired,
  backgroundColor: PropTypes.node.isRequired,
  showButtons: PropTypes.node.isRequired,
  height: PropTypes.node.isRequired,
};
export default ScrollBar;
