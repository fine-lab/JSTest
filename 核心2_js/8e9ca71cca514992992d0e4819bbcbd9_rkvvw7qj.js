let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let pdata = param.data[0];
    var iscallback = pdata.callback;
    //判断是否是订单回写，如果是回写则不执行此操作
    if (iscallback !== "1") {
      var salesOrgId = pdata.salesOrgId;
      var orderDetails = pdata.orderDetails;
      //查询虚拟客户id
      orderDetails.forEach((data) => {
        let stockOrgId = data.stockOrgId;
        let sql = "select shortname from org.func.BaseOrg where id=" + stockOrgId;
        let res = ObjectStore.queryByYonQL(sql, "ucf-org-center");
        var vcid = res[0].shortname;
        data.define2 = vcid;
      });
      //查询物料档案的产品线id
      orderDetails.forEach((data) => {
        let productId = data.productId;
        var sql = "select productLine from pc.product.Product where id = " + data.productId;
        var res = ObjectStore.queryByYonQL(sql, "productcenter");
        // 判空
        var productLine = res[0].productLine;
        data.define25 = productLine;
      });
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
        let func = extrequire("udinghuo.backDefaultGroup.getOpenApiToken");
        let res = func.execute("");
        var token2 = res.access_token;
        let apiResponse = postman("post", base_path.concat("?access_token=" + token2), JSON.stringify(header), JSON.stringify(body));
        //加判断
        var obj = JSON.parse(apiResponse);
        var code = obj.code;
        if (code != "200") {
          throw new Error("订单同步CRM失败!" + obj.message);
        } else {
          //设计标识，前端给二开系统，即往自定义项上写一个标识
          orderDetails.forEach((data) => {
            if (!data.bodyItem) {
              data.set("bodyItem", {});
              data.bodyItem.set("_entityName", "voucher.order.OrderDetailDefine");
              data.bodyItem.set("_keyName", "orderDetailId");
              data.bodyItem.set("_realtype", true);
              data.bodyItem.set("_status", "Insert");
              data.bodyItem.set("orderId", data.orderId + "");
              data.bodyItem.set("code", data.code + "");
              data.bodyItem.set("orderDetailKey", data.id + "");
              data.bodyItem.set("orderDetailId", data.id + "");
              data.bodyItem.set("define26", "Y" + "");
            }
            data.bodyItem.set("define26", "Y" + "");
            //将订单数量qty的值赋值到原订单数量define11，原含税成交价oriTaxUnitPrice的值赋值到define12，原订单总价oriSum的值赋值到define19复制到自定义项一份
            data.bodyItem.set("define11", data.qty + "");
            data.bodyItem.set("define12", data.oriTaxUnitPrice + "");
            data.bodyItem.set("define19", data.oriSum + "");
          });
        }
        return { code: code };
      }
    }
  }
}
exports({ entryPoint: MyTrigger });