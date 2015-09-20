'use strict';

var btcE = require('btc-e');
var Promise = require('pinkie-promise');
var pify = require('pify');

module.exports = function (params) {

    var btcEApi = new btcE(params.key, params.secret);

    return {
        buy: buy,
        sell: sell,
        getFee: getFee,
        getOpenOrders: getOpenOrders,
        cancelOrder: cancelOrder,
        getPorfolio: getPorfolio,
        getCurrencyName: getCurrencyName,
        getAssetName: getAssetName,
    };

    function buy(amout, price){
        return pify(btcEApi.trade)(getPair(), 'buy', price, amout);
    }

    function sell(amout, price){
        return pify(btcEApi.trade)(getPair(), 'sell', price, amout);
    }

    function getFee(){
        return pify(btcEApi.fee)(getPair());
    }

    function getOpenOrders(){
        return pify(btcEApi.activeOrders)()
        .then(function(orderMap){
            return orderMap.map(function(order, orderId){
                return orderId;
            });
        });
    }

    function cancelOrder(orderId){
        return pify(btcEApi.cancelOrder)(orderId);
    }

    function getPorfolio(){
        return pify(btcEApi.getInfo)()
        .then(function(data){
            return data.funds;
        });
    }

    function getCurrencyName(){
        return params.currencyName;
    }

    function getAssetName(){
        return params.assetName;
    }

    function getPair(){
        return getCurrencyName() + '_' + getAssetName();
    }
};
