let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //查询审核状态为已审核（verifystate = 2）单据
    var marketSql = "select * from GT54604AT1.GT54604AT1.barcode_application where verifystate = 2";
    var marketRes = ObjectStore.queryByYonQL(marketSql);
    var list = [];
    for (var i = 0; i < marketRes.length; i++) {
      //查询符合条件的详情单
      var detailsSql = "select * from GT54604AT1.GT54604AT1.barcode_details where barcode_application_id = " + marketRes[i].id;
      var detailsRes = ObjectStore.queryByYonQL(detailsSql);
      var code = marketRes[i].code;
      var regionalManagerName = marketRes[i].regionalManagerName;
      var creator = marketRes[i].creator;
      var tenantId = marketRes[i].tenant_id;
      var createTime = marketRes[i].createTime;
      if (detailsRes.length !== 0) {
        for (var j = 0; j < detailsRes.length; j++) {
          var startTime = detailsRes[j].startTime;
          var date = new Date();
          //年
          var year = date.getFullYear();
          //月
          var month = date.getMonth() + 1;
          month = month < 10 ? "0" + month : month;
          //日
          var day = date.getDate();
          day = day < 10 ? "0" + day : day;
          var nowTime = year + "-" + month + "-" + day;
          // 处理活动结束时间
          var dateStartTime = new Date(startTime);
          var oneMonthLater = new Date(dateStartTime);
          oneMonthLater.setDate(dateStartTime.getDate() + 31);
          var strOneMonthLater = new Date(oneMonthLater);
          var startYear = strOneMonthLater.getFullYear();
          var startMonth = strOneMonthLater.getMonth() + 1;
          startMonth = startMonth < 10 ? "0" + startMonth : startMonth;
          var startDay = strOneMonthLater.getDate();
          startDay = startDay < 10 ? "0" + startDay : startDay;
          var formatDate = startYear + "-" + startMonth + "-" + startDay;
          //对比oneMonthLater时间与当前时间是否相等
          if (formatDate === nowTime) {
            var msg = {
              code: code,
              regionalManagerName: regionalManagerName,
              creator: creator,
              tenantId: tenantId,
              createTime: createTime
            };
            list.push(msg);
          }
        }
      }
    }
    list.forEach((item) => {
      //发送消息
      var uspaceReceiver = [item.creator];
      var channels = ["uspace"];
      var title = "条码费核销提醒";
      var content = "温馨提示：" + item.regionalManagerName + "，你好，您于" + item.createTime + "提交的条码费申请单，单号为" + item.code + "，请及时提交核销申请~";
      var tenantId = item.tenantId;
      var messageInfo = {
        sysId: "yourIdHere",
        tenantId: tenantId,
        uspaceReceiver: uspaceReceiver,
        channels: channels,
        subject: title,
        content: content
      };
      var result = sendMessage(messageInfo);
    });
    return {};
  }
}
exports({ entryPoint: MyTrigger });