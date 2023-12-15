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
    var sql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.ClientInformation";
    var res = ObjectStore.queryByYonQL(sql, "developplatform");
    if (res.length > 0) {
      for (var i = 0; i < res.length; i++) {
        // 获取友互通ID
        let yhtURL = extrequire("AT161E5DFA09D00001.apiFunction.getTenantId");
        let yht = yhtURL.execute(require);
        let yhtList = yht.resultStr.data.list;
        var id = res[i].id;
        // 获取友户通Id
        let yhtUserId = yhtList[0].yhtUserId;
        // 创建人yhtID
        var creator = res[i].creator;
        // 委托方企业编码
        var clientCode = res[i].clientCode;
        // 许可证有效期
        var expiryDate = res[i].expiryDate;
        var expiryDate_Date = new Date(expiryDate);
        // 开始委托时间
        var fromDate = res[i].fromDate;
        // 停止委托时间
        var toDate = res[i].toDate;
        // 开始委托时间转时间戳
        var fromDate_Date = new Date(fromDate);
        var fromDate_Time = fromDate_Date.getTime();
        // 停止委托时间转时间戳
        var toDate_Date = new Date(toDate);
        var toDate_Time = toDate_Date.getTime();
        // 有效期转时间戳
        var expiryDate_Time = expiryDate_Date.getTime();
        var dayNum = (toDate_Time - fromDate_Time) / (1000 * 3600 * 24);
        // 有效期减去当前时间所剩天数
        var rangeDateNum = (expiryDate_Time - date_Time) / (1000 * 3600 * 24);
        var rangeDateNum_Day = Math.ceil(rangeDateNum);
        if (rangeDateNum_Day <= 90 && rangeDateNum_Day >= 0) {
          let uspaceReceiver = ["1a591623-4800-412a-ad38-d0572e7d583a"];
          let channels = ["uspace"];
          let dis = new Big(rangeDateNum_Day);
          let day = dis.abs();
          let title = "委托方企业经营许可证到期提醒！";
          let content = "请注意！委托企业编码为：" + clientCode + "的经营许可证还有" + day + "天到期！";
          let messageInfo = {
            sysId: "yourIdHere",
            tenantId: "yourIdHere",
            uspaceReceiver: uspaceReceiver,
            channels: channels,
            subject: title,
            content: content,
            groupCode: "prewarning"
          };
          let result = sendMessage(messageInfo);
          let object = { id: id, IsEarlywarning: "1" };
          let item = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.ClientInformation", object, "d3e1247e");
        }
        if (rangeDateNum_Day < 0) {
          let uspaceReceiver = ["3ed985bc-109f-4cfc-a4cb-9e91619ce350"];
          let channels = ["uspace"];
          let dis = new Big(rangeDateNum_Day);
          let day = dis.abs();
          let title = "委托方企业经营许可证过期消息通知！";
          let content = "请注意！委托企业编码为：" + clientCode + "的经营许可证已经过期" + day + "天！";
          let messageInfo = {
            sysId: "yourIdHere",
            tenantId: "yourIdHere",
            uspaceReceiver: uspaceReceiver,
            channels: channels,
            subject: title,
            content: content,
            groupCode: "prewarning"
          };
          let result = sendMessage(messageInfo);
          let object = { id: id, IsEarlywarning: "2" };
          let item = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.ClientInformation", object, "d3e1247e");
        }
        if (dayNum <= 90 && dayNum >= 0) {
          let uspaceReceiver = ["3ed985bc-109f-4cfc-a4cb-9e91619ce350"];
          let channels = ["uspace"];
          let dis = new Big(dayNum);
          let day = dis.abs();
          let title = "委托方企业委托停止时间到期提醒！";
          let content = "请注意！委托企业编码为：" + clientCode + "的委托停止时间还有" + day + "天到期！";
          let messageInfo = {
            sysId: "yourIdHere",
            tenantId: "yourIdHere",
            uspaceReceiver: uspaceReceiver,
            channels: channels,
            subject: title,
            content: content,
            groupCode: "prewarning"
          };
          let result = sendMessage(messageInfo);
          let object = { id: id, IsEarlywarning: "1" };
          let item = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.ClientInformation", object, "d3e1247e");
        }
        if (dayNum < 0) {
          let uspaceReceiver = ["3ed985bc-109f-4cfc-a4cb-9e91619ce350"];
          let channels = ["uspace"];
          let dis = new Big(dayNum);
          let day = dis.abs();
          let title = "委托方企业委托停止时间过期消息通知！";
          let content = "请注意！委托企业编码为：" + clientCode + "的委托停止时间已经过期" + day + "天！";
          let messageInfo = {
            sysId: "yourIdHere",
            tenantId: "yourIdHere",
            uspaceReceiver: uspaceReceiver,
            channels: channels,
            subject: title,
            content: content,
            groupCode: "prewarning"
          };
          let object = { id: id, IsEarlywarning: "2", enable: 0 };
          let item = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.ClientInformation", object, "d3e1247e");
        }
      }
    } else {
      throw new Error("查询委托方信息为空，请检查");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });