let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let list = param.data;
    if (param.data[0]._fromApi) {
      //查询已存在的映射关系
      let sql = "select productcode, phymaterial_code from AT160194EA17D00009.AT160194EA17D00009.calcmappingtable where phymaterial_code = '" + list[0].phymaterial_id_code + "' and  enable = 1";
      var result = ObjectStore.queryByYonQL(sql);
      if (result.length > 0) {
        throw new Error("实物物料编码 : (" + list[0].phymaterial_id_code + ") 已存在!");
      }
      //物料编码和名称赋值
      //产品编码
      let productId_code = param.data[0].productId_code;
      //实物物料id
      let phymaterial_id_code = param.data[0].phymaterial_id_code;
      let productsql = " select id, name, code from pc.product.Product  where code = '" + productId_code + "'";
      var productresult = ObjectStore.queryByYonQL(productsql, "productcenter");
      let productname = "";
      let productId = "";
      if (productresult.length > 0) {
        productname = productresult[0].name;
        productId = productresult[0].id;
      }
      let phymaterialsql = " select id, name, code from pc.product.Product  where code = '" + phymaterial_id_code + "'";
      var phymaterialsqlresult = ObjectStore.queryByYonQL(phymaterialsql, "productcenter");
      let phymaterial_name = "";
      let phymaterial_id = "";
      if (productresult.length > 0) {
        phymaterial_name = phymaterialsqlresult[0].name;
        phymaterial_id = phymaterialsqlresult[0].id;
      }
      if (param.data[0].phymaterial_code == null || param.data[0].phymaterial_code == "") {
        param.data[0].phymaterial_code = phymaterial_id_code;
      }
      if (param.data[0].productname_code == null || param.data[0].productname_code == "") {
        param.data[0].productcode = productId_code;
      }
      if (param.data[0].phymaterial_name == null || param.data[0].phymaterial_name == "") {
        param.data[0].phymaterial_name = phymaterial_name;
      }
      if (param.data[0].productname == null || param.data[0].productname == "") {
        param.data[0].productname = productname;
      }
      if (param.data[0].is_quote == null || param.data[0].is_quote == "") {
        param.data[0].is_quote = "0";
      }
      if (param.data[0].org_id == null || param.data[0].org_id == "") {
        param.data[0].org_id = "youridHere";
      }
      param.data[0].phymaterial_id_name = phymaterial_name;
      param.data[0].phymaterial_id = phymaterial_id;
      param.data[0].productId_name = productname;
      param.data[0].productId = productId;
    } else {
      //查询已存在的映射关系
      let sql = "select productcode, phymaterial_code from AT160194EA17D00009.AT160194EA17D00009.calcmappingtable where phymaterial_code = '" + list[0].phymaterial_id_code + "' and  enable = 1";
      var result = ObjectStore.queryByYonQL(sql);
      if (result.length > 0) {
        throw new Error("实物物料编码 : (" + list[0].phymaterial_id_code + ") 已存在!");
      }
    }
    return { param };
  }
}
exports({ entryPoint: MyTrigger });