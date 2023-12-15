let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var code = request.body.data.code;
    //员工保存
    let staffSave = extrequire("GT30667AT8.user.createStaff");
    let resStaffSave = staffSave.execute(request);
    var resStaffResult = resStaffSave.res.res;
    if (resStaffResult.data == undefined || resStaffResult.data.id == undefined) throw new Error(resStaffResult.message);
    var staffid = resStaffResult.data.id;
    var staffCode = resStaffResult.data.code;
    //启用员工
    var eableBody = {
      body: {
        data: {
          enable: 1,
          id: staffid
        }
      }
    };
    let staffEnable = extrequire("GT30667AT8.user.enableStaff");
    let resStaffEnable = staffEnable.execute(eableBody);
    var resEnableResult = resStaffEnable.res.res;
    if (resEnableResult.data == undefined || resEnableResult.data.user_id == undefined) throw new Error(resEnableResult.message);
    var user_id = resEnableResult.data.user_id;
    //绑定用户身份
    var bindBody = {
      body: {
        staffCodeUserIdMap: {
          [staffCode]: user_id
        }
      }
    };
    let userBind = extrequire("GT30667AT8.user.bindUserByStaffCode");
    let resUserBind = userBind.execute(bindBody);
    var accept = resUserBind.res;
    return { accept: resUserBind, info: { workerid: staffCode, userid: user_id, code: code } };
  }
}
exports({ entryPoint: MyAPIHandler });