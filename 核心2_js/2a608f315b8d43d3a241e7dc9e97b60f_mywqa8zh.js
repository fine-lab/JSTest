let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var sql = "select * from AT15DC453609680006.AT15DC453609680006.ship2";
    var res = ObjectStore.queryByYonQL(sql);
    //获取单据上有效日期
    for (var i = 0; i < res.length; i++) {
      if (res[i].Exp_date != undefined) {
        var shijian = res[i].Exp_date;
        //转化为时间戳
        var sj = Date.parse(shijian);
        //获取当前时间戳
        var datea = new Date().getTime();
        //计算剩余天数
        var day = Math.ceil((sj - datea) / (1000 * 60 * 60 * 24));
      }
      if (day != undefined && day <= 2) {
        var name = res[i].Name;
        //通过邮件发送预警
        var mailReceiver = ["https://www.example.com/"];
        var channels = ["mail"];
        var messageInfo = {
          sysId: "yourIdHere",
          tenantId: "yourIdHere",
          mailReceiver: mailReceiver,
          channels: channels,
          subject: "提前2天预警通知",
          content: name + "有效期即将到期，请注意！"
        };
        var result = sendMessage(messageInfo);
      }
      return { result };
    }
  }
}
exports({ entryPoint: MyTrigger });