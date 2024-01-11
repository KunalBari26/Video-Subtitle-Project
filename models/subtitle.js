'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Subtitle extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Subtitle.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            subtitle_filename: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            subtitle_file: { type: DataTypes.BLOB, allowNull: false },
        },
        {
            sequelize,
            modelName: 'Subtitle',
        }
    );
    return Subtitle;
};
