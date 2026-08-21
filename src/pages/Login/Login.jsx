import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('default');

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);

        if (value === '') {
            setStatus('default');
        } else if (value === 'loveyou@naver.com') {
            setStatus('error');
        } else if (value.includes('@')) {
            setStatus('success');
        } else {
            setStatus('default');
        }
    };

    const handleSubmit = () => {
        if (status === 'success') {
            navigate('/my-garden');
        }
    };

    return (
        <div className="login-container">
            <Navbar />
            <main className="login-main">
                <h2 className="main-title">
                    사연을 보낼 때 사용한<br />이메일을 입력해주세요
                </h2>
                <div className="input-group">
                    <label htmlFor="email">이메일</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="이메일"
                        className={`email-input ${status === 'error' ? 'error' : ''}`}
                    />
                    {status === 'success' && (
                        <p className="helper-text success">
                            사연을 제출한 적 있는 이메일이에요.<br />
                            로그인하기 버튼을 눌러 제출했던 사연을 확인해 보세요.
                        </p>
                    )}
                    {status === 'error' && (
                        <p className="helper-text error">
                            아직 제출한 사연이 없어요.<br />
                            사연을 제출한 후 로그인 할 수 있어요.
                        </p>
                    )}
                </div>
            </main>
            <footer className="login-footer">
                <button
                    className="submit-button"
                    disabled={status !== 'success'}
                    onClick={handleSubmit}
                >
                    내 정원으로 가기
                </button>
            </footer>
        </div>
    );
};

export default Login;