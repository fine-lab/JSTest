let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let saleOrder = request.saleBody;
    let availableqtyCheck = request.availableqtyCheck;
    let orderDetailsList = saleOrder.orderDetails;
    let orderDetails = [];
    let definesInfo = [];
    if (orderDetailsList != null && orderDetailsList.length > 0) {
      for (var i = 0; i < orderDetailsList.length; i++) {
        let orderDetail = orderDetailsList[i];
        let checkResult = undefined;
        for (let j = 0; j < availableqtyCheck.length; j++) {
          let availableqty = availableqtyCheck[j];
          if (availableqty.orderDetailId + "" == orderDetail.id + "") {
            checkResult = availableqty.result;
          }
        }
        let definesbody = {
          define2: checkResult,
          isHead: false,
          isFree: true,
          detailIds: orderDetail.id + ""
        };
        definesInfo.push(definesbody);
      }
    }
    let totcheckResult = "true";
    for (let k = 0; k < availableqtyCheck.length; k++) {
      let availableqty = availableqtyCheck[k];
      if (availableqty.result == false) {
        totcheckResult = "false";
      }
    }
    let defineshead = {
      define2: totcheckResult,
      isHead: true,
      isFree: true,
      detailIds: ""
    };
    definesInfo.push(defineshead);
    let body = {
      billnum: "voucher_order",
      datas: [
        {
          id: saleOrder.id + "",
          code: saleOrder.code,
          definesInfo: definesInfo
        }
      ]
    };
    let func1 = extrequire("GT80266AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(null);
    var token = res.access_token;
    var contenttype = "application/json;charset=UTF-8";
    var header = {
      "Content-Type": contenttype
    };
    let getsdUrl = "https://www.example.com/" + token;
    var apiResponse = postman("POST", getsdUrl, JSON.stringify(header), JSON.stringify(body));
    let apiResponseJson = JSON.parse(apiResponse);
    return { apiResponseJson };
    let result = {
      code: apiResponseJson.code,
      message: saleOrder.code + "_" + apiResponseJson.message
    };
    let func_2 = extrequire("SCMSA.backDefaultGroup.BatchauditSale");
    if (totcheckResult == "true") {
      let ids = {
        ids: {
          data: [
            {
              id: saleOrder.id + ""
            }
          ]
        },
        code: saleOrder.code
      };
      result = func_2.execute(ids);
    }
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });