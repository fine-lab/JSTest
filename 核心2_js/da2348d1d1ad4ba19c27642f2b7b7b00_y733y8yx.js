let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //审核或者弃审状态
    let state = param.fiCheckColumns.action;
    let requestData = JSON.parse(param.requestData);
    //获取id
    let id = requestData.id;
    //根据ID查询销售出库详情
    let xsckUrl = "https://www.example.com/" + id;
    let apixsckResponse = openLinker("GET", xsckUrl, "ST", null);
    apixsckResponse = JSON.parse(apixsckResponse);
    let data = apixsckResponse.data;
    let detailsList = data.details;
    for (var detailsListIndex in detailsList) {
      let dataItem = detailsList[detailsListIndex];
      let code = dataItem["bodyDefine!define1"]; // 订单编码
      if (code == undefined) {
        //成品不做剩余可用量扣减
        continue;
      }
      let productId = dataItem.product; // 物料id
      let qty = dataItem.qty; // 出库数量
      let res = update(productId, code, qty);
    }
    function update(productId, codea, qty) {
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
        let DeductionQtys = 0;
        //状态为审核，减少剩余可用量，为弃审，增加剩余可用量
        if (state == "unaudit") {
          DeductionQtys = Number(syQty) + Number(qty);
        } else {
          DeductionQtys = Number(syQty) - Number(qty);
        }
        if (DeductionQtys < 0) {
          throw new Error("订单编码为" + codea + "出库失败,剩余可用量不足,请重新选择！", "error");
        }
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
        if (responMsg.code != 200) {
          throw new Error("订单编码为" + codea + "出库失败！", "error");
        }
        return { responMsg };
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });