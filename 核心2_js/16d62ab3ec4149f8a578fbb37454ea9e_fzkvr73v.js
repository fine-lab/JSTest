let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    console.log("--------------------");
    console.log("--------------------");
    var vistor_name = request.vistor_name;
    var vistor_id = request.certificate_num;
    var certificate_num = request.certificate_num;
    var picinfo = request.picinfo;
    var devicegroup = request.devicegroup;
    var appointment_time = request.appointment_time;
    var effective_day = request.effective_day;
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantId;
    console.log("--------------------");
    console.log("--------------------");
    console.log("--------------------");
    let data = {
      vistor_name: vistor_name,
      vistor_id: certificate_num,
      certificate_num: certificate_num,
      picinfo: picinfo,
      devicegroup: devicegroup,
      effective_day: effective_day,
      appointment_time: appointment_time,
      tid: tid
    };
    let url = "https://www.example.com/";
    let apiResponse = postman("POST", url, null, JSON.stringify(data));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });