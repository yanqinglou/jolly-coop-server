const { Model, DataTypes } = require('sequelize') ;
const sequelize = require('../config/connection');

class Countdown extends Model {}

Countdown.init({
    // add properites here, ex:
    enddate:{
        type:DataTypes.DATE,
        allowNull:false
    },
    status:{
        type:DataTypes.STRING,
        validate:{
            isIn: [['on-going', 'closed']],
        }
    }

   
},{
    sequelize
});

module.exports=Countdown