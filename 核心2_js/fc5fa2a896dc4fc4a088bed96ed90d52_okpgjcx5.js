let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    debugger;
    var id = request.id;
    var wzsql = "select * from GT21859AT11.GT21859AT11.productzsb"; //重点物资查询sql
    var res = ObjectStore.queryByYonQL(wzsql); //数据库中拿取字段信息
    var xqsql = "select * from GT21859AT11.GT21859AT11.ceshi002"; //需求表查询sql
    var ref = ObjectStore.queryByYonQL(xqsql);
    var productcode = "";
    var xuqiucode = "";
    var uri = "GT21859AT11.GT21859AT11.materialdemand";
    if (res != null && res.length > 0) {
      productcode = res[0].productcode; //从后端sql的数据拿取值
    }
    if (ref != null && ref.length > 0) {
      xuqiucode = ref[0].wuliaobianma; //从后端sql的数据拿取值
    }
    var object = {
      id: id,
      memo: "已校验",
      subTable: [
        { hasDefaultInit: true, _status: "Insert" },
        { id: id, _status: "Delete" }
      ]
    };
    var res = ObjectStore.updateById(uri, object);
    return { productcode: "123", request: request }; //如果查询出数据一致，则返回校验字段
  }
}
exports({ entryPoint: MyAPIHandler });