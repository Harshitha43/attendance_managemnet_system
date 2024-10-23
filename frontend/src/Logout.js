import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        const logoutUser = async () => {
            try {
                await axios.post('http://localhost:5000/api/logout', {}, { withCredentials: true });
                console.log("logout")
                navigate('/login');
            } catch (error) {
                console.error('Logout error:', error);
            }
        };

        logoutUser();
    }, [navigate]);

    return <div>Logging out...</div>;
}

export default Logout;
