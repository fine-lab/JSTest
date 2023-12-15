let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantId;
    var vistor_name = request.vistor_name;
    var vistor_id = request.certificate_num;
    var certificate_num = request.certificate_num;
    var picinfo = request.picinfo;
    var devicegroup = request.devicegroup;
    let data = {
      vistor_name: vistor_name,
      vistor_id: certificate_num,
      certificate_num: certificate_num,
      picinfo: picinfo,
      devicegroup: devicegroup
    };
    let url = "https://www.example.com/";
    let apiResponse = postman("POST", url, null, JSON.stringify(data));
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });