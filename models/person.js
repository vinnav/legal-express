var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PersonSchema = new Schema(
    {
        first_name: {type: String, required: true, maxlength: 100},
        last_name: {type: String, required: true, maxlength: 100},
        contact_phone: {type: String, maxlength: 20},
        contact_mail: {type: String, maxlength: 30},
    }
);

// Virtual for author's full name
PersonSchema
.virtual('name')
.get(function (){

    var fullname = '';
    if (this.first_name && this.last_name){
        fullname = this.last_name + ', ' + this.first_name;
    }
    if (!this.first_name || !this.last_name){
        fullname = '';
    }

    return fullname;
});

// Virtual for author's URL
PersonSchema
.virtual('url')
.get(function () {
    return '/manage/person/' + this.id;
});

// Export model
module.exports = mongoose.model('Person', PersonSchema);