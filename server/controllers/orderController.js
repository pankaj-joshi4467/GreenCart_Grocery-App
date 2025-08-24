import Order from "../models/Order.js";
import Product from "../models/Product.js"
import stripe from "stripe"
import User from "../models/User.js"

// Place Order COD : /api/order/cod
export const placeOrderCOD = async (req,res)=>{
    try {
        const {userId,items,address} = req.body;
        if (!address || items.length === 0) {
            return res.json({success:false,message:"Invaild data"})
           }
           //calculate Amount Using Items
           let amount = await items.reduce(async (acc,item)=>{

            const product = await Product.findById(item.product);
              return (await acc) + product.offerPrice * item.quantity;

           },0)

           //ADD Tax Charge (2%)
           amount += Math.floor(amount * 0.02);

           await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType:"COD"
           });

           return res.json({success:true,message:"Order Placed Successfully"})
    } catch (error) {

        return res.json({success:false,message :error.message})
        
    }
}

// STRIPE : /api/order/STRIPE
export const placeOrderStripe = async (req,res)=>{
    try {
        const {userId,items,address} = req.body;
        const {origin} = req.headers;
        if (!address || items.length === 0) {
            return res.json({success:false,message:"Invaild data"})
           }
           let productData = [];
           //calculate Amount Using Items
           let amount = await items.reduce(async (acc,item)=>{

            const product = await Product.findById(item.product);
            productData.push({
                name:product.name,
                price:product.offerPrice,
                quantity:item.quantity,
            });
              return (await acc) + product.offerPrice * item.quantity;

           },0)

           //ADD Tax Charge (2%)
           amount += Math.floor(amount * 0.02);

          const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType:"Online"
           });
           // stripe Gateway Intialize
           const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
            // create line items for stripe

            const line_items = productData.map((item)=>{
                return{
                    price_data:{
                        currency:"usd",
                        product_data:{
                            name:item.name,
                        },
                        unit_amount: Math.floor(item.price + item.price * 0.02) * 100
                    },
                    quantity: item.quantity,
                }

            })

            // create session
             const session = await stripeInstance.checkout.sessions.create({
                line_items,
                mode:"payment",
                success_url : `${origin}/loader?next=my-orders`,
                cancel_url: `${origin}/cart`,
                metadata:{
                    orderId:order._id.toString(),
                    userId,
                }

             })

           return res.json({success:true, url:session.url})
    } catch (error) {

        return res.json({success:false,message :error.message})
        
    }
}

//  sTRIPE WEBhooks to verify payments Action: / striped

export const stripeWebhooks = async(request,response)=>{
    // Stripe Gateway initialize
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const sig = request.headers["stripe-signature"];
    let event;
    try {
        event = stripeInstance.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        response.status(400).send(`Webhook Error : ${error.message}`)


        
    }
    // handle the  event
    switch (event.type) {
        case "payment_intent.succeeded":{
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            // Getting Session Metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent:paymentIntentId,
            
            });
            const {orderId,userId} = session.data[0].metadata;

            // mark payment is paid
            await Order.findByIdAndUpdate(orderId,{isPaid:true})
             // clear user cart
             await User.findByIdAndUpdate(userId,{cartItems:{}})
               break;

        }

        case "payment_intent.payment_failed":{

            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            // Getting Session Metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent:paymentIntentId,
            
            });
            const {orderId} = session.data[0].metadata;
            await Order.findByIdAndDelete(orderId);
            break;

        }
            
          
    
        default:
            console.error(`unhandled event type ${event.type}`)
            break;
    }
    response.json({received:true})

}



// Get Orders by USer ID : /api/order/user

export const getUserOrders = async(req,res)=>{
    try {
        const userId = req.user.id;
         console.log("userId:", userId);
        const orders = await Order.find({
            userId,
            $or: [{paymentType  : "COD"},{isPaid:true}]
        }).populate("items.product address").sort({createdAt: -1});
        res.json({success:true,orders});
    } catch (error) {
        res.json({success:false,message:error.message});
        
    }
}

// Get All Orders ( for seller / admin) : /api/order/seller

export const getAllOrders = async(req,res)=>{
    try {
        
        const orders = await Order.find({
         
            $or: [{paymentType : "COD"},{isPaid:true}]
        }).populate("items.product address").sort({createdAt: -1});
        res.json({success:true,orders});
    } catch (error) {
        res.json({success:false,message:error.message});
        
    }
}