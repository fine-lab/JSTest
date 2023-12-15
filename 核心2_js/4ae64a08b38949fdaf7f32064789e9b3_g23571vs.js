let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //查询审核状态为已审核（verifystate = 2）单据
    var marketSql = "select * from GT54604AT1.GT54604AT1.market_application where verifystate = 2";
    var marketRes = ObjectStore.queryByYonQL(marketSql);
    var list = [];
    for (var i = 0; i < marketRes.length; i++) {
      //查询符合条件的详情单
      var detailsSql =
        "select * from GT54604AT1.GT54604AT1.market_details where market_application_id = " + marketRes[i].id + " and  writeOffMethod = '1' and marketType in ('2','3','4','5','6','7','8','9')";
      var detailsRes = ObjectStore.queryByYonQL(detailsSql);
      var code = marketRes[i].code;
      var regionalManagerName = marketRes[i].regionalManagerName;
      var creator = marketRes[i].creator;
      var tenantId = marketRes[i].tenant_id;
      var createTime = marketRes[i].createTime;
      if (detailsRes.length !== 0) {
        for (var j = 0; j < detailsRes.length; j++) {
          var time = detailsRes[j].activityEndTime;
          var strEndTime = time.split(" ")[0];
          var date = new Date();
          //年
          var year = date.getFullYear();
          //月
          var month = date.getMonth() + 1;
          //日
          var day = date.getDate();
          var nowTime = year + "-" + month + "-" + day;
          // 处理活动结束时间
          var dateEndTime = new Date(strEndTime);
          var oneMonthLater = new Date(dateEndTime);
          oneMonthLater.setDate(dateEndTime.getDate());
          var strOneMonthLater = new Date(oneMonthLater);
          var formatDate = strOneMonthLater.getFullYear() + "-" + (strOneMonthLater.getMonth() + 1) + "-" + strOneMonthLater.getDate();
          //对比oneMonthLater时间与当前时间是否相等
          if (formatDate === "2021-11-29") {
            var sendMessage = {
              code: code,
              regionalManagerName: regionalManagerName,
              creator: creator,
              tenantId: tenantId,
              createTime: createTime
            };
          }
        }
      }
    }
    var uspaceReceiver = ["d8d26a73-b9d8-4299-aa40-f5c185897f2c"];
    var channels = ["uspace"];
    var title = "市场费核销提醒";
    var content = "温馨提示：" + "chenjianxin" + "，你好，您于" + "2021-11-29" + "提交的市场费申请单，单号为" + "item.code" + "，请及时提交核销申请~";
    var tenantId = "yourIdHere";
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: tenantId,
      uspaceReceiver: uspaceReceiver,
      channels: channels,
      subject: title,
      content: content
    };
    var result = sendMessage(messageInfo);
    return {};
  }
}
exports({ entryPoint: MyTrigger });