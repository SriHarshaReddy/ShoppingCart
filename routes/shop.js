const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shopcontroller')

router.get('/',shopController.getIndex);
router.get('/products',shopController.getShop);
router.get('/products/:productId',shopController.getProduct);
router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart);
router.post('/delete-Prod-Cart', shopController.postDeleteCart);
router.get('/orders', shopController.getOrders);
router.post('/add-order',shopController.postOrder);

module.exports = router;