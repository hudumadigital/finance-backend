const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const utilitiesModel = new Schema({
    customer: {
        customerId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Customer"
        },
        email: { type: String }
    },
    utility: {
        type: Object,
    }

});
module.exports = mongoose.model('Utilities', utilitiesModel);