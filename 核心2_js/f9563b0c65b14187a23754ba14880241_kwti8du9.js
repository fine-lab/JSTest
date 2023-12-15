let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let URL = extrequire("GT101792AT1.common.PublicURL");
    let URLData = URL.execute(null, null);
    // 封装数据
    let recordList = request.recordList;
    let gap = request.gap;
    let warehouse = request.warehouse;
    // 采购入库单子表信息
    let purInRecords = {
      rowno: 1, //行号
      product: request.recordList.code, //物料id或code
      productsku: request.recordList.code, //物料SKU    YCL0004
      invExchRate: 1, //库存换算率
      unitExchangeType: 1, //库存换算方式
      stockUnitId: recordList.detail.stockUnit, //库存单位
      unitExchangeTypePrice: 1, //计价换算率换算方式
      invPriceExchRate: 1, //计价换算率
      priceUOM: recordList.pc_productlist_userDefine005, //计价单位(采购计价单位)
      taxitems: recordList.detail.inTaxrate, //税目税率
      autoCalcCost: false, //存货自动计算成本标识
      qty: gap,
      _status: "Insert"
    };
    var uuids = uuid();
    let uuidStr = replace(uuids, "-", "");
    // 日期处理
    let func2 = extrequire("GT101792AT1.common.getDate");
    let res1 = func2.execute();
    let paramData = {
      resubmitCheckKey: uuidStr,
      org: "00105", //收货组织
      purchaseOrg: "00105", //采购组织
      accountOrg: "00105", //会计主体
      inInvoiceOrg: "00105", //收票组织
      vouchdate: res1.dateStr, //单据日期(需要处理)
      bustype: "RK04", //交易类型
      warehouse: warehouse, //仓库
      vendor: "YL0009", //供应商
      currency: "CNY", //币种
      natCurrency: "CNY", //本币
      exchRateType: "01", //汇率类型
      exchRate: 1, //汇率
      _status: "Insert",
      purInRecords: purInRecords //采购入库单子表
    };
    var body = {
      data: paramData
    };
    let func1 = extrequire("GT101792AT1.common.getApiToken");
    let res = func1.execute();
    var token = res.access_token;
    var contenttype = "application/json;charset=UTF-8";
    var header = {
      "Content-Type": contenttype
    };
    // 采购入库单保存
    var reqCgdetailurl = URLData.URL + "/iuap-api-gateway/yonbip/scm/purinrecord/single/save?access_token=" + token; //需要更换Token
    var cgResponse = postman("POST", reqCgdetailurl, JSON.stringify(header), JSON.stringify(body));
    var cgresponseobj = JSON.parse(cgResponse);
    return { cgresponseobj };
  }
}
exports({ entryPoint: MyAPIHandler });