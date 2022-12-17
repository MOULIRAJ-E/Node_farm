const fs= require('fs');
const http =require('http');
const url = require('url');
const slugify = require ('slugify');
const replaceTemplate = require('./modules/replaceTemplate');


// blocking
// const textIn=fs.readFileSync('./final/txt/input.txt','utf-8');
// console.log(textIn);

// const textOut = `This is what we know about avacardo ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./final/txt/output.txt', textOut);
// console.log('file written');

//non-blocking
// fs.readFile('./final/txt/start.txt','utf-8',(err,data1)=>{
//     fs.readFile(`./final/txt/${data1}.txt`,'utf-8',(err,data2) =>{
//         console.log(data2);
//         fs.readFile('./final/txt/append.txt','utf-8',(err,data3) =>{
//             console.log(data3 );
//             fs.writeFile('./final/txt/final.txt',`${data2}\n${data3}`,'utf-8',err =>{
//                 console.log('your file has been written.');
//             })
//         });
//     });    
// });

////////////////////////////////////////////////////
// SERVER


const tempOverview = fs.readFileSync(
    `${__dirname}/templates/template-overview.html`,
    'utf-8'
  );
  const tempCard = fs.readFileSync(
    `${__dirname}/templates/template-card.html`,
    'utf-8'
  );
  const tempProduct = fs.readFileSync(
    `${__dirname}/templates/template-product.html`,
    'utf-8'
  );
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataobj= JSON.parse(data);

const slugs =dataobj.map(el => slugify(el.productName,{lower:true}));
console.log(slugs);

const server=http.createServer((req,res)=>{
    const {query,pathname} = (url.parse(req.url,true))

    if(pathname==='/' || pathname ==='/overview'){
        res.writeHead(200, {'content-type': "text/html"});
        const cardsHtml =dataobj.map(el => replaceTemplate(tempCard,el)).join('');
        const output =tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml);
        res.end(output);

    }else if(pathname === '/product'){
        res.writeHead(200, {'content-type': 'text/html'});
        const product =dataobj[query.id];
        const output =replaceTemplate(tempProduct,product)
        res.end(output); 

    }else if (pathname=== '/api'){
      
        res.writeHead(200 ,{'content-type' :'application/json',});
        res.end(data);
    }else{
        res.writeHead(404,{
            'content-type' :'text/html',
             'my-own-header': 'hello-world'
        });
        res.end('<h1> page not found!</h1>');
    }

});

server.listen(8000);
console.log("listening to server");


  