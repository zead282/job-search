import mongoose from "mongoose";

const companyschema=new mongoose.Schema({

    companyName: {
        type: String,
        required: true,
        unique: true
      },
      description: {
        type: String,
        required: true
      },
      industry: {
        type: String,
        required: true
      },
      address: {
        type: String,
        required: true
      },
      numberOfEmployees: {
        type:String,
        validate:{
            validator:function(x){
                const parts=x.split('-');
                if(parts.length!==2)
                    return false;
                const[min,max]=parts.map(Number)
                return (min<max && Number.isInteger(min) && Number.isInteger(max))
            },
            message: props => `${props.value} is not a valid range of employees!`

        }
      },
      companyEmail: {
        type: String,
        required: true,
        unique: true
      },
      companyHR: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
      }

},
{timestamps:true})

export default mongoose.models.Company || mongoose.model('Company',companyschema)