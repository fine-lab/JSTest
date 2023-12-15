let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //出库数据
    var data1 = request.data1;
    for (var i = 0; i < data1.length; i++) {
      //根据物料编码和项目编码查询出使用数量,主id和子id
      var sqlSave =
        "select usageQuantity,id,fu.id from GT8660AT38.GT8660AT38.Item_material_relation zi inner join GT8660AT38.GT8660AT38.Item_material_relation_table fu on zi.Item_material_relation_table_id=fu.id where fu.projectVO=" +
        data1[i].projectId +
        "and materialCode=" +
        data1[i].productId;
      var resQuantity = ObjectStore.queryByYonQL(sqlSave, "developplatform");
      //使用数量减去删除的数量
      let quantityOutRet = resQuantity - data1[i].quantity;
      //获取更改数据的主id和子id
      zid = resQuantity[i].id;
      fid = resQuantity[i].fu_id;
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
      let apiResponseRes = postman("POST", url, JSON.stringify(header), JSON.parse(body));
    }
    var test = "test";
    return { test };
  }
}
exports({ entryPoint: MyAPIHandler });