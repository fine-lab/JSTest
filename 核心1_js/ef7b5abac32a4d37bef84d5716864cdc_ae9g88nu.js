let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var billObj = {
      id: param.data[0].id
    };
    //实体查询
    var billInfo = ObjectStore.selectById("GT22176AT10.GT22176AT10.SY01_supplierStatus", billObj);
    //查询待更新的医药供应商证照档案
    let supplierInfo = {};
    let orgId = billInfo.org_id;
    let supplierId = billInfo.supplier;
    supplierInfo = extrequire("GT22176AT10.publicFunction.getSupLicInfo").execute({ orgId, supplierId }).supLicInfo;
    let updateJson = {
      id: supplierInfo.id,
      purState: billInfo.xincaigouzhuangtai
    };
    var res = ObjectStore.updateById("GT22176AT10.GT22176AT10.SY01_supplier_file", updateJson, "8a842e1f");
    return {};
  }
}
exports({
  entryPoint: MyTrigger
});