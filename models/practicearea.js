var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PracticeareaSchema = new Schema(
  {
    name: { type: String, required: true}
  }
);

// Virtual for bookinstance's URL
PracticeareaSchema
.virtual('url')
.get(function () {
  return '/manage/practicearea/' + this._id;
});

//Export model
module.exports = mongoose.model('Practicearea', PracticeareaSchema);