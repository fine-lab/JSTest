let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let materialType = request.materialType;
    //查询商品分类
    let sql = "select parent from GT22176AT10.GT22176AT10.SY01_custcatagoryv3 where id = '" + materialType + "'";
    let res = ObjectStore.queryByYonQL(sql, "sy01");
    if (typeof res != "undefined" && res != null) {
      if (res.length > 0) {
        //查询商品分类上级分类
        let parentSql = "select catagoryname from GT22176AT10.GT22176AT10.SY01_custcatagoryv3 where id = '" + res[0].parent + "'";
        let parentRes = ObjectStore.queryByYonQL(parentSql, "sy01");
        return { parentRes };
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });