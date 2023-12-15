let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let YearDistributionDetailedList = request.YearDistributionDetailedList;
    let id = request.id;
    let mobile = substring(ObjectStore.user().mobile, 4, 15);
    let data = {
      accbookCode: request.OrgCode, //账簿编码
      voucherTypeCode: "1", //凭证类型编码
      makerMobile: mobile, //制单人手机号
      bodies: []
    };
    if (request.Surplus_Return > 0) {
      data.bodies.push({
        description: "计提" + request.periodYear_name + "（年）盈余返还", //摘要
        accsubjectCode: request.item5097hi, //科目编码
        busidate: request.BusinessDate, //业务日期
        rateType: "01", //汇率类型（01基准类型，02自定义类型）
        rateOrg: 1, //汇率
        debitOriginal: request.Surplus_Return, //原币借方金额（借贷不能同时填写，原币本币都要填写）
        debitOrg: request.Surplus_Return //本币借方金额（借贷不能同时填写，原币本币都要填写）
      });
    }
    if (request.Surplus_Return > 0) {
      data.bodies.push({
        description: "计提" + request.periodYear_name + "（年）盈余返还", //摘要
        accsubjectCode: request.item5391zh, //科目编码
        busidate: request.BusinessDate, //业务日期
        rateType: "01", //汇率类型（01基准类型，02自定义类型）
        rateOrg: 1, //汇率
        creditOriginal: request.Surplus_Return, //原币贷方金额（借贷不能同时填写，原币本币都要填写）
        creditOrg: request.Surplus_Return //本币贷方金额（借贷不能同时填写，原币本币都要填写）
      });
    }
    if (request.Surplus_Return > 0) {
      data.bodies.push({
        description: "应付" + request.periodYear_name + "（年）盈余返还", //摘要
        accsubjectCode: request.item5391zh, //科目编码
        busidate: request.BusinessDate, //业务日期
        rateType: "01", //汇率类型（01基准类型，02自定义类型）
        rateOrg: 1, //汇率
        debitOriginal: request.Surplus_Return, //原币借方金额（借贷不能同时填写，原币本币都要填写）
        debitOrg: request.Surplus_Return //本币借方金额（借贷不能同时填写，原币本币都要填写）
      });
    }
    //每一条子表都要加入到凭证
    for (let i = 0; i < YearDistributionDetailedList.length; i++) {
      if (YearDistributionDetailedList[i].Surplus_Return > 0) {
        data.bodies.push({
          description: "应付" + request.periodYear_name + "（年）盈余返还", //摘要
          accsubjectCode: request.item5830dh, //科目编码
          busidate: request.BusinessDate, //业务日期
          rateType: "01", //汇率类型（01基准类型，02自定义类型）
          rateOrg: 1, //汇率
          creditOriginal: YearDistributionDetailedList[i].Surplus_Return, //原币贷方金额（借贷不能同时填写，原币本币都要填写）
          creditOrg: YearDistributionDetailedList[i].Surplus_Return, //本币贷方金额（借贷不能同时填写，原币本币都要填写）
          clientAuxiliaryList: [
            {
              filedCode: "z_CoopMember",
              valueCode: YearDistributionDetailedList[i].AccCode
            }
          ]
        });
      }
    }
    //第二张凭证的参数
    let data2 = {
      accbookCode: request.OrgCode, //账簿编码
      voucherTypeCode: "1", //凭证类型编码
      makerMobile: mobile, //制单人手机号
      bodies: []
    };
    if (request.item6267lk > 0) {
      data2.bodies.push({
        description: "计提" + request.periodYear_name + "（年）剩余盈余返还", //摘要
        accsubjectCode: request.item5097hi, //科目编码
        busidate: request.BusinessDate, //业务日期
        rateType: "01", //汇率类型（01基准类型，02自定义类型）
        rateOrg: 1, //汇率
        debitOriginal: request.item6267lk, //原币借方金额（借贷不能同时填写，原币本币都要填写）
        debitOrg: request.item6267lk //本币借方金额（借贷不能同时填写，原币本币都要填写）
      });
    }
    if (request.item6267lk > 0) {
      data2.bodies.push({
        description: "计提" + request.periodYear_name + "（年）剩余盈余返还", //摘要
        accsubjectCode: request.item5538of, //科目编码
        busidate: request.BusinessDate, //业务日期
        rateType: "01", //汇率类型（01基准类型，02自定义类型）
        rateOrg: 1, //汇率
        creditOriginal: request.item6267lk, //原币贷方金额（借贷不能同时填写，原币本币都要填写）
        creditOrg: request.item6267lk //本币贷方金额（借贷不能同时填写，原币本币都要填写）
      });
    }
    if (request.item6267lk > 0) {
      data2.bodies.push({
        description: "应付" + request.periodYear_name + "（年）剩余盈余返还", //摘要
        accsubjectCode: request.item5538of, //科目编码
        busidate: request.BusinessDate, //业务日期
        rateType: "01", //汇率类型（01基准类型，02自定义类型）
        rateOrg: 1, //汇率
        debitOriginal: request.item6267lk, //原币借方金额（借贷不能同时填写，原币本币都要填写）
        debitOrg: request.item6267lk //本币借方金额（借贷不能同时填写，原币本币都要填写）
      });
    }
    //每一条子表都要加入到凭证
    for (let i = 0; i < YearDistributionDetailedList.length; i++) {
      if (YearDistributionDetailedList[i].Surplus_Remainder > 0) {
        data2.bodies.push({
          description: "应付" + request.periodYear_name + "（年）剩余盈余返还", //摘要
          accsubjectCode: request.item6122wb, //科目编码
          busidate: request.BusinessDate, //业务日期
          rateType: "01", //汇率类型（01基准类型，02自定义类型）
          rateOrg: 1, //汇率
          creditOriginal: YearDistributionDetailedList[i].Surplus_Remainder, //原币贷方金额（借贷不能同时填写，原币本币都要填写）
          creditOrg: YearDistributionDetailedList[i].Surplus_Remainder, //本币贷方金额（借贷不能同时填写，原币本币都要填写）
          clientAuxiliaryList: [
            {
              filedCode: "z_CoopMember",
              valueCode: YearDistributionDetailedList[i].AccCode
            }
          ]
        });
      }
    }
    request = {};
    request.uri = "/yonbip/fi/ficloud/openapi/voucher/addVoucher";
    request.body = data;
    let func = extrequire("GT34544AT7.common.baseOpenApi");
    let Voucher = func.execute(request).res;
    //回写-盈余返还-凭证ID
    var object = { id: id, Surplus_Return_voucherID: Voucher.data.voucherId, Surplus_Return_voucherFlag: "1" };
    var res = ObjectStore.updateById("GT104180AT23.GT104180AT23.YearDistribution", object, "1438b17e");
    request = {};
    request.uri = "/yonbip/fi/ficloud/openapi/voucher/addVoucher";
    request.body = data2;
    func = extrequire("GT34544AT7.common.baseOpenApi");
    Voucher = func.execute(request).res;
    //回写-盈余返还-凭证ID
    object = { id: id, Surplus_Remainder_voucherID: Voucher.data.voucherId, Surplus_Remainder_voucherFlag: "1" };
    res = ObjectStore.updateById("GT104180AT23.GT104180AT23.YearDistribution", object, "1438b17e");
    return { Voucher };
  }
}
exports({ entryPoint: MyAPIHandler });