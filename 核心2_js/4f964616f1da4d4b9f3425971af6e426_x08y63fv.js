let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(request) {
    var rows = request.data;
    //获取当前用户的身份信息-----------
    var currentUser = JSON.parse(AppContext()).currentUser; //通过上下文获取当前的用户信息
    var sysId = "yourIdHere";
    var tenantId = currentUser.tenantId;
    var userids = [currentUser.id];
    var result = listOrgAndDeptByUserIds(sysId, tenantId, userids); //获取当前用户的组织和部门信息
    var resultJSON = JSON.parse(result);
    var userid;
    if ("1" == resultJSON.status && resultJSON.data != null) {
      //根据当前用户信息去查询员工表
      var userData = resultJSON.data;
      //业务系统员工id
      userid = userData[currentUser.id].id; //员工id
    } else {
      throw new Error("获取员工信息异常");
    }
    var abnormalevent = [];
    rows.forEach((row) => {
      abnormalevent.push(row.id);
    });
    var object = abnormalevent.join("','");
    //查询数据库
    var sql = "select abnormalevent from GT20314AT119.GT20314AT119.gongxuCode0413 where abnormalevent in('" + object + "') and StaffNew='" + userid + "'";
    var res = ObjectStore.queryByYonQL(sql);
    var result = [];
    res.forEach((data) => {
      result.push(data.abnormalevent);
    });
    return { res: result };
  }
}
exports({ entryPoint: MyTrigger });