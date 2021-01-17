const express = require('express');
const axios = require('axios');
const { response } = require('express');
const url = require('url');

const app = express();


const APIURL = 'https://api.exchangeratesapi.io/latest';
let today = new Date().toISOString().slice(0, 10);


app.get('/api/rates', (req, res) => {
    let result = {};
    let currencies = req.query.currency && req.query.currency.split(',');
    let base = req.query.base;
    var urlobj = url.parse(req.originalUrl);
    const ratesResult = {};
    let errorResult = {};
    
    axios.get(APIURL+urlobj.search)
        .then(function(response) {
            result = response.data;
            if(result.rates && currencies.length > 0) {
                for (let index = 0; index < currencies.length; index++) {
                    const element = currencies[index];
                    for (const key in result.rates) {
                        if(key == element) {  
                            ratesResult[element] = result.rates[key];
                        }
                    }
                   
                }
            }
         })
         .catch(err => {
             errorResult = err;
             console.log(err)
            //  console.log(err.response.status)
            //  console.log(err.response.statusText)
            //  console.log(err.response.data)
         })
          
         setTimeout(() => {
             const item = {
                results: {
                    base: req.query.base,
                    date: result.date, 
                    rates: ratesResult 
                }
            }  
             
            //  console.log(ratesResult)
            //  console.log(errorResult)

             if(Object.keys(errorResult).length > 0){
                 res.json({ error: ` Status: ${errorResult.response.status}', Base '${base}' is not supported`}); 
             } else {
                 res.json(item) 
             }
         }, 10000);
})


app.listen(3400);
