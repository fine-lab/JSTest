let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    throw new Error("1111");
    //出库数据1
    var data1 = request.data1;
    //仓库数据
    var sqlSave =
      "select materialCode,amount,fu.projectVO from GT8660AT38.GT8660AT38.Item_material_relation zi inner join GT8660AT38.GT8660AT38.Item_material_relation_table fu on zi.Item_material_relation_table_id=fu.id";
    var resProduct = ObjectStore.queryByYonQL(sqlSave, "developplatform");
    //标示符
    let tag = "false";
    for (var i = 0; i < data1.length; i++) {
      //循环出库数据
      for (var j = 0; j < resProduct.length; j++) {
        //循环仓库数据
        if (data1[i].projectId == resProduct[j].fu_projectVO && data1[i].productId == resProduct[j].materialCode && data1[i].quantity < resProduct[j].amount) {
          //出库数量
          let quantityOutRet = data1[i].quantity;
          //获取更改数据的主id和子id
          var sqlId =
            "select id,fu.id from GT8660AT38.GT8660AT38.Item_material_relation zi inner join GT8660AT38.GT8660AT38.Item_material_relation_table fu on zi.Item_material_relation_table_id=fu.id where materialCode=" +
            resProduct[j].materialCode +
            "and fu.projectVO=" +
            resProduct[j].fu_projectVO;
          var Saveid2 = ObjectStore.queryByYonQL(sqlId);
          zid = Saveid2[0].id;
          fid = Saveid2[0].fu_id;
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
            count1: 11
          };
          let apiResponseRes = postman("POST", url, JSON.stringify(header), JSON.parse(body));
          tag = "true";
          return { tag };
        }
      }
    }
    return { tag };
  }
}
exports({ entryPoint: MyAPIHandler });