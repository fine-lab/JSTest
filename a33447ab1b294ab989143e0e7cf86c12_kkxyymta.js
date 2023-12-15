let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let customerInfo = {};
    let customerId = request.customerId;
    if (customerId == undefined || customerId == null) {
      return { customerObj: customerInfo };
    }
    let yonql =
      "select id,leaderName,contactTel,fax,scope,businessLicenseNo,personCharge,regAddress,enterpriseNature,creditCode,businessterm from aa.merchant.Merchant where id = '" + request.customerId + "'";
    let res = ObjectStore.queryByYonQL(yonql, "productcenter");
    customerInfo = res[0];
    //查询地址信息
    let selectAddressYonql = "select address from aa.merchant.AddressInfo where merchantId = '" + customerId + "' and isDefault = 1";
    let addressRes = ObjectStore.queryByYonQL(selectAddressYonql, "productcenter");
    if (addressRes.length == 1) {
      customerInfo.address = addressRes[0].address;
    }
    return { customerObj: customerInfo };
  }
}
exports({ entryPoint: MyAPIHandler });