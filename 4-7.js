'use strict';
const ccxt = require ('ccxt');


const interval =3000
const orderSize =0.1
const ProfitPrice =500
const records =[]

let orderInfo =null

const sleep =(timer) => {
    return new Promise((resolve,reject) =>{
    setTimeout(()=>{
        resolve()
    },timer)
    })
}


(async function () {
    const cinfig =require('./config')
    let bitflyer = new ccxt.bitflyer(config)

    while(true){
     try{
        const ticker =await bitflyer.fetchTicker('FX_BTC_JPY')
     
    records.push(ticker.ask)
    if(records.length >4){
        records.shift()
    }
    console.log(records)

    if(orderInfo){
        console.log('latest bid price:' + ticker.bid)
        console.log('order price:' + orderInfo.price)
        console.log('diff:' + ticker.bid - orderInfo.price)

        if(ticker.bid - orderInfo.price >500){  
        const order = await bitflyer.createMarketBuyOrder('FX_BTC_JPY',orderSize)
        orderInfo =null
         console.log("ロスカット",order)
        
        }else if ( ticker.bid - orderInfo.price < -100){
        
        const order = await bitflyer.createMarketBuyOrder('FX_BTC_JPY',orderSize)
        orderInfo =null
        console.log("利確",order)
    }

    }else{
    if(records[0] <records[1]&& records[1]<records[2] && records[2]<records[3]){
    console.log('Price high')
     const order = await bitflyer.createMarketSellOrder('FX_BTC_JPY',orderSize)
    orderInfo ={
        order: order,
        price: ticker.ask
         }
    console.log("注文なう",orderInfo)
    } 
}
    await sleep(interval)
}
catch(err){
         await sleep(interval)
         return 
     }
}

}) ();