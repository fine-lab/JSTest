let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //根据yhtUserId 查询员工ID
    let yhtUserId = request.yhtUserId;
    let token = request.token;
    let queryStaffByUserId = extrequire("GT32996AT2.OpenAPI.queryStaffByUserId");
    let staffInfos = queryStaffByUserId.execute({ token, yhtUserId });
    //查询员工详情
    let isstaff = staffInfos && staffInfos.data && staffInfos.data.data && staffInfos.data.data.length > 0;
    let staffInfo = isstaff ? staffInfos.data.data[0] : {};
    if (isstaff) {
      let queryStaffDetail = extrequire("GT32996AT2.OpenAPI.queryStaffDetail");
      let staffDetail = queryStaffDetail.execute({ token, staffId: staffInfo.id });
      let hbmanager = {
        org_id: staffInfo.org_id,
        partnerName: staffInfo.org_id_name,
        hbmanager: staffDetail.name,
        mobile: staffDetail.mobile,
        email: staffDetail.email,
        yhtUserId: yhtUserId,
        staffId: staffInfo.id,
        staffCode: staffDetail.code
      };
      var res = ObjectStore.insert("GT32996AT2.GT32996AT2.list_hbmanager", hbmanager);
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });