let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.request;
    //根据人员主键查询任职信息中的员工类别主键
    var psnclIdsql = "select psnclId from hred.staff.StaffJob where staffId = '" + id + "' and dr=0";
    var psnclId = ObjectStore.queryByYonQL(psnclIdsql, "hrcloud-staff-mgr");
    var lbid = psnclId[0].psnclId;
    //查询员工类别名称
    var psnclnamesql = "select name from bd.staff.PsnlCatg where id = '" + lbid + "' and dr=0";
    var psnclname = ObjectStore.queryByYonQL(psnclnamesql, "hrcloud-staff-mgr");
    var name = psnclname[0].name;
    return { psnclname: name, psnclId: lbid };
  }
}
exports({
  entryPoint: MyAPIHandler
});