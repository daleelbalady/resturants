import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuthCallback = async () => {
            const code = searchParams.get('code');

            if (!code) {
                console.error('No auth code found in URL');
                navigate('/');
                return;
            }

            try {
                // Exchange code for token
                const response = await fetch('https://api.daleelbalady.com/api/auth/handover/exchange', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code }),
                });

                if (!response.ok) {
                    throw new Error('Failed to exchange auth code');
                }

                const data = await response.json();

                if (data.success && data.token) {
                    // Store token
                    localStorage.setItem('auth_token', data.token);

                    // Store user data if provided
                    if (data.user) {
                        localStorage.setItem('user_data', JSON.stringify(data.user));
                    }

                    console.log('Authentication successful');

                    // Redirect to main page
                    navigate('/');
                } else {
                    throw new Error('Invalid response from API');
                }
            } catch (error) {
                console.error('Auth callback error:', error);
                // Redirect to home on error
                navigate('/');
            }
        };

        handleAuthCallback();
    }, [searchParams, navigate]);

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <div>
                <h2>Authenticating...</h2>
                <p>Please wait while we log you in.</p>
            </div>
        </div>
    );
};

export default AuthCallback;
