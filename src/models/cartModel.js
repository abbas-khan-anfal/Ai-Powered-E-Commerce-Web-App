import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    qty: {
        type: Number,
        default: 1
    }
}, { timestamps: true });

let cartModel;
try {
    cartModel = mongoose.model('Cart');
} catch (error) {
    cartModel = mongoose.model('Cart', cartSchema);
}

export default cartModel;