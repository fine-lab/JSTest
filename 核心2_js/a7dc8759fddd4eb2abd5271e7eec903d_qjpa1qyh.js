let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var bommingchen = request.materialid;
    var token = "";
    let func1 = extrequire("GT46349AT1.backDefaultGroup.gettoken");
    let res = func1.execute(request);
    token = res.access_token;
    let base_path = "https://www.example.com/";
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    let body = {
      product: bommingchen
    };
    //请求数据
    let apiResponse = postman("post", base_path + "?access_token=" + token, JSON.stringify(header), JSON.stringify(body));
    var apiResponsejaon = JSON.parse(apiResponse);
    var queryCode = apiResponsejaon.code;
    if (queryCode !== "200") {
      throw new Error("查询物料错误" + apiResponsejaon.message);
    } else {
      if (apiResponsejaon.data === null) {
        currentqty = 0;
      } else {
        var size = apiResponsejaon.data.length;
        var currentqty = new Big(0);
        for (var i = 0; i < size; i++) {
          currentqty = currentqty.plus(apiResponsejaon.data[i].currentqty);
        }
      }
    }
    return { currentqty: currentqty, request: request, apiResponsejaon: apiResponsejaon };
  }
}
exports({ entryPoint: MyAPIHandler });