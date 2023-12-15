let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var pdata = request.data;
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
            let apiResponse = { message: "第" + (i + 1) + "行发货仓库非前置仓，请修改", code: 999 };
            return { apiResponse: apiResponse };
          }
        } else {
          let apiResponse = { message: "未查询到该仓库信息，请联系管理员添加！", code: 999 };
          return { apiResponse: apiResponse };
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
        let apiResponse = { message: "未查询到该库存组织对应虚拟客户id，请联系管理员添加！", code: 999 };
        return { apiResponse: apiResponse };
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
        let apiResponse = { message: "未查询到产品线，请联系管理员添加！", code: 999 };
        return { apiResponse: apiResponse };
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
    //加判断apiResponse: {"message":"保存订单到CRM异常:java.lang.Exception: 找不到职位信息！","code":999}
    var obj = JSON.parse(apiResponse);
    return { obj: obj };
  }
}
exports({ entryPoint: MyAPIHandler });