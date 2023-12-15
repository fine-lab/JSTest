let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var param = request.data;
    var list = param.jdmxList;
    var date = param.Def5;
    var floor = param.Def7_name;
    var randomNumbers = batchGeneratorNumbers(list.length);
    //生成随机码
    for (var i = 0; i < list.length; i++) {
      var name = list[i].Def1;
      var phone = list[i].Def2;
      //业务逻辑的处理-短信发送
      sendMessage(phone, randomNumbers[i], date, floor);
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
exports({ entryPoint: MyAPIHandler });