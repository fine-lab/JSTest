let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var currentUser = JSON.parse(AppContext()).currentUser;
    var sysId = "yourIdHere";
    var tenantId = currentUser.tenantId;
    var userids = [currentUser.id];
    var result = listOrgAndDeptByUserIds(sysId, tenantId, userids);
    var resultJSON = JSON.parse(result);
    var userid;
    var username;
    if ("1" == resultJSON.status && resultJSON.data != null) {
      //根据当前用户信息去查询员工表
      var userData = resultJSON.data;
      //业务系统员工id
      userid = userData[currentUser.id].id;
      username = userData[currentUser.id].name;
    } else {
      throw new Error("获取员工信息异常");
    }
    var object = {
      reponseFk: request.id,
      //回复类型
      reponsetype_m: request.reponsetype,
      //处理状态
      dealing_situation_m: request.dealstatus,
      //回复内容
      content: request.reponsecontent,
      //附件
      files: request.file,
      //附件说明
      filesexplain: request.filedes,
      StaffNew: userid
    };
    var res = ObjectStore.insert("GT7611AT96.GT7611AT96.reponse", object, "05afb93b");
    //回复数量+1
    var reponse_num = request.reponse_num;
    if (reponse_num == undefined) {
      reponse_num = 0;
    }
    //无论是否已经查看都需要改次数
    var object = { id: request.id, reponse_num: reponse_num + 1 };
    var updateres = ObjectStore.updateById("GT7611AT96.GT7611AT96.abnormalevent", object);
    return { res: res, username: username };
  }
}
exports({ entryPoint: MyAPIHandler });