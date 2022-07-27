const PORT = 8000;
const axios = require('axios');
const cheerio = require('cheerio');
const xlsx = require('xlsx');
const { response } = require('express');
const express = require('express');
const app = express();

let url = "https://www.theguardian.com/uk"


axios(url)
.then(response =>{
    const html = response.data;
    const $ = cheerio.load(html);
    const article = [];

    $('.fc-item__title', html).each(function(){
        const title = $(this).text();
        const urll = $(this).find('a').attr('href');
        article.push({
            title,
            urll,
        });
    })
    const convertJsonToExcel = () => {
        const workSheet = xlsx.utils.json_to_sheet(article);
        const workBook = xlsx.utils.book_new();
    
        xlsx.utils.book_append_sheet(workBook,workSheet,"article"); 
        
        //generate buffer
        xlsx.write(workBook,{bookType:'xlsx',type:"buffer"});
    
        //generate binary
        xlsx.write(workBook,{bookType:"xlsx",type:"binary"});
        xlsx.writeFile(workBook,"web.xlsx")
    }
    
    convertJsonToExcel();
}).catch(err => console.log(err))




app.listen(PORT, () => console.log("server running on PORT " + PORT) )