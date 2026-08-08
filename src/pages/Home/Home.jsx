import homeBackground from "@/assets/images/custom/home-background.svg";
import "./Home.css";

const Home = () => {
  return (
    <main className="home-container">
      <img
        className="home-background"
        src={homeBackground}
        alt=""
        aria-hidden="true"
      />

    </main>
  );
};

export default Home;