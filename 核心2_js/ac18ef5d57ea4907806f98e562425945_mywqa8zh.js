let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //删除出库数据后更新仓库数据
    //出库数据
    var writeData = request.writeCount;
    //物料id
    var EXprojectId = writeData.EXprojectId;
    //项目id
    var EXproductId = writeData.EXproductId;
    //出库数量
    var EXquantity = writeData.EXquantity;
    //仓库数据
    var sqlSave =
      "select materialCode,amount,usageQuantity,fu.projectVO from GT8660AT38.GT8660AT38.Item_material_relation zi inner join GT8660AT38.GT8660AT38.Item_material_relation_table fu on zi.Item_material_relation_table_id=fu.id";
    var resProduct = ObjectStore.queryByYonQL(sqlSave, "developplatform");
    for (var j = 0; j < resProduct.length; j++) {
      //循环仓库数据
      var usageQuantity = resProduct[j].usageQuantity;
      if (usageQuantity == null || usageQuantity == 0) {
        usageQuantity = 0;
      }
      if (EXproductId == resProduct[j].fu_projectVO && EXprojectId == resProduct[j].materialCode && EXquantity + usageQuantity < resProduct[j].amount && usageQuantity - EXquantity >= 0) {
        //根据物料编码和项目编码查询出使用数量,主id和子id
        var sqlSave1 =
          "select usageQuantity,id,fu.id from GT8660AT38.GT8660AT38.Item_material_relation zi inner join GT8660AT38.GT8660AT38.Item_material_relation_table fu on zi.Item_material_relation_table_id=fu.id";
        var resQuantity1 = ObjectStore.queryByYonQL(sqlSave1);
        //使用数量减去删除的数量
        let quantityOutRet = resQuantity1[0].usageQuantity - EXquantity;
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
        var body = {
          zid: zid,
          fid: fid,
          count1: quantityOutRet
        };
        var apiResponseRes = postman("POST", url, JSON.stringify(header), JSON.stringify(body));
      }
    }
    return { apiResponseRes };
  }
}
exports({ entryPoint: MyAPIHandler });