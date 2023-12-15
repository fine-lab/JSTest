let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let codea = request.code;
    let productId = request.productId;
    //出库数量
    let qty = request.qty;
    let header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    let url = "https://www.example.com/";
    let body = {
      pageIndex: 1,
      pageSize: 10,
      isSum: false,
      simpleVOs: [
        {
          field: "code",
          op: "eq",
          value1: codea
        }
      ]
    };
    let apiResponse = openLinker("POST", url, "ST", JSON.stringify(body));
    let apiResponseobj = JSON.parse(apiResponse);
    if (apiResponseobj.code == "200" && apiResponseobj.data.recordList.length > 0) {
      let MastertableId = "";
      let syQty = "";
      let subtabulationId = "";
      let resList = apiResponseobj.data.recordList;
      for (var i = 0; i < resList.length; i++) {
        var proId = resList[i].product;
        if (proId == productId) {
          MastertableId = resList[i].id; //主表ID
          syQty = resList[i].bodyFreeItem.define6; //采购订单剩余可用量
          subtabulationId = resList[i].purchaseOrders_id; //子表ID
        }
      }
      //计算扣减完成的剩余可用量
      let DeductionQtys = syQty - qty;
      var pointnumber = 2;
      var DeductionQty = MoneyFormatReturnBd(DeductionQtys, pointnumber);
      let defineUrl = "https://www.example.com/";
      let body1 = {
        datas: [
          {
            id: MastertableId,
            definesInfo: [
              {
                define6: DeductionQty,
                isHead: false,
                isFree: true,
                detailIds: subtabulationId
              }
            ]
          }
        ]
      };
      let apiResponseMsg = openLinker("POST", defineUrl, "ST", JSON.stringify(body1));
      let responMsg = JSON.parse(apiResponseMsg);
      return { responMsg };
    }
  }
}
exports({ entryPoint: MyAPIHandler });