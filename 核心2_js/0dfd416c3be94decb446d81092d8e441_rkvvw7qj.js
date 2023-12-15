let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    debugger;
    throw new Error("销售出库保存/删除接口抛出的异常---wsx");
    var pdata = request.data;
    var details = pdata.details; //获取表体行信息list
    let sql1 = "select id from org.func.BaseOrgDefine where define1 = " + pdata.org;
    let res1 = ObjectStore.queryByYonQL(sql1, "ucf-org-center");
    let sql1_1 = "select code, name from org.func.BaseOrg where id = " + res1[0].id;
    let res1_1 = ObjectStore.queryByYonQL(sql1_1, "ucf-org-center");
    pdata.org = res1_1[0].code;
    pdata.org_name = res1_1[0].name + "";
    //在aa.merchant.Merchant表中根据code比对获取id
    let sql10 = "select id from aa.merchant.Merchant where code = 11575";
    let res10 = ObjectStore.queryByYonQL(sql10, "productcenter");
    pdata.cust = res10[0].id;
    let sql11 = "select id from aa.merchant.Merchant where code = " + pdata.invoiceCust;
    let res11 = ObjectStore.queryByYonQL(sql11, "productcenter");
    pdata.invoiceCust = res11[0].id;
    //对表体行的信息查询、赋值
    for (var i = details.length - 1; i >= 0; i--) {
      //在voucher.delivery.DeliveryDetail中根据id等于srcBillRow), 比对获取skuId、productId、sourceautoid。skuCode等于product_cCode           ----OK
      let sql3_1 = "select skuId, sourceautoid, productId from voucher.delivery.DeliveryDetail where id = " + details[i].srcBillRow;
      let res3_1 = ObjectStore.queryByYonQL(sql3_1, "udinghuo");
      details[i].productsku = res3_1[0].skuId + "";
      details[i].product = res3_1[0].productId;
      details[i].sourceautoid = res3_1[0].sourceautoid;
      details[i].productsku_cCode = details[i].product_cCode + "";
      //从物料档案 c.product.Product  根据物料编码product_cCode(对应code)查询是否启用辅计量单位enableAssistUnit（true/false）
      //若为false则值等于1，若为true，则从物料档案获取productAssistUnitExchanges[0].mainUnitCount                             ----OK
      let sql3 = "select enableAssistUnit from pc.product.Product where code = " + "'" + details[i].product_cCode + "'";
      let res3 = ObjectStore.queryByYonQL(sql3, "productcenter");
      if (res3[0].enableAssistUnit) {
        //在pc.product.ProductAssistUnitExchange中通过detailis[i].product等于productId比对获取mainUnitCount、unitExchangeType ----OK
        let sql3_01 = "select mainUnitCount, unitExchangeType from pc.product.ProductAssistUnitExchange where productId = " + details[i].product;
        let res3_01 = ObjectStore.queryByYonQL(sql3_01, "productcenter");
        details[i].invExchRate = res3_01[0].mainUnitCount;
        details[i].unitExchangeType = res3_01[0].unitExchangeType;
      } else {
        details[i].invExchRate = 1;
      }
      //顺便查个DeliveryPrice，给循环外查currency和natCurrency使用                                  ----OK
      let sql3_2 = "select id from voucher.delivery.DeliveryVoucher where code = " + pdata.srcBillNO;
      var res3_2 = ObjectStore.queryByYonQL(sql3_2, "udinghuo");
      details[i].sourceid = res3_2[0].id;
      //把表体行里需要写死的值在这里赋值
      details[i].source = "1";
      details[i].sourceautoid = Number(details[i].srcBillRow);
      details[i].isBatchManage = false;
      details[i].makeRuleCode = "deliveryTostoreout";
      details[i].autoCalcCost = false;
      details[i].taxUnitPriceTag = true;
    }
    let sql5 = "select currency, natCurrency from voucher.delivery.DeliveryPrice where deliveryId = " + res3_2[0].id;
    let res5 = ObjectStore.queryByYonQL(sql5, "udinghuo");
    pdata.currency = res5[0].currency + "";
    pdata.natCurrency = res5[0].natCurrency + "";
    let sql7 = "select id from aa.warehouse.Warehouse where code=" + "'" + pdata.warehouse + "'";
    let res7 = ObjectStore.queryByYonQL(sql7, "productcenter");
    pdata.warehouse = res7[0].id;
    pdata.define10 = pdata.code;
    //固定字段赋值
    pdata.bustype_name = "销售出库";
    pdata.bustype = "2177704243155231";
    pdata.stockDirection = "0";
    pdata.status = 0; //这里需要确认一下“保存”是不是对应0 ---是的
    pdata.srcBillType = "1";
    pdata.retailInvestors = false;
    pdata.bizFlow = "b885b998-b919-11eb-8c0b-98039b073634";
    pdata.sourcesys = "udinghuo";
    //传参
    var sdata = {};
    sdata.data = pdata;
    var resdata = JSON.stringify(pdata);
    let base_path = "https://www.example.com/";
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    var body = {
      data: pdata
    };
    //拿到access_token
    let func = extrequire("udinghuo.backDefaultGroup.getOpenApiToken");
    let res = func.execute("");
    var token2 = res.access_token;
    let apiResponse = postman("post", base_path.concat("?access_token=fe80b42a0b4c4a268ac3b0a7011a220c"), JSON.stringify(header), JSON.stringify(body)); //测试时写死测试环境的token
    //加判断
    var obj = JSON.parse(apiResponse);
    var code = obj.code;
    var remes = obj.data.messages[0];
    if (code != "200") {
      throw new Error("同步失败!" + remes);
    } else {
    }
    return { remes };
  }
  //如果不是ebs调用的则什么都不干
}
exports({ entryPoint: MyAPIHandler });