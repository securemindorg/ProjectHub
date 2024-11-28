import axios from 'axios';

export const login = async (username: string, password: string) => {
    try {
        const response = await axios.post('http://localhost:3000/api/login', {
            username,
            password,
        });
        return response.data; // Expected to return a token or user info
    } catch (error: any) {
        throw error.response || error;
    }
};
