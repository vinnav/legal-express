const { DateTime} = require("luxon");
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TaskSchema = new Schema(
  {
    caseobj: { type: Schema.Types.ObjectId, ref: 'Caseobj', required: true }, //reference to the associated book
    description: {type: String, required: true},
    status: {type: String, required: true, enum: ['To do', 'Ongoing', 'Done', 'Maintenance'], default: 'Maintenance'},
    due: {type: Date, default: Date.now}
  }
);

// Virtual for bookinstance's URL
TaskSchema
.virtual('url')
.get(function () {
  return '/manage/task/' + this._id;
})


TaskSchema
.virtual('due_formatted')
.get(function(){
  return DateTime.fromJSDate(this.due).toLocaleString(DateTime.DATE_MED);
});

//Export model
module.exports = mongoose.model('Task', TaskSchema);