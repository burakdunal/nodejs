const { DataTypes } = require("sequelize");
const dbconn = require("../data/database");
const bcrypt = require("bcrypt");

const User = dbconn.define("user",{
    fullname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty:{
                msg: "Ad Soyad boş bırakılamaz."
            },
            isFullname(value){
                if(value.split(" ").length < 2){
                    throw new Error("Lütfen Ad ve Soyad bilginizi giriniz.");
                }
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: "Eposta daha önceden kayıtlı."
        },
        validate: {
            notEmpty:{
                msg: "E-posta boş bırakılamaz."
            },
            isEmail: {
                msg: "E-posta formatı eşleşmiyor."
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Parola boş bırakılamaz"
            },
            len: {
                args: [5, 10],
                msg: "Parola 5 ile 10 karakter arasında olmalıdır."
            }
        }
    },
    resetToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resetTokenExp: {
        type: DataTypes.DATE,
        allowNull: true
    }
},{timestamps: true});

User.afterValidate(async(user) => {
    user.password = await bcrypt.hash(user.password, 10);
});

module.exports = User;