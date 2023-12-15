let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    let vouchdate = [year, month, day].join("-");
    vouchdate = vouchdate.substring(0, 10);
    let productId = request.productId;
    let productName = request.productName;
    let supplierId = request.supplierId;
    let orgId = request.orgId;
    let gsp_spfl = request.materialType;
    let jx = request.dosageForm;
    let rowno = request.rowNO;
    let purchaseorgid = request.purchaseorgid;
    let operator = request.operator;
    let productsku = request.productsku;
    let productskuName = request.productskuName;
    let productCode = request.productCode;
    let productskuCode = request.productskuCode;
    let OrderType = request.OrderType;
    //认为没有启用SKU
    if (productCode != undefined && productskuCode != undefined && productCode == productskuCode) {
      productsku = null;
    }
    let rownoinfo = "第" + rowno + "行:";
    let parameterRequest = { saleorgid: orgId };
    let gspParametersFun = extrequire("GT22176AT10.publicFunction.getGspParameters");
    let orgParameter = gspParametersFun.execute(parameterRequest);
    if (orgParameter.gspParameterArray.length == 0) {
      return { res: true };
    }
    let noGspFlowCtrl = orgParameter.gspParameterArray[0].noGspFlowCtrl;
    if (noGspFlowCtrl != "1") {
      return { res: true };
    }
    let sql = "select material from GT22176AT10.GT22176AT10.SY01_material_file where org_id  = " + orgId + " and material = " + productId;
    let prodInfos = ObjectStore.queryByYonQL(sql, "sy01");
    if (prodInfos != null || prodInfos.length > 0) {
      throw new Error(rownoinfo + "名称:【" + productName + "】的物料,是GSP物料不能在非GSP业务中存在!\n\r");
    }
    return { res: true };
  }
}
exports({ entryPoint: MyAPIHandler });