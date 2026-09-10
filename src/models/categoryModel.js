import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        trim: true,
        default: ""
    },
    totalProducts: {
        type: Number,
        default: 0
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    }
}, { timestamps: true });

let categoryModel;
try {
    categoryModel = mongoose.model('Category');
} catch (error) {
    categoryModel = mongoose.model('Category', categorySchema);
}

export default categoryModel;
