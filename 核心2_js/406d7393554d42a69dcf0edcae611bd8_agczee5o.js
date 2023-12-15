let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var { data } = request;
    var code = 200;
    var message = "更新成功";
    var flag = -1;
    if (typeof data === "string") {
      data = JSON.parse(data);
      flag = 1;
    } else {
      flag = 0;
      throw new Error(`传入参数类型错误，必须为string类型`);
    }
    let updateArray = [];
    let ncInputParam = [];
    let hids = [];
    let bids = data[0].data.map(function (v) {
      updateArray.push({
        id: v["vbdef9"],
        // 累计出库数量
        cumulativeDeliveryQuantity: v.ntotaloutnum,
        // 累计开票主数量
        cumulativeInvoicedQuantity: v.ntotalinvoicenum,
        // 出库关闭
        isOutboundClosure: v.bboutendflag || "N",
        // 开票关闭
        isInvoicedClosure: v.bbinvoicendflag || "N",
        // 行状态
        isRowClosure: v.bboutendflag == "Y" && v.bbinvoicendflag == "Y" ? "Y" : "N"
      });
      ncInputParam.push({
        vbdef9: v["vbdef9"],
        // 累计出库数量
        ntotaloutnum: v.ntotaloutnum,
        // 累计开票主数量
        ntotalinvoicenum: v.ntotalinvoicenum,
        // 出库关闭
        bboutendflag: v.bboutendflag,
        // 开票关闭
        bbinvoicendflag: v.bbinvoicendflag,
        // 行状态
        frowstatus: v.bboutendflag == "Y" && v.bbinvoicendflag == "Y" ? "Y" : "N"
      });
      hids.push(v["vbdef8"]);
      return v["vbdef9"];
    });
    if (bids.length === 0) {
      throw new Error(`传入订单行数不可为零。`);
    }
    let set = new Set(bids);
    if (set.size !== bids.length) {
      throw new Error(`传入订单行数据存在bid[vbdef9]相同的行。`);
    }
    let yql = `select id,preorder_bFk.id as hid from GT7239AT6.GT7239AT6.preorder_b where id in ('${bids.join("','")}')`;
    var persistObjs = ObjectStore.queryByYonQL(yql);
    if (persistObjs.length !== bids.length) {
      message = "传入的订单行数据与BIP预订单行实际数量不符";
      return {
        code: "500",
        message,
        data: JSON.stringify({ bidFromNC: bids, bidFromBIP: persistObjs.map((v) => v.id) })
      };
    }
    var updateResults = ObjectStore.updateBatch("GT7239AT6.GT7239AT6.preorder_b", updateArray, "ac6f72c1");
    var showNcMsgArray = updateResults.map(function (v) {
      return {
        vbdef9: v.id,
        ntotaloutnum: v.cumulativeDeliveryQuantity,
        ntotalinvoicenum: v.cumulativeInvoicedQuantity,
        bboutendflag: v.isOutboundClosure,
        bbinvoicendflag: v.isInvoicedClosure,
        frowstatus: v.isRowClosure
      };
    });
    return {
      code,
      message: "订单更新成功",
      data: [
        {
          bipOutputParam: showNcMsgArray,
          ncInputParam
        }
      ]
    };
  }
}
exports({ entryPoint: MyAPIHandler });