let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var timezone = 8; //目标时区时间，东八区
    // 本地时间和格林威治的时间差，单位为分钟
    var offset_GMT = new Date().getTimezoneOffset();
    // 本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
    var nowDate = new Date().getTime();
    var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
    var date_Date = new Date(date);
    var date_Time = date_Date.getTime();
    var sql = "select id,creator,LicenseValidity,BuyersCode from AT161E5DFA09D00001.AT161E5DFA09D00001.Buyers where enable = '1'";
    var res = ObjectStore.queryByYonQL(sql);
    if (res.length > 0) {
      for (var i = 0; i < res.length; i++) {
        // 创建人yhtID
        var creator = res[i].creator;
        // 经营许可有效日期
        var LicenseValidity = res[i].LicenseValidity;
        // 购货者编码
        var BuyersCode = res[i].BuyersCode;
        var id = res[i].id;
        // 经营许可有效日期转时间戳
        var LicenseValidity_Date = new Date(LicenseValidity);
        var LicenseValidity_Time = LicenseValidity_Date.getTime();
        // 有效期减去当前时间所剩天数
        var rangeDateNum = (LicenseValidity_Time - date_Time) / (1000 * 3600 * 24);
        var rangeDateNum_Day = Math.ceil(rangeDateNum);
        if (rangeDateNum_Day <= 30 && rangeDateNum_Day >= 0) {
          let uspaceReceiver = ["1a591623-4800-412a-ad38-d0572e7d583a", "2c149722-6576-44fc-9891-b6599d268452", "fea41f55-cec9-42b1-9753-bbaac0cf5740", "3ed985bc-109f-4cfc-a4cb-9e91619ce350"];
          let channels = ["uspace"];
          let dis = new Big(rangeDateNum_Day);
          let day = dis.abs();
          let title = "购货者经营许可证到期提醒！";
          let content = "请注意！购货者编码为：" + BuyersCode + "的经营许可证还有" + day + "天到期！";
          let messageInfo = {
            sysId: "yourIdHere",
            tenantId: "yourIdHere",
            uspaceReceiver: uspaceReceiver,
            channels: channels,
            subject: title,
            content: content,
            groupCode: "prewarning"
          };
          let object = { id: id, IsEarlywarning: "1", enable: "1" };
          let list = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.Buyers", object, "31ae1c7b");
          let result = sendMessage(messageInfo);
        }
        if (rangeDateNum_Day < 0) {
          let object = { id: id, IsEarlywarning: "2", enable: "0" };
          let list = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.Buyers", object, "31ae1c7b");
        }
      }
    } else {
      throw new Error("未查询到信息！");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });