let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let requestData = JSON.parse(param.requestData);
    let mobile = substring(ObjectStore.user().mobile, 4, 15);
    let data = {
      accbookCode: requestData.OrgCode, //账簿编码
      voucherTypeCode: "3", //凭证类型编码
      makerMobile: mobile, //制单人手机号
      bodies: [
        {
          description: requestData.remarks, //摘要
          accsubjectCode: "99901", //科目编码
          busidate: requestData.BusinessDate, //业务日期
          rateType: "01", //汇率类型（01基准类型，02自定义类型）
          rateOrg: 1, //汇率
          debitOriginal: requestData.RightsStockMoney + requestData.IdentityStockMoney, //原币借方金额（借贷不能同时填写，原币本币都要填写）
          debitOrg: requestData.RightsStockMoney + requestData.IdentityStockMoney //本币借方金额（借贷不能同时填写，原币本币都要填写）
        },
        {
          description: requestData.remarks, //摘要
          accsubjectCode: "3010201", //科目编码
          busidate: requestData.BusinessDate, //业务日期
          rateType: "01", //汇率类型（01基准类型，02自定义类型）
          rateOrg: 1, //汇率
          creditOriginal: requestData.RightsStockMoney, //原币贷方金额（借贷不能同时填写，原币本币都要填写）
          creditOrg: requestData.RightsStockMoney, //本币贷方金额（借贷不能同时填写，原币本币都要填写）
          clientAuxiliaryList: [
            {
              filedCode: "z_CoopMember",
              valueCode: "A510923100000_0001_M000007"
            }
          ]
        }
      ]
    };
    let request = {};
    request.uri = "/yonbip/fi/ficloud/openapi/voucher/addVoucher";
    request.body = data;
    let func = extrequire("GT34544AT7.common.baseOpenApi");
    let Voucher = func.execute(request).res;
    return {};
  }
}
exports({ entryPoint: MyTrigger });