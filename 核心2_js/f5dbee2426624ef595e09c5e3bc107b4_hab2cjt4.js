let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let sql = "select * from GT21884AT168.GT21884AT168.test0003 limit 0,2";
    //查询内容
    var object = {
      id: "实体id",
      compositions: [
        {
          name: "子实体id",
          compositions: []
        }
      ]
    };
    //实体查询
    var res = ObjectStore.selectById("实体url", object);
    var object = { key: "yourkeyHere", subTable: [{ key: "yourkeyHere" }] };
    var res = ObjectStore.insert("实体url", object, "表单编码");
    var res = ObjectStore.queryByYonQL(sql);
    cb.utils.alert(res);
    cb.utils.alert(JSON.stringify(res));
    throw new Error(res + JSON.stringify(res));
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });