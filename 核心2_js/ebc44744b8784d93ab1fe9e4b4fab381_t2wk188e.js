let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询所有产品线
    let sql01 = "select * from pc.productline.ProductLine  ";
    var res01 = ObjectStore.queryByYonQL(sql01, "productcenter");
    let json = {};
    if (res01 != undefined && res01.length > 0) {
      json.code = "200";
      json.message = "查询到条数:" + res01.length;
      json.data = res01;
    } else {
      json.code = "404";
      json.message = "未查询到数据";
    }
    return json;
  }
}
exports({ entryPoint: MyAPIHandler });