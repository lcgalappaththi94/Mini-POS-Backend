module.exports = (sequelize, Sequelize) => {
    return sequelize.define('order_product', {
        numItems: {
            type: Sequelize.INTEGER
        }
    });
};