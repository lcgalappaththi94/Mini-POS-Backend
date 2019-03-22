const Sequelize = require('sequelize');
const sequelize = new Sequelize('my_pos', 'root_lcg', '12345678', {
    host: 'db4free.net',
    dialect: 'mysql',
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        timestamps: false
    }
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const OrderProduct = require('./models/OrderProduct')(sequelize, Sequelize);
const User = require('./models/User')(sequelize, Sequelize);
const Order = require('./models/Order')(sequelize, Sequelize);
const Product = require('./models/Product')(sequelize, Sequelize);

Product.belongsToMany(Order, {through: OrderProduct, unique: false});
Order.belongsToMany(Product, {through: OrderProduct, unique: false});
Order.belongsTo(User);

sequelize.sync({force: false}).then(() => {
    console.log(`Database & tables created!`)
});
module.exports = {User, Order, Product, OrderProduct, Sequelize};