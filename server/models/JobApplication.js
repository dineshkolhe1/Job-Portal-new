import mongoose from "mongoose";

const JobApplicationSchema = new mongoose.Schema({
    userId: { type: String, required: true },  // Clerk userId
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    status: { type: String, default: 'Pending' },
    date: { type: Number, required: true }
});

JobApplicationSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',     // field in JobApplication
  foreignField: 'clerkId',  // field in User
  justOne: true
});

JobApplicationSchema.set('toObject', { virtuals: true });
JobApplicationSchema.set('toJSON', { virtuals: true });


const JobApplication = mongoose.model('JobApplication', JobApplicationSchema);

export default JobApplication;















// import mongoose from "mongoose";

// const JobApplicationSchema = new mongoose.Schema({
//     userId: {type:String, ref:'User',required:true},
//     companyId: {type : mongoose.Schema.Types.ObjectId,ref:'Company',required:true},
//     jobId: {type : mongoose.Schema.Types.ObjectId,ref:'Job',required:true},
//     status: {type: String, default:'Pending'},
//     date: {type:Number, required:true}
// })

// const JobApplication = mongoose.model('JobApplication',JobApplicationSchema)

// export default JobApplication