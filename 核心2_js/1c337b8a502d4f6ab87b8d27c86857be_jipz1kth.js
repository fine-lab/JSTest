let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let pdata = param.data[0];
    var id = pdata.id;
    var iscallback = pdata.callback;
    var shopid = pdata.shop;
    //判断是否是订单回写，如果是回写则不执行此操作
    if (iscallback !== "1") {
      //企业端下单传CRM，商家端下单不传
      if (typeof shopid == "undefined") {
        var salesOrgId = pdata.salesOrgId;
        var orderDetails = pdata.orderDetails;
        //查询虚拟客户id
        orderDetails.forEach((data) => {
          let stockOrgId = data.stockOrgId;
          let sql = "select shortname from org.func.BaseOrg where id=" + stockOrgId;
          let res = ObjectStore.queryByYonQL(sql, "ucf-org-center");
          if (res.length > 0) {
            var vcid = res[0].shortname;
            data.define2 = vcid;
          } else {
            throw new Error("未查询到该库存组织对应虚拟客户id，请联系管理员添加！");
          }
        });
        //查询物料档案的产品线id
        orderDetails.forEach((data) => {
          let productId = data.productId;
          var sql = "select productLine from pc.product.Product where id = " + data.productId;
          var res = ObjectStore.queryByYonQL(sql, "productcenter");
          if (res.length > 0) {
            var productLine = res[0].productLine;
            data.define25 = productLine;
          } else {
            throw new Error("未查询到产品线，请联系管理员添加！");
          }
        });
        //查询工厂id----->表体库存组织id对应业务单元编码，赋值给自定义项define3
        orderDetails.forEach((data) => {
          let stockOrgId = data.stockOrgId;
          let sql = "select code from org.func.BaseOrg where id=" + stockOrgId;
          let res = ObjectStore.queryByYonQL(sql, "ucf-org-center");
          if (res.length > 0) {
            var code = res[0].code;
            data.define3 = code;
          } else {
            let apiResponse = { message: "未查询到工厂编码，请联系管理员添加！", code: 999 };
            return { apiResponse: apiResponse };
          }
        });
        //查询客户id
        let sqlAgent = "select agentId  from voucher.order.Order where id = '" + id + "'";
        var resdataAgent = ObjectStore.queryByYonQL(sqlAgent, "udinghuo");
        if (resdataAgent.length > 0) {
          pdata.set("agentId", resdataAgent[0].agentId + "");
          let sqlcode = "select name from aa.merchant.Merchant where id = '" + resdataAgent[0].agentId + "'";
          var resdataAgentname = ObjectStore.queryByYonQL(sqlcode, "productcenter");
          pdata.set("agentId_name", resdataAgentname[0].name + "");
        }
        //判断销售组织和库存组织是否是同一个
        //如果表头销售组织和表体库存组织是同一个则传给二开系统，如果不是同一个则通过按钮传
        var istransport = true;
        orderDetails.forEach((data) => {
          let settlementOrgId = data.settlementOrgId; //开票组织id
          if (settlementOrgId != salesOrgId) {
            istransport = false;
          }
        });
        if (istransport) {
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
          let func = extrequire("udinghuo.dataTransmission.getOpenApiToken");
          let res = func.execute("");
          var token2 = res.access_token;
          let apiResponse = postman("post", base_path.concat("?access_token=" + token2), JSON.stringify(header), JSON.stringify(body));
          //加判断
          var obj = JSON.parse(apiResponse);
          var code = obj.code;
          if (code != "200") {
            throw new Error("订单同步CRM失败!" + obj.message);
          }
          return { code: code };
        }
      }
    }
  }
}
exports({ entryPoint: MyTrigger });