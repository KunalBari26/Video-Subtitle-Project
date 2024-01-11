'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Video extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Video.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            video_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            video_file: { type: DataTypes.BLOB, allowNull: false },
        },
        {
            sequelize,
            modelName: 'Video',
        }
    );
    return Video;
};
