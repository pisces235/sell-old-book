const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String},
    stored: {type: Number},
    issuing_company: { type: String },
    publication_date: { type: String },
    book_cover_type:{type: String},
    size: { type: String },
    pagenumber:{type: Number},
    translator: { type: String },
    SKU: { type: String, required: true },
    publicsher: {type: String},
    description: { type: String, required: true },
    type: { type:String, required: true },
    slug: { type: String, slug: "title", unique: true},
    rating: { type: Number, min: 0, max: 5, default: 0, required: true },
    featured: {type: Boolean},
    gallery: { type: Array },
    rate: { type: Array },
    saled: { type: Number, min: 0, default: 0 },
    image:{type: String},
    price: { type: Number, default: 0, min: 0, required: true },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Book', bookSchema);