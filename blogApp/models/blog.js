const { DataTypes } = require("sequelize");
const dbconn = require("../data/database");

const Blog = dbconn.define("blog", {
    baslik: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    altbaslik: {
        type: DataTypes.STRING,
        allowNull: false
    },
    aciklama: {
        type:DataTypes.TEXT,
        allowNull: true
    },
    resim: {
        type: DataTypes.STRING,
        allowNull: false
    },
    anasayfa: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    onay: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
},  {
    timestamps: true,
    validate: {
        checkValidOnay(){
            if(this.anasayfa && !this.onay){
                throw new Error("Anasayfaya aldığınız bloğu onaylamadınız!");
            }
        }
    }
    });

module.exports = Blog;