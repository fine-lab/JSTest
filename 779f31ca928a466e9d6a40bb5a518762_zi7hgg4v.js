let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, request) {
    var requestData = request.requestData;
    //很坑爹json对象获取属性id不行，必须采用截取字符串方式
    var id = substring(requestData, 8, 27);
    //根据id查询单据信息
    var sql = "select *,(select * from jdmxList) as jdmxList from GT2015AT1.GT2015AT1.wljd001 where id=" + id;
    var executeResult = ObjectStore.queryByYonQL(sql);
    var param = executeResult[0];
    var list = param.jdmxList;
    var date = param.Def5;
    var randomNumbers = batchGeneratorNumbers(list.length);
    //生成随机码
    for (var i = 0; i < list.length; i++) {
      var name = list[i].Def1;
      var phone = list[i].Def2;
      //业务逻辑的处理-短信发送
      sendMessage(phone, randomNumbers[i], date);
    }
    //发送短信接口
    function sendMessage(phone, code, date) {
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
        "在上海国际财富中心南塔29F或30F前台接待区办理接待手续。" +
        "如您进入办公区，请勿在办公区域内拍照、摄像、录音，除有“吸烟区”标识的区域外，其它区域均禁烟，祝您来访愉快。" +
        "疫期请配合保安登记、测温等工作，并自行配戴口罩，在接待人全程陪同下入办公区。应防疫需要，前台有权拒绝有风险的访客入办公区，敬请配合。";
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