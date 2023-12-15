let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(productId, free1, vouchdate) {
    let func1 = extrequire("ST.backDefaultGroup.getToken");
    let resToken = func1.execute();
    let token = resToken.access_token;
    //标准物料清单列表查询
    //母件ID
    let getWlBomUrl = "https://www.example.com/" + token;
    let contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": contenttype
    };
    let body = {
      pageIndex: "1",
      pageSize: "10",
      simple: {
        "materialId.productId": [productId]
      }
    };
    let rst = [];
    let wlResponse = postman("POST", getWlBomUrl, JSON.stringify(header), JSON.stringify(body));
    let wlresponseobj = JSON.parse(wlResponse);
    if ("200" == wlresponseobj.code) {
      let data = wlresponseobj.data;
      let result = data.recordList;
      for (var i = 0; i < result.length; i++) {
        var mx = result[i];
        if (free1 != "") {
          if (mx.free1 == free1 && vouchdate >= mx.effectiveDate && vouchdate <= mx.expiryDate) {
            rst.push(mx);
          }
        } else {
          if (vouchdate >= mx.effectiveDate && vouchdate <= mx.expiryDate) {
            rst.push(mx);
          }
        }
      }
    }
    return { rst };
  }
}
exports({ entryPoint: MyAPIHandler });