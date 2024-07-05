import mongoose from "mongoose";

const quotaSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  quota: {
    type: Number,
    required: true,
    default: 1000
  },

  maxquota: {
    type: Number,
    required: true,
    default:1000
  } ,

});

const Quota = mongoose.model("Quota", quotaSchema);

export default Quota;