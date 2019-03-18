const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const bodyParser = require('body-parser');
const cors = require('cors');
const {User, Order, Product, OrderProduct, Sequelize} = require('./sequelize');
const Operations = Sequelize.Op;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/user', function (req, res) {
    User.findAll().then(users => {
        res.send(users);
    });
});

app.get('/user/:id', function (req, res) {
    User.findOne({
        where: {
            id: [req.params.id],
        }
    }).then(user => {
        res.send(user);
    });
});


app.post('/user', function (req, res) {
    let user = req.body;
    let hashed_pass = bcrypt.hashSync(user.password);
    User.create({
        username: user.username,
        password: hashed_pass,
        name: user.name
    }).then(user => {
        res.send(user);
    });
});

app.get('/user/:user_id/orders', function (req, res) {
    Order.findAll({
        where: {
            userId: [req.params.user_id]
        },
        include: [{model: Product}],
        order: [['id', 'DESC']]
    }).then(user => {
        res.send(user);
    });
});

app.post('/user/:user_id/orders', function (req, res) {
    Order.create({
        userId: req.params.user_id,
        open: 1
    }).then(order => {
        res.send(order);
    });
});


app.get('/orders/:order_id', function (req, res) {
    Order.findOne({
        where: {
            id: [req.params.order_id]
        }, include: [{model: Product}]
    }).then(order => {
        res.send(order);
    });
});

app.patch('/orders/:order_id', function (req, res) {
    Order.findOne({
        where: {
            id: [req.params.order_id]
        }
    }).then(order => {
        if (order) {
            order.update(req.body, {fields: ['open']}).then(result => res.send(result));
        } else {
            res.send('{}');
        }
    });
});

app.delete('/orders/:order_id', function (req, res) {
    Order.findOne({
        where: {
            id: [req.params.order_id]
        }
    }).then(order => {
        if (order) {
            order.destroy().then(result => res.send(result));
        } else {
            res.send('{}');
        }
    });
});

app.delete('/orders/:order_id/products/:product_id', function (req, res) {
    let requestBody = req.body;
    Product.findOne({
        where: {
            id: [req.params.product_id]
        }
    }).then(product => {
        if (product) {
            product.update(requestBody, {fields: ['availability']}).then(result => {
                if (result.id) {
                    OrderProduct.findOne({
                        where: {
                            orderId: [req.params.order_id],
                            productId: [req.params.product_id]
                        }
                    }).then(orderProduct => {
                        if (orderProduct) {
                            orderProduct.destroy().then(result => res.send(result));
                        } else {
                            res.send('{}');
                        }
                    });
                } else {
                    res.send('{}');
                }
            });
        } else {
            res.send('{}');
        }
    });
});

app.post('/orders/:order_id/products/:product_id', function (req, res) {
    let requestBody = req.body;
    Product.findOne({
        where: {
            id: [req.params.product_id]
        }
    }).then(product => {
        if (product) {
            product.update(requestBody, {fields: ['availability']}).then(result => {
                if (result.id) {
                    OrderProduct.create({
                        orderId: [req.params.order_id],
                        productId: [req.params.product_id],
                        numItems: requestBody.numItems
                    }).then(orderProduct => {
                        res.send(orderProduct);
                    });
                } else {
                    res.send('{}');
                }
            });
        } else {
            res.send('{}');
        }
    });
});

app.patch('/orders/:order_id/products/:product_id', function (req, res) {
    let requestBody = req.body;
    Product.findOne({
        where: {
            id: [req.params.product_id]
        }
    }).then(product => {
        if (product) {
            product.update(requestBody, {fields: ['availability']}).then(result => {
                if (result.id) {
                    OrderProduct.findOne({
                        where: {
                            orderId: [req.params.order_id],
                            productId: [req.params.product_id]
                        }
                    }).then(orderProduct => {
                        if (orderProduct) {
                            orderProduct.update(requestBody, {fields: ['numItems']}).then(result => res.send(result));
                        } else {
                            res.send('{}');
                        }
                    });
                } else {
                    res.send('{}');
                }
            });
        } else {
            res.send('{}');
        }
    });
});


app.post('/auth', function (req, res) {
    let requestBody = req.body;
    User.findOne({
        where: {
            username: requestBody.username,
        }
    }).then(user => {
        if (user && bcrypt.compareSync(requestBody.password, user.password)) {
            res.send(JSON.stringify(user));
        } else {
            let empty = {};
            res.send(JSON.stringify(empty));
        }
    });
});

app.get('/product/:query', function (req, res) {
    Product.findAll({
        where: {
            name: {
                [Operations.like]: '%' + req.params.query + '%'
            }
        }
    }).then(product => {
        res.send(product);
    });
});

app.post('/product', function (req, res) {
    Product.create(req.body).then(product => {
        res.send(product);
    });
});

const server = app.listen(8081, function () {
    const host = server.address().address;
    const port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port)
});