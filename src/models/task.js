const mongoose = require('mongoose');

// ref = referenced model name,
// to create relationship
// and access data by
// using helper methods
const taskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      trim: true,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

taskSchema.statics.isValidField = fields => {
  const allowedFields = ['description', 'completed'];
  return fields.every(field => allowedFields.includes(field));
};

// important to define it in a variable, tests fail if you use it directly
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;