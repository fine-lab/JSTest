let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var timezone = 8; //目标时区时间，东八区
    // 本地时间和格林威治的时间差，单位为分钟
    var offset_GMT = new Date().getTimezoneOffset();
    // 本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
    var nowDate = new Date().getTime();
    var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
    var nowdateTime = date.getTime();
    var beforeDate = new Date(date);
    beforeDate.setDate(date.getDate() - 30);
    var agoDay = `${beforeDate.getFullYear()}-${beforeDate.getMonth() + 1 < 10 ? `0${beforeDate.getMonth() + 1}` : beforeDate.getMonth() + 1}-${beforeDate.getDate()}`;
    //当前日期
    var nowDay = `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${date.getDate()}`;
    throw new Error(JSON.stringify(agoDay) + "----" + JSON.stringify(nowDay));
    var productSql =
      "select product_coding,id, registration_certificate_effective_date from AT161E5DFA09D00001.AT161E5DFA09D00001.productInformation where registration_certificate_effective_date >= '" +
      agoDay +
      "' and registration_certificate_effective_date <='" +
      nowDay +
      "'";
    var productResult = ObjectStore.queryByYonQL(productSql);
    if (productResult.length == 0) {
      throw new Error("查询产品列表当前日期30天之前的数据为空。");
    } else {
      for (var i = 0; i < productResult.length; i++) {
        // 调用租户下用户身份列表查询
        let func1 = extrequire("AT161E5DFA09D00001.apiFunction.getTenantId");
        let res = func1.execute(null);
        var productDetails = productResult[i];
        // 产品编码
        var product_coding = productDetails.product_coding;
        // 产品Id
        var id = productDetails.id;
        // 产品注册证有效期
        var registDate = productDetails.registration_certificate_effective_date;
        var timezone = 8; //目标时区时间，东八区
        // 本地时间和格林威治的时间差，单位为分钟
        var offset_GMT = new Date().getTimezoneOffset();
        // 本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
        var nowDate = new Date().getTime();
        var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
        // 注册证有效期时间戳
        var beginDate = new Date(registDate).getTime();
        // 当前日期时间戳
        var endDate = new Date(date).getTime();
        // 转化为天数
        var days = (beginDate - endDate) / (1000 * 60 * 60 * 24);
        // 日期向上取整
        var day = Math.ceil(days);
        // 提前30天发送预警
        // 提前一个月（30天）显示即将到期的相关数据
        if (day <= 30 && day >= 0) {
          var uspaceReceiver = res.arr;
          var channels = ["uspace"];
          var title = "产品注册证有效期预警";
          if (day != 0) {
            var content = "产品编码：'" + product_coding + "',产品注册证有效还有:'" + day + "'天到期";
          } else {
            var content = "产品注册证有效今天到期";
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
          var Updateres = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.productInformation", object, "3f0c64e9");
        } else if (day < 0) {
          // 说明当前时间已经小于有效期，已过期
          // 许可证到期之后修改是否在预警有效期状态为否
          var object = { id: id, IsEarlywarning: 2, enable: 0 };
          var Updateres = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.productInformation", object, "3f0c64e9");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });