const { Model, DataTypes } = require('sequelize') ;
const sequelize = require('../config/connection');
const bcrypt = require("bcrypt")

class User extends Model {}

User.init({
    // add properites here, ex:
    username: {
         type: DataTypes.STRING,
         unique:true,
         allowNull:false,
         validate:{
            len:[3,10]
         }
    },
    email:{
        type: DataTypes.STRING,
         unique:true,
         allowNull:false,
         validate:{
            isEmail:true
         }
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            len:[8]
        }
    },
    imgURL:{
        type:DataTypes.STRING,
        validate:{
            is:/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
        }
    },
    Aboutme:{
        type: DataTypes.STRING,
         unique:true,
         validate:{
            len:[0,250]
         }
    },
},{
    sequelize,
    hooks:{
        beforeCreate:userObj=>{
            userObj.password = bcrypt.hashSync(userObj.password,5);
            return userObj
        }
    }
});

module.exports=User