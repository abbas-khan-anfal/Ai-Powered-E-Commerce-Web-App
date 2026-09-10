import { stripe } from "@/lib/stripe";
import cartModel from "@/models/cartModel";
import { orderModel, sellerOrderModel } from "@/models/orderModel";

export async function POST(req) {
  console.log("🔥 WEBHOOK HIT");

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.log("❌ SIGNATURE ERROR:", err.message);

    return Response.json({ success: false }, { status: 400 });
  }

  console.log("EVENT TYPE:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const products = JSON.parse(session.metadata.products);

    console.log("💚 PAYMENT SUCCESS");

    const order = await orderModel.create({
      userId: session.metadata.userId,
      products: products,
      shippingAddress: JSON.parse(session.metadata.shippingAddress),
      paymentMethod: session.metadata.paymentMethod,
      subtotal: Number(session.metadata.subtotal),
      shippingFee: Number(session.metadata.shippingFee),
      totalAmount: Number(session.metadata.totalAmount),
    });

    // create seller orders

    // group by seller
    const sellerMap = {};

    for (let item of products) {
      const id = item.sellerId.toString();
      if (!sellerMap[id]) {
        sellerMap[id] = {
          sellerid: id,
          products: [],
          subtotal: 0,
        };
      }
      sellerMap[id].products.push(item);
      sellerMap[id].subtotal += item.price * item.quantity;
    }
    // seller order
    const sellerOrder = await sellerOrderModel.insertMany(
      Object.values(sellerMap).map((seller) => ({
        orderId: order._id,
        sellerId: seller.sellerid,
        customerId: session.metadata.userId,
        products: seller.products,
        subtotal: seller.subtotal,
      })),
    );

    // remove items from cart
    await cartModel.deleteMany({ userId: session.metadata.userId });
  }

  return Response.json({ received: true });
}
