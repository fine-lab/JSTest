let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, request) {
    var requestData = request.requestData;
    //很坑爹json对象获取属性id不行，必须采用截取字符串方式
    var id = substring(requestData, 8, 27);
    //根据id查询单据信息
    var sql = "select * from GT2015AT1.GT2015AT1.gwc001 where id=" + id;
    var executeResult = ObjectStore.queryByYonQL(sql);
    var param = executeResult[0];
    //业务逻辑的处理-短信发送 发送司机
    sendDriverMessage(param);
    //发送使用人
    sendUserMessage(param);
    //发送司机短信接口
    function sendDriverMessage(param) {
      var url = "http://119.3.126.249/api/sns/sms/send/v2";
      //根据员工id 获取姓名以及工号
      let sqlStaff = "select name,code ,id  from bd.staff.StaffNew where id=" + param.shenqingren;
      var staffObj = ObjectStore.queryByYonQL(sqlStaff, "ucf-staff-center");
      var nameandaccount = staffObj[0].name + " " + staffObj[0].code; //姓名+工号
      var mobile = param.Def2; //手机号
      var datestr = param.Def4;
      var address = param.xiachedidian1; //地址
      var note = param.Def10; //备注
      var phone = param.lianxifangshi;
      var content =
        "【宇量昇】ERP派车单，乘客：" + nameandaccount + "，电话：" + mobile + "，用车开始时间：" + datestr + "，上车地点：上海国际财富中心南塔，下车地点：" + address + "。（备注信息: " + note + ")";
      var header = { "X-HW-ID": "27849afb4c3b4b5da367e87453d5d81a", "X-HW-APPKEY": "xJrmSF3Hma472Yw6qLLjRQ==", "Content-type": "application/json" };
      var body = { app_id: "youridHere", mobiles: phone, content: content };
      let apiResponse = postman("POST", url, JSON.stringify(header), JSON.stringify(body));
      let res = JSON.parse(apiResponse);
      return res;
    }
    //发送使用人短信接口
    function sendUserMessage(param) {
      var url = "http://119.3.126.249/api/sns/sms/send/v2";
      var carno = param.chepaihao; //车牌号  未知
      var carname = param.ziduan20; //司机名称 未知
      var mobile = param.lianxifangshi; //手机号
      var datestr = param.Def4; //用车开始时间
      var address = param.xiachedidian1; //地址
      var note = param.Def10; //备注
      var phone = param.Def2;
      var content =
        "【宇量昇】已派车，司机：" +
        carname +
        "，电话：" +
        mobile +
        "，车牌号：" +
        carno +
        "，用车开始时间：" +
        datestr +
        "，上车地点：上海国际财富中心南塔，下车地点：" +
        address +
        "。（备注信息: " +
        note +
        ")";
      var header = { "X-HW-ID": "27849afb4c3b4b5da367e87453d5d81a", "X-HW-APPKEY": "xJrmSF3Hma472Yw6qLLjRQ==", "Content-type": "application/json" };
      var body = { app_id: "youridHere", mobiles: phone, content: content };
      let apiResponse = postman("POST", url, JSON.stringify(header), JSON.stringify(body));
      let res = JSON.parse(apiResponse);
      return res;
    }
    return { data: "success" };
  }
}
exports({ entryPoint: MyTrigger });