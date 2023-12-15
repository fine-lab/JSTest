let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //查询审核状态单据主表和明细
    var sql = "select *,(select * from jdmxList) as jdmxList from GT2015AT1.GT2015AT1.wljd001 where verifystate=2";
    var res = ObjectStore.queryByYonQL(sql);
    var conditionResult = new Array();
    var currentDate = formatTimeToYYYYMMDD();
    for (var i = 0; i < res.length; i++) {
      var data = res[i];
      //来访日期
      var visitDate = data.Def5;
      //来访明细
      var details = data.jdmxList;
      //来访天数
      var visitDays = data.Def6;
      if (visitDate != null && details != null && details.length > 0 && visitDays > 1) {
        //调度任务定时发送短信需要的条件是来访多日，来访日期不为空，且来访明细不为空
        //判断当前时间是在调度任务内时间 来访日期=<系统时间<来访日期+来访天数
        var durationDate = formatTimeToYYYYMMDD(visitDate, visitDays - 1);
        if (currentDate >= visitDate && currentDate < durationDate) {
          conditionResult.push(data);
        }
      }
    }
    //来访日期等于当前系统日期+1
    var visitDate = formatTimeToYYYYMMDD(currentDate, 1);
    for (var i = 0; i < conditionResult.length; i++) {
      var data = conditionResult[i];
      var details = data.jdmxList;
      //来访地点
      var floor = data.Def7_name;
      //批量生成随机码
      var randomNumbers = batchGeneratorNumbers(details.length);
      for (var j = 0; j < details.length; j++) {
        var phone = details[j].Def2;
        //发送短信
        sendMessage(phone, randomNumbers[j], visitDate, floor);
      }
    }
    //格式化时间
    function formatTimeToYYYYMMDD(timeStr, intervalDay) {
      var date = new Date();
      if (timeStr) date = new Date(timeStr);
      if (intervalDay) date = new Date(+date + intervalDay * 24 * 60 * 60 * 1000);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (day >= 0 && day <= 9) {
        day = "0" + day;
      }
      let currentFormatDate = year + "-" + month + "-" + day;
      return currentFormatDate;
    }
    //发送短信接口
    function sendMessage(phone, code, date, floor) {
      var url = "http://119.3.126.249/api/sns/sms/send/v2";
      var dateInfo = getDateInfo(date);
      var year = dateInfo.year;
      var month = dateInfo.month;
      var day = dateInfo.day;
      var content =
        "【宇量昇】尊敬的访客，请持本人身份证或其它有效证件和验证码" +
        code +
        "于" +
        year +
        "年" +
        month +
        "月" +
        day +
        "在上海" +
        floor +
        "前台接待区办理接待手续。" +
        "如您进入办公区，请勿在办公区域内拍照、摄像、录音，除有“吸烟区”标识的区域外，其它区域均禁烟，祝您来访愉快!";
      var header = { "X-HW-ID": "27849afb4c3b4b5da367e87453d5d81a", "X-HW-APPKEY": "xJrmSF3Hma472Yw6qLLjRQ==", "Content-type": "application/json" };
      var body = { app_id: "youridHere", mobiles: phone, content: content };
      let apiResponse = postman("POST", url, JSON.stringify(header), JSON.stringify(body));
      let res = JSON.parse(apiResponse);
      return res;
    }
    //获取日期明细信息
    function getDateInfo(date) {
      var d = new Date(date);
      var year = d.getFullYear();
      var month = d.getMonth() + 1;
      var day = d.getDate();
      var result = { year: year, month: month, day: day };
      return result;
    }
    //批量生成六位随机数
    function batchGeneratorNumbers(num) {
      var result = new Array();
      for (var k = 0; k < num; k++) {
        var str = "";
        for (var i = 1; i <= 6; i++) {
          str = str + Math.floor(Math.random() * 10);
        }
        result.push(str);
      }
      return result;
    }
    return { data: "success" };
  }
}
exports({ entryPoint: MyTrigger });