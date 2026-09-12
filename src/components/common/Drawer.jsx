import {
    useEffect,
    useRef,
} from "react";
import { NavLink } from "react-router-dom";

import arrowBackIcon from "@/assets/icons/arrow-back.svg";
import homeIcon from "@/assets/icons/home.svg";
import gardenIcon from "@/assets/icons/garden.svg";
import myGardenIcon from "@/assets/icons/my-garden.svg";
import performanceIcon from "@/assets/icons/performance.svg";
import drawerDecoration from "@/assets/images/custom/drawer-decoration.png";
import drawerDivider from "@/assets/images/custom/drawer-divider.png";

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
        path: "/mygarden",
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
    const overlayRef = useRef(null);

    const previousActiveElementRef =
        useRef(null);

    const scrollTopRef = useRef(0);

    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const appFrame =
            document.querySelector(
                ".app-frame",
            );

        if (!appFrame) {
            return undefined;
        }

        /*
         * Drawer를 열기 직전의
         * 현재 스크롤 위치 저장
         */
        scrollTopRef.current =
            appFrame.scrollTop;

        /*
         * Drawer를 app-frame 맨 위가 아니라
         * 현재 보고 있는 위치에 배치
         */
        if (overlayRef.current) {
            overlayRef.current.style.top =
                `${scrollTopRef.current}px`;
        }

        const previousBodyOverflow =
            document.body.style.overflow;

        previousActiveElementRef.current =
            document.activeElement;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onCloseRef.current();

                return;
            }

            if (event.key !== "Tab") {
                return;
            }

            const focusableElements =
                panelRef.current?.querySelectorAll(
                    'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
                );

            if (!focusableElements?.length) {
                return;
            }

            const firstFocusableElement =
                focusableElements[0];

            const lastFocusableElement =
                focusableElements[
                    focusableElements.length - 1
                ];

            const isFocusOutsidePanel =
                !panelRef.current?.contains(
                    document.activeElement,
                );

            if (
                event.shiftKey &&
                (document.activeElement ===
                    firstFocusableElement ||
                    isFocusOutsidePanel)
            ) {
                event.preventDefault();

                lastFocusableElement.focus({
                    preventScroll: true,
                });

                return;
            }

            if (
                !event.shiftKey &&
                (document.activeElement ===
                    lastFocusableElement ||
                    isFocusOutsidePanel)
            ) {
                event.preventDefault();

                firstFocusableElement.focus({
                    preventScroll: true,
                });
            }
        };

        document.body.style.overflow =
            "hidden";

        appFrame.classList.add(
            "is-scroll-locked",
        );

        /*
         * overflow 상태가 바뀌어도
         * 기존 스크롤 위치 강제 유지
         */
        appFrame.scrollTop =
            scrollTopRef.current;

        document.addEventListener(
            "keydown",
            handleKeyDown,
        );

        const focusFrame =
            window.requestAnimationFrame(
                () => {
                    /*
                     * 중요:
                     * 포커스 때문에 app-frame이
                     * 맨 위로 올라가는 것 방지
                     */
                    closeButtonRef.current?.focus(
                        {
                            preventScroll: true,
                        },
                    );

                    appFrame.scrollTop =
                        scrollTopRef.current;
                },
            );

        return () => {
            window.cancelAnimationFrame(
                focusFrame,
            );

            document.removeEventListener(
                "keydown",
                handleKeyDown,
            );

            document.body.style.overflow =
                previousBodyOverflow;

            appFrame.classList.remove(
                "is-scroll-locked",
            );

            /*
             * Drawer 닫아도
             * 열기 전 위치 그대로 복원
             */
            appFrame.scrollTop =
                scrollTopRef.current;

            if (
                previousActiveElementRef
                    .current?.isConnected
            ) {
                previousActiveElementRef.current.focus(
                    {
                        preventScroll: true,
                    },
                );
            }
        };
    }, [isOpen]);

    const handlePanelClick = (event) => {
        event.stopPropagation();
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div
            ref={overlayRef}
            className="drawer-overlay"
            onClick={onClose}
        >
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

                            <p className="drawer-description">
                                공감과 추억을 나눠보세요
                            </p>
                        </div>

                        <img
                            className="drawer-divider"
                            src={drawerDivider}
                            alt=""
                            aria-hidden="true"
                        />

                        <nav
                            className="drawer-navigation"
                            aria-label="주요 메뉴"
                        >
                            {MENU_ITEMS.map(
                                (item) => (
                                    <NavLink
                                        key={
                                            item.path
                                        }
                                        className="drawer-menu-item"
                                        to={
                                            item.path
                                        }
                                        onClick={
                                            onClose
                                        }
                                    >
                                        <img
                                            className="drawer-menu-icon"
                                            src={
                                                item.icon
                                            }
                                            alt=""
                                            aria-hidden="true"
                                        />

                                        <span>
                                            {
                                                item.label
                                            }
                                        </span>
                                    </NavLink>
                                ),
                            )}
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