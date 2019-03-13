module.exports = (sequelize, Sequelize) => {
    return sequelize.define('product', {
        name: {
            type: Sequelize.STRING
        },
        unitPrice: {
            type: Sequelize.INTEGER
        },
        availability: {
            type: Sequelize.INTEGER
        }
    });
};