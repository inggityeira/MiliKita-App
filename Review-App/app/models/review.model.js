const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const ReviewSchema = mongoose.Schema(
    {
        id_review: {
            type: Number,
            unique: true,
            index: true,
        },
        pesan_review: {
            type: String,
            required: true,
        },
        id_cabang: {
            type: Number,
            required: true,
        },
        id_menu: {
            type: Number,
            required: true,
        },
        bintang_review: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

ReviewSchema.plugin(AutoIncrement, { inc_field: 'id_review' });

const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;