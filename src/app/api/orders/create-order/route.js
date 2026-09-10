import { auth } from "@/auth";
import connectDB from "@/lib/db";
import cartModel from "@/models/cartModel";
import { orderModel, sellerOrderModel } from "@/models/orderModel";
import { NextResponse } from "next/server";
import { stripe } from '@/lib/stripe';


export async function POST(req)
{
    try
    {
        const { user } = await auth();
        const { fullName, email, phone, city, address1, address2, paymentMethod } = await req.json();

        if(!fullName || !email || !phone || !city || !address1 || !address2 || !paymentMethod)
        {
            return NextResponse.json({
                success : false,
                message : "All fields are required"
            }, { status : 400 });
        }

        await connectDB();
        // get cart items
        const cartItems = await cartModel.find({ userId : user.id }).populate("productId");
        if(!cartItems)
        {
            return NextResponse.json({
                success : false,
                message : "No cart items found"
            }, { status : 400 });
        }

        const subtotal = cartItems?.reduce((acc, item) => acc + item.qty * item.productId.discountPrice, 0)
        const total = subtotal + 50;

        // build products
        const products = cartItems.map((item) => ({
            productId : item.productId._id,
            quantity : item.qty,
            sellerId : item.productId.userId,
            price : item.productId.discountPrice
        }));

        if(paymentMethod === "cod")
        {
            // create customer order (cod)
            const codOrder = await orderModel.create({
                userId : user.id,
                shippingAddress: {
                    fullName, email, phone, city, address1, address2
                },
                products,
                subtotal,
                shippingFee : 50,
                totalAmount : total,
                paymentMethod
            });

            // create seller orders
            
            // group by seller
            const sellerMap = {};

            for(let item of products)
            {
                const id = item.sellerId.toString();
                if(!sellerMap[id])
                {
                    sellerMap[id] = {
                        sellerid : id,
                        products : [],
                        subtotal : 0,
                    };
                }
                sellerMap[id].products.push(item);
                sellerMap[id].subtotal += item.price * item.quantity;
            }
            // seller order
            const sellerOrder = await sellerOrderModel.insertMany(
                Object.values(sellerMap).map(seller => ({
                    orderId : codOrder._id,
                    sellerId : seller.sellerid,
                    customerId : user.id,
                    products : seller.products,
                    subtotal : seller.subtotal
                }))
            )

            // remove items from cart
            await cartModel.deleteMany({ userId : user.id });

            return NextResponse.json({
                success : true,
                message : "Order placed successfully"
            }, { status : 200 });
        }

        // STRIPE PAYMENT
        if(paymentMethod === "stripe")
        {
            
                // STRIPE LINE ITEMS
                const lineItems = cartItems.map((item) => ({
                  price_data: {
                    currency: "usd",
            
                    product_data: {
                      name: item?.productId.name,
                    //   images: [item?.productId.images[0].url]
                    },
            
                    unit_amount: item?.productId.discountPrice * 100
                  },
            
                  quantity: item.qty,
                }));
            
            
                // CREATE SESSION
                const session = await stripe.checkout.sessions.create({
            
                  payment_method_types: ["card"],
            
                  line_items: lineItems,
            
                  mode: "payment",
            
                  success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
            
                  cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
            
                  metadata: {
                    userId: user.id,
                    products: JSON.stringify(products),
                    subtotal: subtotal,
                    shippingFee: 50,
                    totalAmount: total,
                    shippingAddress : JSON.stringify({
                        fullName, email, phone, city, address1, address2
                    }),
                    paymentMethod,
                  }
                });
            
            
                return NextResponse.json({
                  success: true,
                  url: session.url
                });
                
        }
        // STRIPE PAYMENT


        return NextResponse.json({
            success : true,
            message : "Payment failed or wrong payment method"
        }, { status : 400 });
    }
    catch(error)
    {
        console.log(error);
        return NextResponse.json({
            success : false,
            message : error.message
        }, { status : 500 });
    }
}