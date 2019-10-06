'use strict'
const Excel = require('exceljs');
const DrmHelpers = {
    async readBulkImageFile(filePath){
        const xcellData = []
        return new Promise((resolve, reject)=>{
            try {
                const workbook = new Excel.Workbook();
                workbook.xlsx.readFile(filePath)
                .then(function() {
                    // use workbook
                    const worksheet = workbook.getWorksheet('Images Sheet');
                    worksheet.eachRow({ includeEmpty: false }, function(row, rowNumber) {
                        if(rowNumber > 1){
                            const data = {}
                            // Iterate over all cells in a row (including empty cells)
                            row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
                                try {
                                    const cellValue = cell.text
                                    switch(colNumber){
                                        case 1:
                                            data.key =  cellValue.trim()
                                            break
                                        case 2:
                                            data.value =  cellValue.trim()
                                            break 
                                        default:
                                            break                               
                                    }
                                } catch (error) {
                                    cosnole.log(error)
                                    resolve({status:false,message: error, data:xcellData})
                                }
                                
                            });
                            xcellData.push(data)
                        }
                    });
                    resolve({status:true,message: '', data:xcellData})
                });
            } catch (error) {
                console.log(error)
                reject({status:false,message: error, data:[]})
            }
        })       
    }
}

module.exports = DrmHelpers