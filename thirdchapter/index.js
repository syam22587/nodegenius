var _ = require("underscore"); 
var skv = require("skv_plugin")


let x = _.contains([1, 2, 3], 1); 
console.log("check if array contains ", x)

console.log("total care : " , skv.calculateSum(230 , 50))