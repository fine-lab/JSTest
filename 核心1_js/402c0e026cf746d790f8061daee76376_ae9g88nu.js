let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let vendorId = request.supplier;
    let vendorCode = request.supplier_code;
    let vendorList = { vendorId, vendorCode };
    //获取供应商档案详情
    let apiResponseSupplier = extrequire("GT22176AT10.publicFunction.getVenderDetail").execute(vendorList);
    let supplierEmpower = JSON.stringify(apiResponseSupplier.merchantInfo);
    return { supplierEmpower };
  }
}
exports({ entryPoint: MyAPIHandler });