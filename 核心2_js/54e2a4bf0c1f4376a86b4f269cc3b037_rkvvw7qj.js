let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let pdata = request.data;
    var orderDetails = pdata.orderDetails;
    //查询虚拟客户id
    orderDetails.forEach((data) => {
      let stockOrgId = data.stockOrgId;
      let sql = "select shortname from org.func.BaseOrg where id=" + stockOrgId;
      let res = ObjectStore.queryByYonQL(sql, "ucf-org-center");
      var vcid = res[0].shortname;
      data.define2 = vcid;
    });
    //查询产品线
    orderDetails.forEach((data) => {
      let productId = data.productId;
      let sql = "select productLine from pc.product.Product where id = " + data.productId;
      let res = ObjectStore.queryByYonQL(sql, "productcenter");
      // 判空
      var productLine = res[0].productLine;
      data.define25 = productLine;
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
    return { obj: obj };
  }
}
exports({ entryPoint: MyAPIHandler });