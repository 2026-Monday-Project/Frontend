import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

import arrowBackIcon from "@/assets/icons/arrow-back.svg";
import homeIcon from "@/assets/icons/home.svg";
import gardenIcon from "@/assets/icons/garden.svg";
import myGardenIcon from "@/assets/icons/my-garden.svg";
import performanceIcon from "@/assets/icons/performance.svg";
import drawerDecoration from "@/assets/images/custom/drawer-decoration.png";

import "./Drawer.css";

const MENU_ITEMS = [
  {
    label: "홈",
    path: "/",
    icon: homeIcon,
  },
  {
    label: "정원 둘러보기",
    path: "/garden",
    icon: gardenIcon,
  },
  {
    label: "내 정원",
    path: "/my-garden",
    icon: myGardenIcon,
  },
  {
    label: "공연 안내",
    path: "/performance",
    icon: performanceIcon,
  },
];

const Drawer = ({ isOpen, onClose }) => {
  const closeButtonRef = useRef(null);
  const panelRef = useRef(null);
  const previousActiveElementRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousBodyOverflow = document.body.style.overflow;
    previousActiveElementRef.current = document.activeElement;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = panelRef.current?.querySelectorAll(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      if (!focusableElements?.length) return;

      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement = focusableElements[focusableElements.length - 1];
      const isFocusOutsidePanel = !panelRef.current?.contains(document.activeElement);

      if (event.shiftKey && (document.activeElement === firstFocusableElement || isFocusOutsidePanel)) {
        event.preventDefault();
        lastFocusableElement.focus();
        return;
      }

      if (!event.shiftKey && (document.activeElement === lastFocusableElement || isFocusOutsidePanel)) {
        event.preventDefault();
        firstFocusableElement.focus();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    const focusFrame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;

      if (previousActiveElementRef.current?.isConnected) {
        previousActiveElementRef.current.focus();
      }
    };
  }, [isOpen]);

  const handlePanelClick = (event) => {
    event.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-container">
        <aside
          ref={panelRef}
          id="common-drawer"
          className="drawer-panel"
          role="dialog"
          aria-modal="true"
          aria-label="전체 메뉴"
          onClick={handlePanelClick}
        >
          <button
            ref={closeButtonRef}
            type="button"
            className="drawer-close-button"
            onClick={onClose}
            aria-label="메뉴 닫기"
          >
            <img
              className="drawer-close-icon"
              src={arrowBackIcon}
              alt=""
              aria-hidden="true"
            />
          </button>

          <div className="drawer-content">
            <div className="drawer-introduction">
              <p className="drawer-heading">
                반려동물과 함께한
                <br />
                소중한 순간들
              </p>
              <p className="drawer-description">공감과 추억을 나눠보세요</p>
            </div>

            <div className="drawer-divider" aria-hidden="true" />

            <nav className="drawer-navigation" aria-label="주요 메뉴">
              {MENU_ITEMS.map((item) => (
                <NavLink
                  key={item.path}
                  className="drawer-menu-item"
                  to={item.path}
                  onClick={onClose}
                >
                  <img
                    className="drawer-menu-icon"
                    src={item.icon}
                    alt=""
                    aria-hidden="true"
                  />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          <img
            className="drawer-decoration"
            src={drawerDecoration}
            alt=""
            aria-hidden="true"
          />
        </aside>
      </div>
    </div>
  );
};

export default Drawer;
