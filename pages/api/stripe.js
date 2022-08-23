import Stripe from 'stripe';
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// console.log(stripe);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if(req.method === 'POST') {
        // console.log(req.body.cartItems);
        try {
            const params = {
                submit_type: 'pay',
                mode: 'payment',
                payment_method_types: ['card'],
                billing_address_collection: 'auto',
                shipping_options: [
                    { shipping_rate: 'shr_1LZuOSGF5Ul2Kog5Bl8lwEkC' },
                    { shipping_rate: 'shr_1LZuTWGF5Ul2Kog5nKHNMM60' }
                ],
                line_items: req.body.map((item) => {
                    const img = item.image[0].asset._ref;
                    const newImage = img.replace('image', 'http://cdn.sanity.io/images/ac7ndf0u/production/').replace('-webp', '.webp');

                    return {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: item.name,
                                images: [newImage],
                        },
                            unit_amount: item.price * 100,
                        },
                        adjustable_quantity: {
                            enabled: true,
                            minimum: 1,
                        },
                        quantity: item.quantity
                    }
                }),
                success_url: `${req.headers.origin}/success`,
                cancel_url: `${req.headers.origin}/canceled`,
            }
            //Create checkout sessions from body params
            const session = await stripe.checkout.sessions.create(params);
            res.status(200).json(session);
        } catch (error) {
            res.status(500).json({ statusCode: 500, message: error.message });
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}