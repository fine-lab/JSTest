let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取页面的用户名字,这是列表
    var users = param.data[0].text_hzyV2_12_kaoshengList;
    console.log("users" + users);
    //获取口令
    var koulin = param.data[0].kouling;
    console.log("koulin" + koulin);
    //更新EHS人员表中的口令数据
    //查询GT65548AT19.GT65548AT19.text_hzyV2_4_1	的人员
    var lengths = users.length;
    var usersname = [];
    for (var i = 0; i < lengths; i++) {
      //查询列表名字id
      usersname.push(users[i].kaosheng);
      //更新实例
      var object1 = {
        id: users[i].kaosheng,
        new8: koulin
      };
      var res = ObjectStore.updateById("GT65548AT19.GT65548AT19.text_hzyV2_4_1", object1, "6522ec93List");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });