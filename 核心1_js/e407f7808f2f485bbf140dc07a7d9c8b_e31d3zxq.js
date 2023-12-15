let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let supplierInfo = {};
    let supplierId = request.supplierId;
    let yonql = "select supplyType,address,legalBody,contactphone,vendorfax,creditcode from aa.vendor.Vendor where id = '" + supplierId + "'";
    let res = ObjectStore.queryByYonQL(yonql, "yssupplier");
    supplierInfo = res[0];
    //查询地址信息
    let selectAddressYonql = "select detailAddress from aa.vendor.VendorAddress where vendor = '" + supplierId + "' and isDefault = 1";
    let addressRes = ObjectStore.queryByYonQL(selectAddressYonql, "yssupplier");
    if (addressRes.length == 1) {
      supplierInfo.detailAddress = addressRes[0].detailAddress;
    }
    return { supplierObj: supplierInfo };
  }
}
exports({ entryPoint: MyAPIHandler });