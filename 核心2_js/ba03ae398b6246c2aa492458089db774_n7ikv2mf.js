let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //根据角色id查询身份列表
    let getAccessToken = extrequire("GT32996AT2.OpenAPI.getAccessToken");
    let paramToken = {};
    let resToken = getAccessToken.execute(paramToken);
    let token = resToken.access_token;
    let body = {
      roleId: "yourIdHere",
      pageNumber: 1,
      pageSize: 3000
    };
    let strResponse = postman("post", "https://www.example.com/" + token, null, JSON.stringify(body));
    let resp = JSON.parse(strResponse);
    let indentifydata = resp.data.list;
    var result = [];
    var hbmanagerList = [];
    for (var i1 = 0; i1 < indentifydata.length; i1++) {
      //根据yhtUserId 查询员工ID
      let yhtUserId = indentifydata[i1].yhtUserId;
      let queryStaffByUserId = extrequire("GT32996AT2.OpenAPI.queryStaffByUserId");
      let staffInfos = queryStaffByUserId.execute({ token, yhtUserId });
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
        hbmanagerList.push(hbmanager);
      }
    }
    var res = ObjectStore.insertBatch("GT32996AT2.GT32996AT2.list_hbmanager", hbmanagerList);
    return { res };
  }
}
exports({ entryPoint: MyTrigger });