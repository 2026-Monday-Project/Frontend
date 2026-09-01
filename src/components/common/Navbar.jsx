import arrowBackIcon from "@/assets/icons/arrow-back.svg";
import menuIcon from "@/assets/icons/menu.svg";

import "./Navbar.css";

const Navbar = ({
  title,
  showBackButton = false,
  onBack,
  showMenuButton = false,
  isMenuOpen = false,
  onMenuClick,
}) => {
  return (
    <header className="navbar">
      <div className="navbar-action">
        {showBackButton && (
          <button
            type="button"
            className="navbar-button"
            onClick={onBack}
            aria-label="뒤로 가기"
          >
            <img
              className="navbar-icon"
              src={arrowBackIcon}
              alt=""
              aria-hidden="true"
            />
          </button>
        )}
      </div>

      <p className="navbar-title">{title}</p>

      <div className="navbar-action">
        {showMenuButton && (
          <button
            type="button"
            className="navbar-button"
            onClick={onMenuClick}
            aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={isMenuOpen}
            aria-controls="common-drawer"
          >
            <img
              className="navbar-icon"
              src={menuIcon}
              alt=""
              aria-hidden="true"
            />
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
