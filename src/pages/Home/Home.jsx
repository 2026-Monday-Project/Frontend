import homeDivider from "@/assets/images/custom/home-devider.svg";
import "./Home.css";

const Home = () => {
  return (
    <main className="home-container">
      <div className="home-design">
        <section className="home-info">
          <h1 className="home-title">
            MAGGIE'S
            <br />
            GARDEN
          </h1>

          <img
            className="home-divider"
            src={homeDivider}
            alt=""
            aria-hidden="true"
          />

          <p className="home-subtitle">
            pouring love and letters
          </p>

          <img
            className="home-divider"
            src={homeDivider}
            alt=""
            aria-hidden="true"
          />

          <div className="home-performance-info">
            <p>2026.10.15(목) 20:00</p>
            <p>살롱문보우</p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;