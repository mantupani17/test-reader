'use strict';

const fs = require('fs');

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', function(inputStdin) {
    inputString += inputStdin;
});

process.stdin.on('end', function() {
    inputString = inputString.split('\n');

    main();
});

function readLine() {
    return inputString[currentLine++];
}



/*
 * Complete the 'largestMatrix' function below.
 *
 * The function is expected to return an INTEGER.
 * The function accepts 2D_INTEGER_ARRAY arr as parameter.
 */

function largestMatrix(arr) {
    // Write your code here
    let i, j ;
    let max_of_s, max_i, max_j;
    let tempArray = [];
    const arrayLength = arr.length
    const insideArrayLength = arr[0].length;
    for(i=0;i<arrayLength;i++){
        tempArray.push(arr[i]);
    }
    for(i = 0; i<arrayLength;i++){
        tempArray[i][0] = arr[i][0];
    }

    for(j=0;j < insideArrayLength; j++){
        tempArray[0][j] = arr[0][j];
    }
    
    for(i=1;i<arrayLength;i++){
        for(j=1;j<insideArrayLength;j++){
            if(arr[i][j] == 1){
                tempArray[i][j] = Math.min(tempArray[i][j-1] , Math.min( tempArray[i-1][j], tempArray[i-1][j-1])) + 1;
            }else{
                tempArray[i][j] = 0;
            }
        }
    }
    console.log(tempArray)
    max_of_s = tempArray[0][0];max_i = 0, max_j = 0;

    for(i=0;i<arrayLength;i++){
        for(j=0;j<insideArrayLength;j++){
            if(max_of_s < tempArray[i][j]){
                max_of_s = tempArray[i][j];
                max_i = i;
                max_j = j;
            }
        }
    }

    for(i= max_i; i> max_i - max_of_s ;i--){
        for(j= max_j; j > max_j -max_of_s; j--){
            console.log(arr[i][j]+' ')
        }
        console.log('\n');
    }
    

}

function main() {
    
}