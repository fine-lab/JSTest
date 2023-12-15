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
    if (request.RightsStockMoney > 0) {
      data.bodies.push({
        description: request.enddate + request.coopMember_name + "退股金", //摘要
        accsubjectCode: request.item171oc, //科目编码
        busidate: request.BusinessDate, //业务日期
        rateType: "01", //汇率类型（01基准类型，02自定义类型）
        rateOrg: 1, //汇率
        debitOriginal: request.RightsStockMoney, //原币借方金额（借贷不能同时填写，原币本币都要填写）
        debitOrg: request.RightsStockMoney, //本币借方金额（借贷不能同时填写，原币本币都要填写）
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
        description: request.enddate + request.coopMember_name + "退股金", //摘要
        accsubjectCode: request.item183ah, //科目编码
        busidate: request.BusinessDate, //业务日期
        rateType: "01", //汇率类型（01基准类型，02自定义类型）
        rateOrg: 1, //汇率
        debitOriginal: request.IdentityStockMoney,
        debitOrg: request.IdentityStockMoney,
        clientAuxiliaryList: [
          {
            filedCode: "z_CoopMember",
            valueCode: request.MemberCode
          }
        ]
      });
    }
    if (request.RightsReserveMoney > 0) {
      data.bodies.push({
        description: request.enddate + request.coopMember_name + "退盈余公积", //摘要
        accsubjectCode: request.item210tc, //科目编码
        busidate: request.BusinessDate, //业务日期
        rateType: "01", //汇率类型（01基准类型，02自定义类型）
        rateOrg: 1, //汇率
        debitOriginal: request.RightsReserveMoney,
        debitOrg: request.RightsReserveMoney
      });
    }
    if (request.RightsFundMoney > 0) {
      data.bodies.push({
        description: request.enddate + request.coopMember_name + "退资本公积", //摘要
        accsubjectCode: request.item262sk, //科目编码
        busidate: request.BusinessDate, //业务日期
        rateType: "01", //汇率类型（01基准类型，02自定义类型）
        rateOrg: 1, //汇率
        debitOriginal: request.RightsFundMoney,
        debitOrg: request.RightsFundMoney
      });
    }
    if (request.ReturnMoney > 0) {
      data.bodies.push({
        description: request.enddate + request.coopMember_name + "退股金", //摘要
        accsubjectCode: request.item464ic, //科目编码
        busidate: request.BusinessDate, //业务日期
        rateType: "01", //汇率类型（01基准类型，02自定义类型）
        rateOrg: 1, //汇率
        creditOriginal: request.ReturnMoney, //原币贷方金额（借贷不能同时填写，原币本币都要填写）
        creditOrg: request.ReturnMoney //本币贷方金额（借贷不能同时填写，原币本币都要填写）
      });
    }
    if (request.DiffMoney > 0) {
      data.bodies.push({
        description: request.enddate + request.coopMember_name + "退股金差额", //摘要
        accsubjectCode: request.item299tk, //科目编码
        busidate: request.BusinessDate, //业务日期
        rateType: "01", //汇率类型（01基准类型，02自定义类型）
        rateOrg: 1, //汇率
        creditOriginal: request.DiffMoney, //原币贷方金额（借贷不能同时填写，原币本币都要填写）
        creditOrg: request.DiffMoney //本币贷方金额（借贷不能同时填写，原币本币都要填写）
      });
    }
    request = {};
    request.uri = "/yonbip/fi/ficloud/openapi/voucher/addVoucher";
    request.body = data;
    let func = extrequire("GT34544AT7.common.baseOpenApi");
    let Voucher = func.execute(request).res;
    var object = { id: id, voucherID: Voucher.data.voucherId, voucherFlag: "1", voucherCode: Voucher.data.billCode };
    var res = ObjectStore.updateById("GT104180AT23.GT104180AT23.ReturnStock", object, "8edcf725");
    return { Voucher };
  }
}
exports({ entryPoint: MyAPIHandler });