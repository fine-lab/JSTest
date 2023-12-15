let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    debugger;
    var code = request.code;
    //查询物料档案
    var sql = 'select * from pc.product.Product where code = "' + code + '"';
    var res = ObjectStore.queryByYonQL(sql, "productcenter");
    //食品类别名称
    var categoryname = "";
    if (res != null && res.length > 0) {
      var manageClass = res[0].manageClass; //物料分类id
      var yonsql = 'select * from GT21859AT11.GT21859AT11.foodcate_rel_config where materialcategory = "' + manageClass + '"';
      var yres = ObjectStore.queryByYonQL(yonsql);
      if (yres != null && yres.length > 0) {
        var foodcategory = yres[0].foodcategory;
        var yysql = 'select * from GT21859AT11.GT21859AT11.food_category where id = "' + foodcategory + '"';
        var yyres = ObjectStore.queryByYonQL(yysql);
        if (yyres != null && yyres.length > 0) {
          categoryname = yyres[0].categoryname;
        }
      }
    }
    return { res: categoryname };
  }
}
exports({ entryPoint: MyAPIHandler });