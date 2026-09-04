import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import api from '@/api/axios';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('default');

    useEffect(() => {
        // 이메일이 비어있거나 '@'가 없으면 API 호출을 하지 않고 조용히 종료
        // (상태는 이미 위 핸들러에서 'default'로 변경되었음)
        if (email === '' || !email.includes('@')) {
            return;
        }

        const checkEmailTimer = setTimeout(async () => {
            try {
                const response = await api.get('/accounts/email-check', {
                    params: { email: email }
                });
                
                if (response.data.available === false) {
                    setStatus('success');
                } else {
                    setStatus('error');
                }
            } catch (error) {
                console.error('이메일 확인 중 오류 발생:', error);
                setStatus('error');
            }
        }, 500);

        return () => clearTimeout(checkEmailTimer);
    }, [email]);

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setStatus('default');
    };

    const handleSubmit = async () => {
        if (status !== 'success') return;

        try {
            const response = await api.post('/accounts/login', {
                email: email
            });

            const token = response.data.accessToken;

            if (token) {
                localStorage.setItem('accessToken', token);
                navigate('/login-completed');
            } else {
                alert('토큰 발급에 실패했습니다.');
            }
        } catch (error) {
            console.error('로그인 실패:', error);
            alert('로그인에 실패했습니다. 다시 시도해 주세요.');
        }
    };

    return (
        <div className="login-page">
            <Navbar
                title="로그인"
                showBackButton={true}
                onBack={() => navigate(-1)}
                showMenuButton={true}
            />
            <div className="login-container">
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
        </div>
    );
};

export default Login;