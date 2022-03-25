import fetch from "node-fetch";
import cheerio from "cheerio";
import fs from "fs";
import {text} from "cheerio/lib/static.js";

let fd;
try{
    fd = fs.openSync('news2.txt', 'a');
    fs.writeFile(fd, '[', (error)=>{
        error && process.exit(1)
    });
}catch {
    process.exit(1)
}

try {
    for( let start = 10001 ; start < 20000; start += 10) {
        const response = await fetch(`https://search.naver.com/search.naver?where=news&sm=tab_pge&query=%EB%89%B4%EC%8A%A4&sort=1&photo=0&field=0&pd=0&ds=&de=&mynews=0&office_type=0&office_section_code=0&news_office_checked=&nso=so:dd,p:all,a:all&start=${start}`);
        const body = await response.text();
        const $ = cheerio.load(body);

        const $search = $(".list_news li");
        $search.each((idx,) => {
            const obj = {
                tit: $search.eq(idx).find('.news_tit').text(),
                dsc: $search.eq(idx).find('.news_dsc').text()
            }
            fs.appendFileSync(fd, JSON.stringify(obj) + ',', 'utf8');
        })

    }
}catch{

}

fs.appendFileSync(fd, ']', (error)=>{
    error && process.exit(1)
});
fs.closeSync(fd);

