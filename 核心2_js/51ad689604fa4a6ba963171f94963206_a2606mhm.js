let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取页面的用户名字,这是列表
    var users = param.data[0].testMeasures_hzy_7_personnelList;
    //获取口令
    var numbers = param.data[0].number;
    var lengths = users.length;
    var usersname = [];
    //查询实体
    //查询内容
    //实体查询
    for (var i = 0; i < lengths; i++) {
      //查询列表名字id
      usersname.push(users[i].personnel);
      //更新实例
      var object1 = {
        id: users[i].personnel,
        number: numbers,
        type: "2"
      };
      var res = ObjectStore.updateById("GT68755AT20.GT68755AT20.testMeasures_hzy_3", object1, "4d32f99eList");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });