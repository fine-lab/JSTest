let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var sid = request.sid;
    // 查询主表数据
    var sql = "select * from GT5646AT1.GT5646AT1.sales_Report where id = " + sid + "";
    var result = ObjectStore.queryByYonQL(sql, "developplatform");
    // 查询子表数据
    var sonSql = "select * from GT5646AT1.GT5646AT1.sales_ReportDetails where sales_Report_id = " + sid + "";
    var resultSon = ObjectStore.queryByYonQL(sonSql, "developplatform");
    let ContentType = "application/json;charset=UTF-8";
    let header = { "Content-Type": ContentType };
    let uuidStr = uuid();
    let uuids = replace(uuidStr, "-", "");
    let resultJson = result[0];
    let datails = {
      _status: "Insert",
      source: "0", //来源单据类型
      taxRate: "0", //税率
      product: resultSon[0].product, //物料id或编码
      productsku: resultSon[0].productsku, //商品SKUid或编码
      invExchRate: resultSon[0].invExchRate, //换算率
      qty: resultSon[0].qty, //数量
      stockUnit: resultSon[0].stockUnit, //库存单位id或编码
      oriSum: resultSon[0].oriSum, //含税金额
      priceUOM: "01", //计价单位id或编码
      invPriceExchRate: resultSon[0].invPriceExchRate, //计价换算率
      taxUnitPriceTag: resultSon[0].taxUnitPriceTag, //价格含税, true:是、false:否
      unitExchangeType: resultSon[0].unitExchangeType, //库存单位转换率的换算方式 0：固定 1：浮动
      taxId: resultSon[0].taxId //税目id或编码
    };
    let requestBody = {
      resubmitCheckKey: uuids,
      receiveAccountingBasis: "st_salesout", //销售出库单
      salesoutAccountingMethod: "salesoutConfirm", //出库立账方式
      accountOrg: resultJson.accountOrg, //会计主体id或编码
      salesOrg: resultJson.salesOrg, //销售组织id或编码
      org: resultJson.org_id, //主组织id
      invoiceOrg: resultJson.invoiceOrg, //开票组织id或编码
      vouchdate: resultJson.vouchdate, //单据日期
      bustype: "A30001", //交易类型id或编码
      warehouse: resultJson.warehouse, //仓库id或编码
      cust: resultJson.cust, //客户id或编码
      srcBillType: "0", //来源类型,
      natCurrency: "CNY", //本币id或编码
      currency: "CNY", //币种id或编码
      details: datails, //子表数据
      _status: "Insert" //操作标识, Insert:新增、Update:更新
    };
    let body = { data: requestBody };
    let func1 = extrequire("GT5646AT1.apifunction.getToken");
    let res = func1.execute(null, null);
    let access_token = res.access_token;
    let url = "https://www.example.com/" + access_token;
    let apiResponse = postman("POST", url, JSON.stringify(header), JSON.stringify(body));
    var resultStr = JSON.parse(apiResponse);
    return { resultStr };
  }
}
exports({ entryPoint: MyAPIHandler });