let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //删除实体
    var object = {
      DengLuMing: request.loginName
    };
    var res = ObjectStore.deleteByMap("GT37846AT3.GT37846AT3.RZH_901", object, request.companyCode);
    //添加实体
    var object = {
      XingMing: request.name,
      DengLuMing: request.loginName,
      Role: request.role,
      shifubangdingweixin: request.isWeixin,
      WeiXinID: request.wixinId,
      PassWD: request.password,
      Enable_Date: request.enableDate,
      Disable_Date: request.disabl_Date,
      Reg_Date: request.regDate
    };
    var res = ObjectStore.insert("GT37846AT3.GT37846AT3.RZH_901", object, request.companyCode);
    return { status: 1 };
  }
}
exports({ entryPoint: MyAPIHandler });