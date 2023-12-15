let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let mobile = substring(ObjectStore.user().mobile, 4, 15);
    let data = {
      accbookCode: request.OrgCode, //账簿编码
      voucherTypeCode: "1", //凭证类型编码
      makerMobile: mobile, //制单人手机号
      bodies: []
    };
    if (request.Surplus_Accrual > 0) {
      data.bodies.push({
        description: "计提" + request.periodYear_name + "（年）盈余公积金", //摘要
        accsubjectCode: request.item1387ha, //科目编码
        busidate: request.BusinessDate, //业务日期
        rateType: "01", //汇率类型（01基准类型，02自定义类型）
        rateOrg: 1, //汇率
        debitOriginal: request.Surplus_Accrual, //原币借方金额（借贷不能同时填写，原币本币都要填写）
        debitOrg: request.Surplus_Accrual //本币借方金额（借贷不能同时填写，原币本币都要填写）
      });
      data.bodies.push({
        description: "计提" + request.periodYear_name + "（年）盈余公积金", //摘要
        accsubjectCode: request.item1248kd, //科目编码
        busidate: request.BusinessDate, //业务日期
        rateType: "01", //汇率类型（01基准类型，02自定义类型）
        rateOrg: 1, //汇率
        creditOriginal: request.Surplus_Accrual, //原币借方金额（借贷不能同时填写，原币本币都要填写）
        creditOrg: request.Surplus_Accrual //本币借方金额（借贷不能同时填写，原币本币都要填写）
      });
    }
    request = {};
    request.uri = "/yonbip/fi/ficloud/openapi/voucher/addVoucher";
    request.body = data;
    let func = extrequire("GT34544AT7.common.baseOpenApi");
    let Voucher = func.execute(request).res;
    var object = { id: id, Surplus_voucherID: Voucher.data.voucherId, Surplus_voucherFlag: "1" };
    var res = ObjectStore.updateById("GT104180AT23.GT104180AT23.YearDistribution", object, "d51bd418");
    return { Voucher };
  }
}
exports({ entryPoint: MyAPIHandler });