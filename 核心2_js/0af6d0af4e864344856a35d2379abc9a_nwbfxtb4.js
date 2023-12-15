let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let data = request.data;
    if (data.managementClass != undefined || data.managementClass != null) {
      var wlfl = "select * from pc.cls.ManagementClass where id  = '" + data.managementClass + "'";
      var reswlfl = ObjectStore.queryByYonQL(wlfl, "productcenter");
      //查询物料自定义项
      var wlflzdy = "select * from pc.cls.ManagementClassDefine where id  = '" + data.managementClass + "'";
      var reswlflzdy = ObjectStore.queryByYonQL(wlflzdy, "productcenter");
      //查询员工
      var resyuangong;
      if (reswlflzdy[0].define3 != null || reswlflzdy[0].define3 != undefined) {
        var yuangong = "select * from bd.staff.StaffNew where id  = '" + reswlflzdy[0].define3 + "'";
        resyuangong = ObjectStore.queryByYonQL(yuangong, "ucf-staff-center");
      }
      return { resyuangong };
    } else {
      throw new Error("不存在");
    }
  }
}
exports({ entryPoint: MyAPIHandler });