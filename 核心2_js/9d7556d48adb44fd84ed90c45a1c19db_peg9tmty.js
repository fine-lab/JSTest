let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var enterSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.Information_production";
    var enterResult = ObjectStore.queryByYonQL(enterSql, "developplatform");
    if (enterResult == 0) {
      throw new Error("查询生产信息为空，请检查！");
    } else {
      for (var i = 0; i < enterResult.length; i++) {
        // 调用租户下用户身份列表查询
        let func1 = extrequire("AT161E5DFA09D00001.apiFunction.getTenantId");
        let res = func1.execute(null);
        var dataList = res.resultStr.data.list;
        for (var x = 0; x < dataList.length; x++) {
          // 获取友户通Id
          var yhtUserId = dataList[x].yhtUserId;
          var enterDetails = enterResult[i];
          var id = enterDetails.id;
          // 生产企业信息编号
          var production_numbers = enterDetails.production_numbers;
          // 获取许可证/备案凭证有效期
          var production_validity = enterDetails.production_validity;
          // 有效期转为时间戳
          var beginDate = new Date(production_validity).getTime();
          var timezone = 8; //目标时区时间，东八区
          // 本地时间和格林威治的时间差，单位为分钟
          var offset_GMT = new Date().getTimezoneOffset();
          // 本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
          var nowDate = new Date().getTime();
          var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
          // 当前日期时间戳
          var endDate = new Date(date).getTime();
          // 转化为天数
          var days = (beginDate - endDate) / (1000 * 60 * 60 * 24);
          // 日期向上取整
          var day = Math.ceil(days);
          // 提前一个月（30天）显示即将到期的相关数据
          if (day <= 30 && day >= 0) {
            var uspaceReceiver = [yhtUserId];
            var channels = ["uspace"];
            var title = "生产企业信息有效期预警";
            if (day != 0) {
              var content = "生产企业编码：'" + production_numbers + "',许可证有效期还有:'" + day + "'天到期";
            } else {
              var content = "许可证有效期今天到期";
            }
            var messageInfo = {
              sysId: "yourIdHere",
              tenantId: "yourIdHere",
              uspaceReceiver: uspaceReceiver,
              channels: channels,
              subject: title,
              content: content,
              groupCode: "prewarning"
            };
            var result = sendMessage(messageInfo);
            var object = { id: id, IsEarlywarning: "1" };
            var Updateres = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.Information_production", object, "39e50d32");
          } else if (day < 0) {
            // 说明当前时间已经小于有效期，过期
            // 许可证到期之后修改是否在预警有效期状态为否
            var object = { id: id, IsEarlywarning: "2", enable: 0 };
            var Updateres = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.Information_production", object, "39e50d32");
          }
        }
      }
    }
  }
}
exports({ entryPoint: MyTrigger });