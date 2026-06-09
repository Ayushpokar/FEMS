import RazorPay from 'razorpay';

const razorpay = new RazorPay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) =>{
    const data = req.body;
    const amount = data.amount
    try {
        const options = {
            amount: amount*100,
            currency: "INR",
            receipt : `receipt_fems_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json(order);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Failed to generate payment order token"});
    }
}