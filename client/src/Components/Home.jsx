import React from "react";
import { useLocation } from "react-router-dom";

function Home() {
    const location = useLocation();
    const user = location.state?.user;

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                color: 'white',
                backgroundColor: '#282c34', // Optional: background color for better contrast
                padding: '20px',
            }}
        >
            <h1>{`Hello, I am ${user?.name || 'Guest'}`}</h1>

            <div style={{ margin: '20px 0', textAlign: 'center' }}>
                <p style={{ fontSize: '1.2rem' }}>{`Twitter: ${user?.twitterHandle || 'Not provided'}`}</p>
                <p style={{ fontSize: '1.2rem' }}>{`Instagram: ${user?.instagramHandle || 'Not provided'}`}</p>
            </div>

            {user?.images && user.images.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
                    {user.images.map((image, index) => (
                        <img
                            key={index}
                            src={`http://localhost:3001/${image}`} 
                            alt={`Uploaded ${index + 1}`}
                            style={{
                                width: '150px',
                                height: '150px',
                                objectFit: 'cover',
                                borderRadius: '10px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                            }}
                        />
                    ))}
                </div>
            ) : (
                <p style={{ fontSize: '1.2rem', marginTop: '20px' }}>No images uploaded.</p>
            )}
        </div>
    );
}

export default Home;
