'use strict'


const CSV = use('fast-csv')
const Drive = use('Drive')
class CsvController {
    async getCsvData(){
        //var stream = Drive.getStream('../public/temp-files/user-detail.csv')  
      return await CSV
            .fromPath('public/temp-files/user-detail.csv',{headers:true})
            .on("data", function(data){
                console.log(data);
             })
            .on("end", function(){
            // console.log("done");
        });
    }
} 

module.exports = CsvController
