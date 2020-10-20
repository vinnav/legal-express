var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CaseobjSchema = new Schema(
  {
    name: {type: String, required: true, maxlength: 50, required: true},
    client: {type: Schema.Types.ObjectId, ref: 'Person', required: true},
    practicearea: {type: Schema.Types.ObjectId, ref: 'Practicearea', required: true},
    jurisdiction: {type: String, required: true, maxlength: 50},
    status: {type: String, required: true, enum: ['Ongoing', 'Archived', 'Maintenance'], default: 'Maintenance'},
    claimant: {type: Schema.Types.ObjectId, ref: 'Person'},
    defendant: {type: Schema.Types.ObjectId, ref: 'Person'},
    lawyer: {type: Schema.Types.ObjectId, ref: 'Person'},
    summary: {type: String},
    task: {type: Schema.Types.ObjectId, ref: 'Task'},
  }
);

CaseobjSchema
.virtual('url')
.get(function () {
  return '/manage/caseobj/' + this._id;
});

//Export model
module.exports = mongoose.model('Caseobj', CaseobjSchema);