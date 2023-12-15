let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //信息头
    let header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    //信息体
    let body = {};
    var responseObj = postman("get", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    function sliceIntoChunks(arr, chunkSize) {
      const res = [];
      for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
      }
      return res;
    }
    var res = JSON.parse(responseObj);
    var object = res.CIQ_ORIGIN_PLACE;
    var datas = sliceIntoChunks(object, 100);
    debugger;
    for (var i = 0; i < datas.length; i++) {
      for (var j = 0; j < datas[i].length; j++) {
        datas[i][j]["customs_archives_type"] = "1691835258144555011";
      }
      debugger;
      var res = ObjectStore.insertBatch("AT172DC53E1D280006.AT172DC53E1D280006.customs_archives1", datas[i], "customs_archives1");
    }
    return { datas };
  }
}
exports({ entryPoint: MyAPIHandler });