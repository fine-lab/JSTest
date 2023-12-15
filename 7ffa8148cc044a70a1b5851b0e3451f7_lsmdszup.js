let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    if (request.YeWu_state != "3") {
      var Role = request.Role_num;
      var Role_name = "";
      var sql = "";
      var name = request.Name;
      var phone = request.Phone;
      var Fh_code = request.Fh_code;
      if (Role === 1) {
        Role_name = "收货人";
      } else if (Role === 2) {
        Role_name = "库管员";
      } else if (Role === 3) {
        Role_name = "司机";
      } else if (Role === 4) {
        Role_name = "销售人员";
      }
      var object = {
        Name: request.Name,
        Phone: request.Phone,
        Role_num: Role_name,
        Car_num: request.Car_num,
        Location_time: request.Location_time,
        Pubufts: request.Pubufts,
        Location: request.Location,
        Tr_type1: request.Tr_type1,
        sign: request.sign,
        sign2: request.sign2,
        rzh01_id: request.RZH_11_id
      };
      //添加司机联系电话
      if (Role === 3) {
        var updateWrapper = new Wrapper();
        updateWrapper.eq("Fh_code", Fh_code);
        //待更新字段内容
        var toUpdate = {
          Drivername: name,
          DriverPhone: phone,
          YeWu_state: "2"
        };
        var res = ObjectStore.update("AT175A93621C400009.AT175A93621C400009.rzh01", toUpdate, updateWrapper, "rzh01");
      }
      var res = ObjectStore.insert("AT175A93621C400009.AT175A93621C400009.rzh03", object);
      return { request: request, state: "成功" };
    } else {
      return { request: "失败" };
    }
  }
}
exports({ entryPoint: MyAPIHandler });