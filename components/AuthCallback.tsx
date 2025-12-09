import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleAuthCallback = async () => {
            const code = searchParams.get('code');
            const userId = searchParams.get('userId');

            if (!code) {
                console.error('No auth code found in URL');
                setError('No authentication code provided');
                setTimeout(() => navigate('/'), 3000);
                return;
            }

            try {
                // Exchange code for token
                const response = await fetch('https://api.daleelbalady.com/api/auth/handover/exchange', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // Important for cookies
                    body: JSON.stringify({ code }),
                });

                if (!response.ok) {
                    throw new Error(`Failed to exchange auth code: ${response.status}`);
                }

                const data = await response.json();

                // Check response structure - backend returns { message, token, user, needsOnboarding, redirectTo }
                if (!data.token || !data.user) {
                    throw new Error('Invalid response from authentication server');
                }

                // Store token in localStorage
                localStorage.setItem('authToken', data.token);

                // Store user data
                if (data.user) {
                    localStorage.setItem('user_data', JSON.stringify(data.user));
                }

                console.log('Authentication successful', {
                    userId: data.user.id,
                    role: data.user.role
                });

                // Determine redirect path based on user role and userId match
                const authenticatedUserId = data.user.id;
                const targetUserId = userId || authenticatedUserId;

                // If authenticated user's ID matches the target userId, show provider dashboard
                // Otherwise show customer view
                if (authenticatedUserId === targetUserId && data.user.role === 'PROVIDER') {
                    // Provider accessing their own restaurant
                    navigate(`/provider/${authenticatedUserId}`);
                } else {
                    // Customer or provider viewing someone else's menu
                    navigate(`/${targetUserId}`);
                }

            } catch (error) {
                console.error('Auth callback error:', error);
                setError(error instanceof Error ? error.message : 'Authentication failed');
                // Redirect to home after showing error
                setTimeout(() => navigate('/'), 3000);
            }
        };

        handleAuthCallback();
    }, [searchParams, navigate]);

    if (error) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>Authentication Error</h2>
                    <p style={{ color: '#6b7280' }}>{error}</p>
                    <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '1rem' }}>Redirecting to home...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    border: '4px solid #e5e7eb',
                    borderTopColor: '#3b82f6',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 1rem'
                }}></div>
                <h2>Authenticating...</h2>
                <p style={{ color: '#6b7280' }}>Please wait while we log you in.</p>
            </div>
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default AuthCallback;
