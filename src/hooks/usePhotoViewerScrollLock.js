import { useLayoutEffect } from "react";

// Fixed overlays inside a transformed AppFrame use that frame as their container.
export const usePhotoViewerScrollLock = (viewerRef, isOpen) => {
  useLayoutEffect(() => {
    if (!isOpen || !viewerRef.current) return;

    const viewer = viewerRef.current;
    const frame = viewer.closest(".app-frame");
    if (!frame) return;

    const scrollTop = frame.scrollTop;
    const previousOverflow = frame.style.overflowY;
    const previousTop = viewer.style.top;
    const previousBodyOverflow = document.body.style.overflow;
    const viewport = frame.closest(".app-frame-viewport");
    const viewportScrollTop = viewport?.scrollTop ?? 0;
    const previousViewportOverflow = viewport?.style.overflow;

    // Focus/scrollIntoView can scroll even an overflow:hidden scale wrapper.
    // The modal must cover the visible frame, not that wrapper's scroll offset.
    if (viewport) {
      viewport.scrollTop = 0;
      viewport.style.overflow = "clip";
    }

    if (getComputedStyle(frame).transform !== "none") {
      viewer.style.top = `${scrollTop}px`;
    }
    frame.style.overflowY = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      viewer.style.top = previousTop;
      frame.style.overflowY = previousOverflow;
      frame.scrollTop = scrollTop;
      if (viewport) {
        viewport.style.overflow = previousViewportOverflow;
        viewport.scrollTop = viewportScrollTop;
      }
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [viewerRef, isOpen]);
};
