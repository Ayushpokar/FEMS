import axios from "axios";

export const createPaymentOrder = async (amount) => {
    try {
        const res = await axios.post('/api/create-order', {amount});
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}