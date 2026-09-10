import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    }
}, { timestamps: true });

let wishlistModel;
try {
    wishlistModel = mongoose.model('Wishlist');
} catch (error) {
    wishlistModel = mongoose.model('Wishlist', wishlistSchema);
}

export default wishlistModel;