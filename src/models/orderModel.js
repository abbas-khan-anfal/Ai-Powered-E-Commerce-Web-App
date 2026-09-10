import mongoose from "mongoose";


// order schema
const orderSchema = new mongoose.Schema(
  {
    // user who placed order
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ordered products
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
        },

        sellerId : {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        price : {
          type : Number,
          required : true
        }
      },
    ],

    // shipping info
    shippingAddress: {
      fullName: String,
      email: String,
      phone: String,
      city: String,
      country: { type : String, default : "pakistan" },
      address1: String,
      address2: String,
    },

    // payment
    paymentMethod: {
      type: String,
      enum: ["cod", "stripe"],
      default: "cod",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    // prices
    subtotal: Number,
    shippingFee: Number,
    totalAmount: Number,
  },
  { timestamps: true }
);

const orderModel =
  mongoose.models.Order || mongoose.model("Order", orderSchema);






// seller order schema
const sellerOrderSchema = new mongoose.Schema({
  // reference to main order
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },

  // products specific to this seller
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price : {
        type : Number,
        required : true
      },
    },
  ],

  // seller info
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // customer id
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // subtotal
  subtotal: Number,

  // status
  orderStatus: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered"],
    default: "pending",
  },
}, { timestamps : true });

const sellerOrderModel =
  mongoose.models.SellerOrder || mongoose.model("SellerOrder", sellerOrderSchema);

export { orderModel, sellerOrderModel };