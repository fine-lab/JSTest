let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let requestData = request.data;
    var object = {};
    //组织编码
    let orgCodeValue = requestData.orgCode;
    let queryOrgSql = "select id from aa.org.Org where code='" + orgCodeValue + "'";
    var orgRes = ObjectStore.queryByYonQL(queryOrgSql, "productcenter");
    if (orgRes.length == 0) {
      throw new Error("保存码库数据失败，组织编码【" + orgCodeValue + "】有误！");
    } else {
      object.pk_org = orgRes[0].id;
    }
    //物料编码
    let materialCodeValue = requestData.materialCode;
    let queryMaterialSql = "select id from pc.product.Product where code='" + materialCodeValue + "'";
    var materialRes = ObjectStore.queryByYonQL(queryMaterialSql, "productcenter");
    if (materialRes.length == 0) {
      throw new Error("保存码库数据失败，物料编码【" + materialCodeValue + "】有误！");
    } else {
      object.pk_material = materialRes[0].id;
    }
    for (var key in requestData) {
      if (key != "orgCode" && key != "materialCode") {
        object[key] = requestData[key];
      }
    }
    var saveRes = ObjectStore.insert("GT101792AT1.GT101792AT1.codelibrary", object, "7e0ea034");
    saveRes.orgCode = orgCodeValue;
    saveRes.materialCode = materialCodeValue;
    return saveRes;
  }
}
exports({ entryPoint: MyAPIHandler });