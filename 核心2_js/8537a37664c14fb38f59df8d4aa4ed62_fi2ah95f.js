let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //查询等级，开始计时时间（字段12），id，部门id，已经扣除分的天数标识，扣除的累计积分
    var sql =
      "select level,yuliuziduan12,id,yuliuziduan7,yuliuziduan13,yuliuziduan6 from GT37722AT28.GT37722AT28.abnormal_event where verifystate = 1 and " + "yuliuziduan10 != 0 and yuliuziduan11 = 0";
    var ress = ObjectStore.queryByYonQL(sql);
    //测试分
    for (var i = 0; i < ress.length; i++) {
      var dataa = ress[i];
      var levelDay = 0;
      var levelJf = 0;
      if (dataa.level == 1) {
        levelDay = 1;
        levelJf = -10;
      } else if (dataa.level == 2) {
        levelDay = 2;
        levelJf = -5;
      } else if (dataa.level == 3) {
        levelDay = 3;
        levelJf = -5;
      } else if (dataa.level == 4) {
        levelDay = 1;
        levelJf = -10;
      } else if (dataa.level == 5) {
        levelDay = 2;
        levelJf = -5;
      }
      var date1 = dataa.yuliuziduan12;
      var oDate2 = new Date();
      var nTime = oDate2.getTime() - date1;
      var day = Math.floor(nTime / 86400000);
      if (day - dataa.yuliuziduan13 >= levelDay) {
        //扣分并更新字段13
        //扣分
        var kf = levelJf;
        var object = {
          floatIntergal: kf,
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
        //更新字段13
        var obj = {
          id: dataa.id,
          yuliuziduan13: parseInt(dataa.yuliuziduan13) + levelDay + "",
          yuliuziduan6: parseInt(dataa.yuliuziduan6) + levelJf + ""
        };
        var resss = ObjectStore.updateById("GT37722AT28.GT37722AT28.abnormal_event", obj, "58255e4e");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });