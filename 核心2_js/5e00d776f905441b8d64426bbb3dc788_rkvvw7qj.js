let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //表头
    let pdata = request.data;
    //表体数组
    var dataLineArray = pdata.khdzqrdh2List;
    //拼装表体字段   注意，原单据有多少行表体，对应单据也有多少行表体
    var jsonBodyArray = []; //对应单据（销售退货保存接口）表体是数组
    //遍历原单据表体数组
    for (let i = 0; i < dataLineArray.length; i++) {
      var dataLine = dataLineArray[i]; //拿到每一行表体
      //使用表体的某个字段用YonSQL查询
      //拿物料id（materialNo）到物料档案上查商品skuId
      let sql1 = "select id from pc.product.ProductSKU where productId = '" + dataLine.materialNo + "'";
      let result1 = ObjectStore.queryByYonQL(sql1, "productcenter");
      var skuId = result1[0].id; //商品skuId
      //拿物料id（materialNo）去物料档案查批发销售单位
      let sql2 = "select batchUnit from pc.product.ProductExtend where id = '" + dataLine.materialNo + "'";
      var result2 = ObjectStore.queryByYonQL(sql2, "productcenter");
      var iProductAuxUnitId = result2[0].batchUnit; //销售单位id
      //拿物料id（materialNo）去物料档案查计价单位
      let sql3 = "select batchPriceUnit from pc.product.ProductExtend where id = '" + dataLine.materialNo + "'";
      var result3 = ObjectStore.queryByYonQL(sql3, "productcenter");
      var iProductUnitId = result3[0].batchPriceUnit; //计价单位id
      //拼装对应单据（销售退货保存接口）表体字段
      var jsonBody = {
        productId: dataLine.materialNo, //商品id
        skuId: skuId, //商品skuId
        unitExchangeType: 0, //浮动换算率（销售）
        unitExchangeTypePrice: 0, //浮动换算率（计价）
        salePrice: dataLine.unitPrice, //含税单价
        taxId: "yourIdHere", //税目税率id
        stockId: pdata.wareHouse, //仓库ID
        stockOrgId: pdata.deliveryOrg, //库存组织id
        iProductAuxUnitId: iProductAuxUnitId, //销售单位id
        iProductUnitId: iProductUnitId, //计价单位id
        masterUnitId: dataLine.measure, //主计量单位id
        salesOrgId: pdata.deliveryOrg, //销售组织id
        invExchRate: dataLine.convert, //销售换算率
        invPriceExchRate: dataLine.convert, //计价换算率
        priceQty: dataLine.lossNo, //退货计价数量
        qty: dataLine.lossNo, //退货数量
        oriTaxUnitPrice: dataLine.unitPrice, //含税成交价
        oriUnitPrice: dataLine.unitPrice, //无税单价
        oriSum: dataLine.money, //含税金额
        oriMoney: dataLine.money, //无税金额
        taxItems: "免税", //税目
        taxCode: "VAT FREE", //税目税率编码
        taxRate: 0, //税率
        oriTax: 0, //税额
        natTaxUnitPrice: dataLine.unitPrice, //本币含税单价
        natUnitPrice: dataLine.unitPrice, //本币无税单价
        natSum: dataLine.money, //本币含税金额
        natMoney: dataLine.money, //本币无税金额
        natTax: 0, //本币税额
        _status: "Insert"
      };
      jsonBodyArray.push(jsonBody); //填装
    }
    //算出表头的退货金额字段：
    var payMoney = 0;
    for (let i = 0; i < dataLineArray.length; i++) {
      var dataLine = dataLineArray[i];
      payMoney += dataLine.money;
    }
    //拼接调用OpenApi需要的Json   字段对应关系见本地二开bb.json这个文件
    var requestJson = {
      data: {
        //拼装表头字段
        salesOrgId: pdata.deliveryOrg, //	销售组织id
        transactionTypeId: 2177704243204364, //交易类型id
        agentId: pdata.customer, //客户id
        vouchdate: pdata.billDate, //单据日期
        settlementOrgId: pdata.deliveryOrg, //财务组织id
        currency: "2177704246319360", //币种id
        exchangeRateType: "rkvvw7qj", //汇率类型Id
        natCurrency: "2177704246319360", //本币pk
        agentTaxItem: "1", //客户销项税率ID
        agentRelationId: 2185044191187456, //客户交易关系id
        exchRate: 1, //汇率
        saleReturnStatus: "CONFIRMSALERETURNORDER", //单据状态
        saleReturnSourceType: "NONE", //退货类型
        invoiceAgentId: pdata.customer, //开票客户id
        creator: pdata.creator_userName, //制单人
        //退货金额字段：累加表体上面的金额(money)
        payMoney: payMoney, //退货金额
        totalOriTax: 0, //税额
        status: 1, //单据状态, 0:开立、3:审核中、1:已审核、2:已关闭
        _status: "Insert", //status 默认insert
        //拼装表体字段
        saleReturnDetails: jsonBodyArray
      }
    };
    var stringifyJson = JSON.stringify(requestJson);
    let hmd = "application/json;charset=UTF-8";
    let header = { "Content-Type": hmd };
    let base_path_openapi = "https://www.example.com/";
    //拿到access_token
    let funcxn = extrequire("GT18216AT3.backDefaultGroup.getOpenApiToken"); //这里可能出错
    let resxn = funcxn.execute("");
    var token1 = resxn.access_token;
    let apiResponse = postman("post", base_path_openapi.concat("?access_token=" + token1), JSON.stringify(header), stringifyJson);
    let resp = JSON.parse(apiResponse);
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });