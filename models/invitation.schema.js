const mongoose = require('mongoose');

// Define the schema for the Hotel entity
const invitationSchema = new mongoose.Schema({
    email:{type:String},
    role:{type:String},
    invitationKey:{type:String}
});

const Invitation = mongoose.model('Invitation', invitationSchema);

module.exports = Invitation;