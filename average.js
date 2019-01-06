const request =require('request')
const gauss =require('gauss')

const asyncFunc =() =>{
    return new Promise((resolve)=>{
    request('https://api.cryptowat.ch/markets/bitflyer/btcjpy/ohlc?periods=86400&after=1483196400',
        (err,Response,body)=>{
            resolve(JSON.parse(body))
        })
    })
}

async function main(){
    const json = await asyncFunc()
    let list = json.result['86400']
    list = list.splice(list.length - 25, list.length)
    const closePriceList =list.map(entry => entry[4])
    console.log('output',closePriceList)
    const prices = new gauss.Vector(closePriceList)
    console.log(prices.sma(25))
}

main()