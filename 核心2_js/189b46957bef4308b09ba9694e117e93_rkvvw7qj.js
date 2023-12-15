let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let pdata = param.data[0];
    var orderDetails = pdata.orderDetails;
    //校验是否为如果发货库存组织与销售组织不一致时校验该标识。
    for (let i = 0; i < orderDetails.length; i++) {
      let stockOrgId = orderDetails[0].stockOrgId;
      let salesOrgId = pdata.salesOrgId;
      if (stockOrgId !== salesOrgId) {
        let stockId = orderDetails[0].stockId;
        let sqlsti = "select bWMS from aa.warehouse.Warehouse where id = '" + stockId + "'";
        var resdatasti = ObjectStore.queryByYonQL(sqlsti, "productcenter");
        if (resdatasti.length > 0) {
          var bwms = resdatasti[0].bWMS;
          if (bwms !== "" && bwms === false) {
            throw new Error("第" + (i + 1) + "行发货仓库非前置仓，请修改");
          }
        } else {
          throw new Error("未查询到该仓库信息，请联系管理员添加！");
        }
      }
    }
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
    //查询产品线
    orderDetails.forEach((data) => {
      let productId = data.productId;
      let sql = "select productLine from pc.product.Product where id = " + data.productId;
      let res = ObjectStore.queryByYonQL(sql, "productcenter");
      if (res.length > 0) {
        var productLine = res[0].productLine;
        data.define25 = productLine;
      } else {
        throw new Error("未查询到产品线，请联系管理员添加！");
      }
    });
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
    //加判断apiResponse: {"message":"保存订单到CRM异常:java.lang.Exception: 找不到职位信息！","code":999}
    var obj = JSON.parse(apiResponse);
    var code = obj.code;
    if (code == "200") {
      orderDetails.forEach((adata) => {
        if (!adata.bodyItem) {
          adata.set("bodyItem", {});
          adata.bodyItem.set("_entityName", "voucher.order.OrderDetailDefine");
          adata.bodyItem.set("_keyName", "orderDetailId");
          adata.bodyItem.set("_realtype", true);
          adata.bodyItem.set("_status", "Insert");
          adata.bodyItem.set("orderId", adata.orderId + "");
          adata.bodyItem.set("code", adata.code + "");
          adata.bodyItem.set("orderDetailKey", adata.id + "");
          adata.bodyItem.set("orderDetailId", adata.id + "");
          adata.bodyItem.set("define26", "Y" + "");
        }
        adata.bodyItem.set("define26", "Y" + "");
        //将订单数量qty的值赋值到原订单数量define11，原含税成交价oriTaxUnitPrice的值赋值到define12，原订单总价oriSum的值赋值到define19复制到自定义项一份
        adata.bodyItem.set("define11", adata.qty + "");
        adata.bodyItem.set("define12", adata.oriTaxUnitPrice + "");
        adata.bodyItem.set("define19", adata.oriSum + "");
      });
    } else {
      throw new Error("订单同步CRM失败!" + obj.message);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });