let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var object = { wenben: "友企联插入", shuzhi: 5 };
    var res = ObjectStore.insert("GT44903AT33.GT44903AT33.simpletest", object, "fd579244");
    //进行数据插入；执行成功后列表上检查插入的数据内容
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });