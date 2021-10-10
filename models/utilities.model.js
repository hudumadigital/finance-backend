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
    utilities: {}

});
module.exports = mongoose.model('Utilities', utilitiesModel);