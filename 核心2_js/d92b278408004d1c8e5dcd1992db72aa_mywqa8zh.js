let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //快递单号
    let number = "772017799346845"; //测试单号
    //物流信息
    var content1 = {
      order: "asc", //排序方式
      waybillNoList: [
        number //快递单号
      ]
    };
    //物流信息
    var content = JSON.stringify(content1);
    //签名
    let header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    let body = {
      data: content + "vd6nwAYIBzkBEKXMnpNKVeZ5r2RufuJY"
    };
    let url1 = "http://123.57.144.10:9995/allt/md5AndBase64Enc";
    let md5Response = postman("POST", url1, JSON.stringify(header), JSON.stringify(body));
    var sign1 = JSON.parse(md5Response);
    //签名构造
    let dataDigest = UrlEncode(sign1.msg);
    let header1 = {
      //请求格式
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    };
    //请求参数
    var from_code = "CAKhtDJGLiEljRA";
    var to_code = "sto_trace_query";
    var to_appkey = "yourkeyHere";
    var from_appkey = "yourkeyHere";
    var api_name = "STO_TRACE_QUERY_COMMON";
    //请求地址
    let url =
      "https://www.example.com/" +
      from_code +
      "&to_code=" +
      to_code +
      "&to_appkey=" +
      to_appkey +
      "&from_appkey=" +
      from_appkey +
      "&api_name=" +
      api_name +
      "&data_digest=" +
      dataDigest +
      "&content=" +
      content;
    let apiResponses = postman("POST", url, JSON.stringify(header1), JSON.stringify(null));
    var apiResponsesRes = JSON.parse(apiResponses);
    var dataRes = apiResponsesRes.data;
    var ss = Number(number);
    var tt = dataRes[ss];
    var result = "";
    for (var i = 0; i <= tt.length - 1; i++) {
      let str = "  " + tt[i].opTime.substr(0, 10) + "  【" + tt[i].opOrgProvinceName + "】 【" + tt[i].opOrgCityName + "】 " + tt[i].memo + ";  \n";
      result = result + str;
    }
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });