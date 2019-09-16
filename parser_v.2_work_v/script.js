var tress = require('tress');
var needle = require('needle');
var cheerio = require('cheerio');
var resolve = require('url').resolve;
var fs = require('fs');


const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvWriter = createCsvWriter({
  path: 'data.csv',
  header: [
    {id: 'line_number', title: 'line_number'},
    {id: 'country', title: 'country'},
    {id: 'site', title: 'site'},
    {id: 'phone', title: 'phone'},
    {id: 'company_name', title: 'company_name'},
    {id: 'adress', title: 'adress'},
    {id: 'director', title: 'director'},
    {id: 'import_area', title: 'import_area'},
    {id: 'export_area', title: 'export_area'},
    {id: 'kompass_link', title: 'kompass_link'}
  ]
});

var URL = 'https://ua.kompass.com/en/c/brichet-prim-srl/md008896/';
var results = [];
var line_number = 1;
var output_arr = [];




function delBr (s) {return s.replace (/\s{2,}/g, ' ')};


var q = tress(function(url, callback){
    needle.get(url, function(err, res){
        if (err) {
        	fs.writeFileSync('./data.json', JSON.stringify(results, null, 4));
        	throw err;
        } else {

        // парсим DOM
        var $ = cheerio.load(res.body);


            var phone = $(".contactButton a input").attr("value");
            if(phone == undefined) {
                phone = "no_data"
            };
            delBr(phone);
    
            // results.push({

            //     country: delBr($("span[itemprop='addressCountry']").text().trim()),
            //     site: delBr($("a#webSite_presentation_0").text().trim()),
            //     phone: phone,
            //     company_name: delBr($("h1").text().trim()),
            //     adress: delBr($("p:nth-of-type(1) span.spRight").text().trim()),
            //     director: delBr($('div.executiveBlockTop').text().trim()),
            //     import_area: delBr($("div#importZones").text().trim()),
            //     export_area: delBr($("div#exportZones").text().trim()),

            // });

            output_arr.push({
                'line_number': line_number,
                country: delBr($("span[itemprop='addressCountry']").text().trim()),
                site: delBr($("a#webSite_presentation_0").text().trim()),
                phone: phone,
                company_name: delBr($("h1").text().trim()),
                adress: delBr($("p:nth-of-type(1) span.spRight").text().trim()),
                director: delBr($('div.executiveBlockTop').text().trim()),
                import_area: delBr($("div#importZones").text().trim()),
                export_area: delBr($("div#exportZones").text().trim()),
                kompass_link: url
             })

             line_number++;
       

        //список новостей
        // $('.b_rewiev p>a').each(function() {
        //     q.push($(this).attr('href'));
        // });

        //паджинатор
        // $('.bpr_next>a').each(function() {
        //     // не забываем привести относительный адрес ссылки к абсолютному
        //     q.push(resolve(URL, $(this).attr('href')));
        // });

        callback(console.log(line_number + 'done'));

    	}
    });
}, 10); // запускаем 10 параллельных потоков

q.drain = function(){
    // fs.writeFileSync('./data.json', JSON.stringify(results, null, 4));
    csvWriter
      .writeRecords(output_arr)
      .then(()=> console.log('The CSV file was written successfully'));

        
}



var fs = require('fs');
var file_input_array = fs.readFileSync('book1.txt').toString().split("\n");
for(i in file_input_array) {
    file_input_array[i] = 'https://ua.kompass.com' + file_input_array[i];
    q.push(file_input_array[i]);
};
