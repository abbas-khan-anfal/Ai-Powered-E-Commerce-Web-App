import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug : {
        type : String,
        unique : true,
        required : true
    },
    description : {
        type : String,
        trim : true,
        default : ""
    },
    productNumber : {
        type : String,
        required : true,
        unique : true
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    price: { type: Number, required: true },        // actual/base price
    discountPrice: { type: Number, default: 0 },   // price after discount
    stock : {
        type : Number,
        default : 0
    },
    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Category",
        required : true
    },
    reviews: {
        type : [
            {
                userId: {type : mongoose.Schema.Types.ObjectId, ref : "User"},
                review: String,
                rating: Number,
                createdAt: Date
            }
        ],
        default: []
    },
    img_paths : {
        type : [String]
    },
    img_pub_ids : {
        type : [String]
    }
}, { timestamps: true });

let productModel;
try {
    productModel = mongoose.model('Product');
} catch (error) {
    productModel = mongoose.model('Product', productSchema);
}
export default productModel;