let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //删除出库数据后更新仓库数据
    //出库数据
    var writeData = request.writeCount;
    //仓库数据
    var sqlSave =
      "select materialCode,amount,usageQuantity,fu.projectVO from GT8660AT38.GT8660AT38.Item_material_relation zi inner join GT8660AT38.GT8660AT38.Item_material_relation_table fu on zi.Item_material_relation_table_id=fu.id";
    var resProduct = ObjectStore.queryByYonQL(sqlSave, "developplatform");
    for (var i = 0; i < request.writeCount.length; i++) {
      for (var j = 0; j < resProduct.length; j++) {
        //循环仓库数据
        var usageQuantity = resProduct[j].usageQuantity;
        if (usageQuantity == null || usageQuantity == 0) {
          usageQuantity = 0;
        }
        if (
          writeData[i].projectVO == resProduct[j].fu_projectVO &&
          writeData[i].product == resProduct[j].materialCode &&
          writeData[i].sl + usageQuantity < resProduct[j].amount &&
          usageQuantity - writeData[i].sl >= 0
        ) {
          //根据物料编码和项目编码查询出使用数量,主id和子id
          var sqlSave1 =
            "select usageQuantity,id,fu.id from GT8660AT38.GT8660AT38.Item_material_relation zi inner join GT8660AT38.GT8660AT38.Item_material_relation_table fu on zi.Item_material_relation_table_id=fu.id where fu.projectVO=" +
            writeData[i].projectVO +
            " and materialCode=" +
            writeData[i].product;
          var resQuantity1 = ObjectStore.queryByYonQL(sqlSave1);
          //使用数量减去删除的数量
          let quantityOutRet = resQuantity1[0].usageQuantity - writeData[i].sl;
          var zid = resQuantity1[0].id;
          var fid = resQuantity1[0].fu_id;
          //调用API回写
          let header = {
            "Content-Type": "application/json;charset=UTF-8"
          };
          let httpUrl = "https://www.example.com/";
          let httpRes = postman("GET", httpUrl, JSON.stringify(header), JSON.stringify(null));
          let httpResData = JSON.parse(httpRes);
          if (httpResData.code != "00000") {
            throw new Error("获取数据中心信息出错" + httpResData.message);
          }
          let httpurl = httpResData.data.gatewayUrl;
          let func12 = extrequire("ST.frontDesignerFunction.token");
          let res = func12.execute(null);
          let token = res.access_token;
          let url = httpurl + "/mywqa8zh/czzm/UpdateTable/aa?access_token=" + token;
          var usageQuantityAAPI = resProduct[j].usageQuantity;
          var body = {
            zid: zid,
            fid: fid,
            count1: quantityOutRet,
            usageQuantityAAPI: usageQuantityAAPI
          };
          var apiResponseRes = postman("POST", url, JSON.stringify(header), JSON.stringify(body));
          if (apiResponseRes == "600") {
            apiResponseRes = "false";
          }
        }
      }
    }
    return { apiResponseRes };
  }
}
exports({ entryPoint: MyAPIHandler });