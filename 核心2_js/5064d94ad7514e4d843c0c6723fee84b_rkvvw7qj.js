let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let pdata = param.data[0];
    var stockOrgId = pdata.stockOrgId;
    let sql = "select define1 from org.func.BaseOrgDefine where id=" + stockOrgId;
    let res = ObjectStore.queryByYonQL(sql, "ucf-org-center");
    if (res.length) {
      var stockorgcode = res[0].define1;
      pdata.stockorgcode = stockorgcode;
    } else {
      throw new Error("当前单据库存组织未维护define1字段，请完善----wsx");
    }
    var corpContact = pdata.deliveryDetails[0].corpContact;
    let sql2 = "select cert_no from bd.staff.Staff where id=" + corpContact;
    let res2 = ObjectStore.queryByYonQL(sql2, "ucf-org-center");
    var certNo = res2[0].cert_no;
    pdata.certNo = certNo;
    var orderSourceCode = pdata.deliveryDetails[0].orderNo;
    let sql3 = "select auditorId from voucher.order.Order where code=" + orderSourceCode;
    let res3 = ObjectStore.queryByYonQL(sql3, "udinghuo");
    var auditorId = res3[0].auditorId;
    pdata.auditorId = auditorId;
    var stockId = pdata.deliveryDetails[0].stockId;
    let sql6 = "select code from aa.warehouse.Warehouse where id=" + stockId;
    let res6 = ObjectStore.queryByYonQL(sql6, "productcenter");
    var stockCode = res6[0].code;
    pdata.stockCode = stockCode;
    //先把订单头备注信息组装成ebs要求的格式
    if (pdata.shippingMemo === null || pdata.shippingMemo === "") {
      pdata.shippingMemo = "无";
    }
    if (pdata.retailInvestors) {
      //是散户的情况
      //先查询对应的大客户编码和客户名称
      let sql5_2 = "select define2 from org.func.BaseOrgDefine where id=" + stockOrgId;
      let res5_2 = ObjectStore.queryByYonQL(sql5_2, "ucf-org-center");
      let sql5_3 = "select code, name from aa.merchant.Merchant where id=" + res5_2[0].define2;
      let res5_3 = ObjectStore.queryByYonQL(sql5_3, "productcenter");
      pdata.agentCode = res5_3[0].code;
      //查询散户的code
      let sql5_4 = "select code from aa.merchant.Merchant where id=" + pdata.agentId;
      var res5_4 = ObjectStore.queryByYonQL(sql5_4, "productcenter");
      //把客户编码和名称拼到shippingMemo中（拼到前面）
      var agentInfo = "散户信息(名称及编码)：" + pdata.agentId_name + "," + res5_4[0].code + "; " + "其他备注信息：";
      pdata.shippingMemo = agentInfo + pdata.shippingMemo;
    } else {
      //不是散户的情况
      var agentId = pdata.agentId;
      let sql5_1 = "select code from aa.merchant.Merchant where id=" + pdata.agentId;
      var res5_1 = ObjectStore.queryByYonQL(sql5_1, "productcenter");
      pdata.agentCode = res5_1[0].code;
    }
    var resdata = JSON.stringify(pdata);
    let base_path = "https://www.example.com/";
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    var body = {
      resdata: resdata
    };
    //拿到access_token
    let func = extrequire("udinghuo.backDefaultGroup.getOpenApiToken");
    let res_r = func.execute("");
    var token2 = res_r.access_token;
    let apiResponse = postman("post", base_path.concat("?access_token=" + token2), JSON.stringify(header), JSON.stringify(body));
    var strrr = JSON.stringify(body);
    //加判断
    var obj = JSON.parse(apiResponse);
    var code = obj.code;
    if (code != "200") {
      throw new Error("订单同步EBS失败!" + obj.message);
    }
    return { code: code };
  }
}
exports({ entryPoint: MyTrigger });