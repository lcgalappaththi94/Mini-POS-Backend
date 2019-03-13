module.exports = (sequelize, Sequelize) => {
    return sequelize.define('order', {
        open: {
            type: Sequelize.BOOLEAN
        }
    });
};