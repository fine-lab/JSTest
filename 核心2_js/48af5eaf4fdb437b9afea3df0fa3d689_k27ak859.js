let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //查询采购预估发票代提醒制单人(前后三天)
    var timezone = 8; //目标时区时间，东八区
    var offset_GMT = new Date().getTimezoneOffset(); //本地时间和格林威治的时间差，单位为分钟
    var nowDate = new Date().getTime(); //本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
    var time = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000); //当前时间
    var time1 = new Date(time);
    time1.setDate(time1.getDate() + 3);
    var data1 = time1.getFullYear().toString() + "-" + ("0" + (time1.getMonth() + 1).toString()).slice(-2) + "-" + ("0" + time1.getDate().toString()).slice(-2); //结束时间
    var time2 = new Date(time);
    time2.setDate(time2.getDate() - 3);
    var data2 = time2.getFullYear().toString() + "-" + ("0" + (time2.getMonth() + 1).toString()).slice(-2) + "-" + ("0" + time2.getDate().toString()).slice(-2); //开始时间
    var sql =
      "select creator,GROUP_CONCAT(code) codes from AT163BD39E08680003.AT163BD39E08680003.CGYGFP where 1=1 and(tdzt=" +
      "'待推单') and(txrq >='" +
      data2 +
      "' and txrq<='" +
      data1 +
      "') GROUP BY creator";
    var res = ObjectStore.queryByYonQL(sql);
    if (res.length > 0) {
      //发送通知消息
      for (var i = 0; i < res.length; i++) {
        try {
          //友空间的接收者的用户ID
          var uspaceReceiver = [];
          uspaceReceiver[0] = res[i].creator;
          var channels = ["uspace"];
          // 发送消息的标题
          var title = "采购预估单待下推提醒";
          // 发送消息的内容
          var content = "待下推单号编码:[" + res[i].codes + "]";
          var messageInfo = {
            sysId: "yourIdHere",
            tenantId: "yourIdHere",
            uspaceReceiver: uspaceReceiver,
            channels: channels,
            subject: title,
            content: content
          };
          var result = sendMessage(messageInfo);
        } catch (e) {}
      }
    }
    return {};
  }
}
exports({
  entryPoint: MyTrigger
});