let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let productCode = request.productCode; //商品编码
    let destorierNum = request.destorierNum; //销毁数量(页面传过来)
    let warehouse = request.warehouse; //仓库
    let orgId = request.orgId;
    let err_info = {};
    var xhObject = { product_code: productCode, deliver_goods_warehouse: warehouse };
    var xhRes = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.SY01_durgdestoryv2z", xhObject);
    let xhNum = 0; //销毁数量
    for (var i = 0; i < xhRes.length; i++) {
      xhNum += xhRes[i].destorier_num;
    }
    var bsObject = { commodity_code: productCode, warehouse: warehouse };
    var bsRes = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.SY01_pro_sreport_v3", bsObject);
    let bsxhNum = 0; //报损销毁数量
    for (var j = 0; j < bsRes.length; j++) {
      bsxhNum += bsRes[j].xh_number;
    }
    var bhgObject = { product_code: productCode, warehouse: warehouse };
    var bhgRes = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.SY01_unqualifiedson", bhgObject);
    let bhgxhNum = 0; //不合格销毁数量
    let bhgNum = 0; //不合格数量
    for (var k = 0; k < bhgRes.length; k++) {
      bhgNum += bhgRes[k].unqualified_num;
      bhgxhNum += bhgRes[k].drug_destruction_num;
    }
    if (bhgNum >= bhgxhNum + bsxhNum || xhNum >= bhgNum) {
      err_info = { code: "1001", errInfo: "累计销毁数量大于不合格数量,无法销毁" };
      return err_info;
    }
    return { code: "200", errInfo: "sccess" };
  }
}
exports({ entryPoint: MyAPIHandler });