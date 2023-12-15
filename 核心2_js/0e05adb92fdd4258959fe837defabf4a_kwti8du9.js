let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let func1 = extrequire("ST.api001.getToken");
    let URL = extrequire("GT101792AT1.common.PublicURL");
    let URLData = URL.execute(null, null);
    let res = func1.execute(require);
    let token = res.access_token;
    let headers = { "Content-Type": "application/json;charset=UTF-8" };
    // 物料id
    var productMessage = param;
    // 物料主表
    let productDeatliSql = "select manageClass,name,code from pc.product.Product where id = '" + productMessage + "'";
    let productDeatliRes = ObjectStore.queryByYonQL(productDeatliSql, "productcenter");
    if (productDeatliRes.length > 0) {
      // 物料分类主键
      let manageClass = productDeatliRes[0].manageClass;
      // 物料分类详情查询
      let productClassResponse = postman(
        "get",
        URLData.URL + "/iuap-api-gateway/yonbip/digitalModel/managementclass/detail?access_token=" + token + "&id=" + manageClass,
        JSON.stringify(headers),
        null
      );
      let productClassObject = JSON.parse(productClassResponse);
      if (productClassObject.code == 200) {
        // 分类编码
        var productClassName = productClassObject.data.name.zh_CN;
        // 分类名称
        var productClassCode = productClassObject.data.code;
      }
      let productSql = "select stockUnit from pc.product.ProductDetail where productId = '" + productMessage + "'";
      let productRes = ObjectStore.queryByYonQL(productSql, "productcenter");
      let stockUnit = productRes[0].stockUnit;
      // 计量单位详情查询
      let UnitSql = "select name from pc.unit.Unit where id = '" + stockUnit + "'";
      var UnitRes = ObjectStore.queryByYonQL(UnitSql, "productcenter");
      if (UnitRes.length > 0) {
        var stockUnit_name = UnitRes[0].name;
      } else {
        throw new Error("未查询到该物料的库存单位！");
      }
      return { productList: { productClassName: productClassName, productClassCode: productClassCode, stockUnit_name: stockUnit_name } };
    }
  }
}
exports({ entryPoint: MyTrigger });