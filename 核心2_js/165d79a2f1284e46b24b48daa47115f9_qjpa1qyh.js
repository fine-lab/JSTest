let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var materids = request.materialid;
    var productApplyRangeId = request.productApplyRangeId;
    var token = "";
    let func1 = extrequire("GT46349AT1.backDefaultGroup.gettoken");
    let res = func1.execute(request);
    token = res.access_token;
    var materialdatas = new Array();
    let base_path = "https://www.example.com/";
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    let bodymater = {
      data: {
        id: materids
      }
    };
    let strResponse = postman("post", base_path + "?access_token=" + token, JSON.stringify(header), JSON.stringify(bodymater));
    var responseObj = JSON.parse(strResponse);
    if ("200" == responseObj.code) {
      var deptDetail = responseObj.data;
      var recordList = deptDetail.recordList;
      for (var i = 0; i < recordList.length; i++) {
        var materialnew = recordList[i].id;
        var fMarkPrice = recordList[i].detail.fMarkPrice;
        var defaultSKUId = recordList[i].defaultSKUId;
        var fNoTaxCostPrice = recordList[i].detail.fNoTaxCostPrice;
        var materialdata = {
          materialnew: materialnew,
          fMarkPrice: fMarkPrice,
          defaultSKUId: defaultSKUId,
          fNoTaxCostPrice: fNoTaxCostPrice
        };
        materialdatas.push(materialdata);
      }
    } else {
      throw new Error("错误" + responseObj.message);
    }
    return { materialdatas: materialdatas };
  }
}
exports({ entryPoint: MyAPIHandler });