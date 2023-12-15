let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let pdata = param.data[0];
    if (pdata == null) {
      pdata = param.data;
    }
    var orderDetails = pdata.orderDetails;
    var base_path = "https://www.example.com/";
    var paramQj = new Array();
    if (orderDetails.length > 0) {
      let stockOrgId = orderDetails[0].stockOrgId;
      let salesOrgId = pdata.salesOrgId;
      if (stockOrgId !== salesOrgId) {
        let stockId = orderDetails[0].stockId;
        let sqlsti = "select define1 from aa.warehouse.WarehouseDefine where id = '" + stockId + "'";
        //查询仓库信息，define1为真是前置仓库，为false是工厂仓库
        var resdatasti = ObjectStore.queryByYonQL(sqlsti, "productcenter");
        if (resdatasti.length > 0) {
          var define1 = resdatasti[0].define1;
          if (define1 == "true") {
            // 这是前置仓库信息;
            let sql = "select define1 from org.func.BaseOrgDefine where id=" + orderDetails[0].stockOrgId;
            let res = ObjectStore.queryByYonQL(sql, "ucf-org-center");
            if (res.length > 0) {
              //这里的define1是库存组织编码。
              var vcid = res[0].define1;
              paramQj[1] = vcid;
              base_path = "https://www.example.com/";
            } else {
              throw new Error("未查询到该这是前置仓库信息库的库存组织编码，请联系管理员添加！");
            }
          } else if (define1 == "false") {
            base_path = "https://www.example.com/";
          }
        } else {
          throw new Error("未查询到该仓库信息，请联系管理员添加！");
        }
        //物料编码
        let sqlstixue = "select erpCode from pc.product.Product where id = " + orderDetails[0].productId;
        var resdatasti = ObjectStore.queryByYonQL(sqlstixue, "productcenter");
        //这里的erpCode是物料编码
        if (resdatasti.length > 0) {
          var erpCode = resdatasti[0].erpCode;
          paramQj[0] = erpCode;
        } else {
          throw new Error("未查询到该仓库信息的物料编码，请联系管理员添加！");
        }
      }
    }
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = { "Content-Type": hmd_contenttype };
    var body = {
      value1: paramQj[1],
      value3: paramQj[0]
    };
    throw new Error(vcid + "======" + erpCode);
    //拿到access_token ececa91c1f594771bc82fddc381850c9
    var token2 = "2222222";
    let apiResponse = postman("post", base_path + "?access_token=" + token2, JSON.stringify(header), JSON.stringify(body));
    var obj = JSON.parse(apiResponse);
    var code = obj.code;
    if (code == "200") {
    } else {
      throw new Error("现有库存量不足!" + "库存量不够");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });