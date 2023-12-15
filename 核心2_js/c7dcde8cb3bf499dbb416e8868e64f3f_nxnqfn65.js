let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT4691AT1.publicfun.getSystemToken");
    let res = func1.execute(null, null);
    let access_token = res.access_token;
    let orgId = "0001";
    let invArray = request.invArray;
    let resObjArray = [];
    for (var i = 0; i < invArray.length; i++) {
      let productId = invArray[i];
      let url = "https://www.example.com/" + access_token + "&id=" + productId + "&orgId=" + orgId;
      let strResponse = postman("get", url, null, null);
      let responseObj = JSON.parse(strResponse);
      if (responseObj.code === "200") {
        let invDetail = responseObj.data;
        invDetail["invId"] = productId;
        invDetail["msg"] = "0";
        resObjArray.push(invDetail);
      } else {
        let invDetail = { invId: productId, msg: "1" };
        resObjArray.push(invDetail);
      }
      let start = new Date().getTime();
      while (new Date().getTime() - start < 105) {
        continue;
      }
    }
    return { resObjArray: resObjArray };
  }
}
exports({ entryPoint: MyAPIHandler });