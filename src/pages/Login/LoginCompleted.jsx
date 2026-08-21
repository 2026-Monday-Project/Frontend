import { useNavigate } from 'react-router-dom';
import loginCompletedImg from '@/assets/images/custom/login-completed.svg';
import './LoginCompleted.css';

const LoginCompleted = () => {
    const navigate = useNavigate();

    const handleGoMyGarden = () => {
        navigate('/my-garden');
    };

    const handleLookAround = () => {
        navigate('/garden');
    };

    return (
        <div className="login-completed-container">
            <main className="completed-main">
                <div className="image-wrapper">
                    <img
                        src={loginCompletedImg}
                        alt="정원 문과 우체통"
                        className="completed-image"
                    />
                </div>

                <h1 className="completed-title">
                    정원에 오신 것을<br />환영합니다.
                </h1>
                <p className="completed-subtitle">
                    따뜻한 이야기를 함께 나눠보세요.
                </p>
            </main>

            <footer className="completed-footer">
                <button className="primary-button" onClick={handleGoMyGarden}>
                    내 정원으로 가기
                </button>
                <button className="secondary-button" onClick={handleLookAround}>
                    정원 둘러보기
                </button>
            </footer>
        </div>
    );
};

export default LoginCompleted;