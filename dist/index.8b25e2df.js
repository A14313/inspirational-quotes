(async()=>{try{const t="https://type.fit/api/quotes",e=await fetch(t);return await e.json()}catch(t){console.log(t)}})().then((t=>new Promise(((e,o)=>{if(t){let o=Math.floor(Math.random()*t.length);const n=t[o].author;e({quote:t[o].text,author:n,number:o,quotesCount:t.length})}else o("Cannot fetch data")})))).then((t=>{const e=document.querySelector("#quote"),o=document.querySelector("#author"),n=document.querySelector("#quoteID"),u=document.querySelector("#quoteCount");e.textContent=t.quote,o.textContent=t.author,n.textContent=t.number,u.textContent=t.quotesCount}));
//# sourceMappingURL=index.8b25e2df.js.map
