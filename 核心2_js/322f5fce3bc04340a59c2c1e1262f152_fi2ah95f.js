let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //查询等级，id，部门id，扣除的累计积分
    var sql = "select id,yuliuziduan7,yuliuziduan6 from GT37722AT28.GT37722AT28.abnormal_event where verifystate = 2 and" + " yuliuziduan14=0";
    var ress = ObjectStore.queryByYonQL(sql);
    for (var i = 0; i < ress.length; i++) {
      var dataa = ress[i];
      //加回分
      var kf = parseInt(dataa.yuliuziduan6);
      var object = {
        floatIntergal: -kf,
        deptId: dataa.yuliuziduan7
      };
      var header = {
        "Content-Type": "application/json"
      };
      let func1 = extrequire("GT37722AT28.backDefaultGroup.getToken");
      let res = func1.execute();
      var strResponse = postman(
        "post",
        "https://www.example.com/" + "?access_token=" + res.access_token,
        JSON.stringify(header),
        JSON.stringify(object)
      );
      //更新字段14
      var obj = {
        id: dataa.id,
        yuliuziduan14: 1
      };
      var resss = ObjectStore.updateById("GT37722AT28.GT37722AT28.abnormal_event", obj, "58255e4e");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });