let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var sql = "select * from AT15F164F008080007.AT15F164F008080007.DeviceManagement";
    var res = ObjectStore.queryByYonQL(sql, "developplatform");
    let func = extrequire("AT15F164F008080007.utils.getWayUrl");
    let funcres = func.execute(null);
    var gatewayUrl = funcres.gatewayUrl;
    for (var i = 0; i < res.length; i++) {
      var shebeibianma = res[i].shebeibianma;
      //根据设备编码 查询固定资产
      var sqlG = "select * from fa.fixedasset.FixedAssetsInfo where id ='" + shebeibianma + "'";
      var resSqlG = ObjectStore.queryByYonQL(sqlG, "fifa");
      var code = resSqlG[0].code;
      //下次校准日期
      var xiacixiaozhunriqi = res[i].xiacixiaozhunriqi;
      //下次检修时间
      var date1 = res[i].xiacixiaozhunriqi;
      //下次检修时间戳
      var xcTime = new Date(date1).getTime();
      //组装4个月前时间
      var s1 = new Date(date1);
      s1.setMonth(s1.getMonth());
      var year = s1.getFullYear();
      var month = s1.getMonth() + 1;
      var startDay = s1.getDate();
      month = month < 10 ? "0" + month : month;
      var startDate = year.toString() + "-" + month.toString() + "-" + startDay.toString();
      startDate = startDate.split("-");
      startDate = parseInt(startDate[0]) * 12 + parseInt(startDate[1]);
      //现在时间
      var aa = new Date();
      var year2 = aa.getFullYear();
      var month2 = aa.getMonth() + 1;
      var startDay2 = aa.getDate();
      var startDate2 = year2.toString() + "-" + month2.toString() + "-" + startDay2.toString();
      startDate2 = startDate2.split("-");
      startDate2 = parseInt(startDate2[0]) * 12 + parseInt(startDate2[1]);
      //求出月份差  (下次检修时间 - 现在时间)
      var num = Math.abs(startDate - startDate2);
      var xzTime = new Date().getTime();
      //前四个月时间
      var QianTime = new Date(startDate).getTime();
      if (xzTime >= QianTime && num <= 4) {
        var iddd = res[i].id;
        //根据主表id查询子表的提醒人
        var sql1 = "select * from AT15F164F008080007.AT15F164F008080007.DeviceManagement_tixingren where fkid ='" + iddd + "'";
        var res22 = ObjectStore.queryByYonQL(sql1, "developplatform");
        //查出来多选引用  循环发预警
        for (var a = 0; a < res22.length; a++) {
          var restixingren = res22[a].tixingren;
          //调用查询员工接口
          let url = gatewayUrl + "/yonbip/digitalModel/staff/detail?id=" + restixingren;
          let apiResponse = openLinker("GET", url, "AT15F164F008080007", JSON.stringify({}));
          var apiresult = JSON.parse(apiResponse);
          //用户电话
          var phone = apiresult.data.mobile;
          //截取电话 包前不包后
          var telephone = substring(phone, 4, 15);
          let body = {
            searchcode: telephone
          };
          let url1 = gatewayUrl + "/yonbip/uspace/users/search_page_list";
          let result2 = openLinker("POST", url1, "AT15F164F008080007", JSON.stringify(body));
          var apiresult2 = JSON.parse(result2);
          var userId = apiresult2.data.content[0].userId;
          //发送预警
          var uspaceReceiver = [userId];
          var channels = ["uspace"];
          var title = "设备管理预警通知";
          var content = " - 设备编码:" + code + ", - 到期时间" + xiacixiaozhunriqi;
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
        }
      } else {
        continue;
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });