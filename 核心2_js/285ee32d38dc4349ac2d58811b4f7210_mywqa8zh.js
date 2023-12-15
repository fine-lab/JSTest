let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //保存后将出库数量回写到仓库
    //出库数据1
    var data1 = request.data1;
    //仓库数据
    var sqlSave =
      "select materialCode,amount,usageQuantity,fu.projectVO from GT8660AT38.GT8660AT38.Item_material_relation zi inner join GT8660AT38.GT8660AT38.Item_material_relation_table fu on zi.Item_material_relation_table_id=fu.id";
    var resProduct = ObjectStore.queryByYonQL(sqlSave, "developplatform");
    //标示符
    let tag = "false";
    for (var j = 0; j < resProduct.length; j++) {
      //循环仓库数据
      if (data1.productId == resProduct[j].fu_projectVO && data1.projectId == resProduct[j].materialCode && data1.quantity + resProduct[j].usageQuantity < resProduct[j].amount) {
        //出库数量
        let quantityOutRet = data1.quantity + resProduct[j].usageQuantity;
        //获取更改数据的主id和子id
        var sqlId =
          "select id,fu.id from GT8660AT38.GT8660AT38.Item_material_relation zi inner join GT8660AT38.GT8660AT38.Item_material_relation_table fu on zi.Item_material_relation_table_id=fu.id where materialCode=" +
          resProduct[0].materialCode +
          " and fu.projectVO=" +
          resProduct[0].fu_projectVO;
        var Saveid2 = ObjectStore.queryByYonQL(sqlId);
        var zid = Saveid2[0].id;
        var fid = Saveid2[0].fu_id;
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
        var body = {
          fid: fid,
          zid: zid,
          count1: quantityOutRet
        };
        let apiResponseRes = postman("POST", url, JSON.stringify(header), JSON.stringify(body));
        tag = "true";
        return { tag };
      }
    }
    return { tag };
  }
}
exports({ entryPoint: MyAPIHandler });