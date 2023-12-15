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
    if (request.IdentityStockMoney > 0) {
      data.bodies.push({
        description: request.BusinessDate + request.memberAcc_AccName + "缴纳股金", //摘要
        accsubjectCode: request.item408rf, //科目编码
        busidate: request.BusinessDate, //业务日期
        rateType: "01", //汇率类型（01基准类型，02自定义类型）
        rateOrg: 1, //汇率
        debitOriginal: request.RightsStockMoney + request.IdentityStockMoney, //原币借方金额（借贷不能同时填写，原币本币都要填写）
        debitOrg: request.RightsStockMoney + request.IdentityStockMoney //本币借方金额（借贷不能同时填写，原币本币都要填写）
      });
    }
    if (request.RightsStockMoney > 0) {
      data.bodies.push({
        description: request.BusinessDate + request.memberAcc_AccName + "缴纳股金", //摘要
        accsubjectCode: request.item342gd, //科目编码
        busidate: request.BusinessDate, //业务日期
        rateType: "01", //汇率类型（01基准类型，02自定义类型）
        rateOrg: 1, //汇率
        creditOriginal: request.RightsStockMoney, //原币贷方金额（借贷不能同时填写，原币本币都要填写）
        creditOrg: request.RightsStockMoney, //本币贷方金额（借贷不能同时填写，原币本币都要填写）
        clientAuxiliaryList: [
          {
            filedCode: "z_CoopMember",
            valueCode: request.MemberCode
          }
        ]
      });
    }
    if (request.IdentityStockMoney > 0) {
      data.bodies.push({
        description: request.BusinessDate + request.memberAcc_AccName + "缴纳股金", //摘要
        accsubjectCode: request.item373yb, //科目编码
        busidate: request.BusinessDate, //业务日期
        rateType: "01", //汇率类型（01基准类型，02自定义类型）
        rateOrg: 1, //汇率
        creditOriginal: request.IdentityStockMoney, //原币贷方金额（借贷不能同时填写，原币本币都要填写）
        creditOrg: request.IdentityStockMoney, //本币贷方金额（借贷不能同时填写，原币本币都要填写）
        clientAuxiliaryList: [
          {
            filedCode: "z_CoopMember",
            valueCode: request.MemberCode
          }
        ]
      });
    }
    request = {};
    request.uri = "/yonbip/fi/ficloud/openapi/voucher/addVoucher";
    request.body = data;
    let func = extrequire("GT34544AT7.common.baseOpenApi");
    let Voucher = func.execute(request).res;
    var object = { id: id, voucherID: Voucher.data.voucherId, voucherFlag: "1", voucherCode: Voucher.data.billCode };
    var res = ObjectStore.updateById("GT104180AT23.GT104180AT23.JoinStock", object, "8aecfac1");
    return { Voucher };
  }
}
exports({ entryPoint: MyAPIHandler });