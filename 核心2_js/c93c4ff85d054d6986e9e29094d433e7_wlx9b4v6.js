let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取当前日期
    var now = new Date();
    //指定几个月后
    var wantDate = new Date(now.setMonth(now.getMonth() + 1));
    var nowstr = now.getFullYear() + "-";
    if (wantDate.getMonth() + 1 < 10) {
      nowstr = nowstr + "0" + (wantDate.getMonth() + 1) + "-";
    } else {
      nowstr = nowstr + (wantDate.getMonth() + 1) + "-";
    }
    if (wantDate.getDate() < 10) {
      nowstr = nowstr + "0" + wantDate.getDate();
    } else {
      nowstr = nowstr + wantDate.getDate();
    }
    //查询收证合同数据--dr:0 状态：【闲置】、【已出证】
    var sql = "select * from GT60601AT58.GT60601AT58.certReceiContract where dr=0 and vstate in(1,2) and verifystate=2 and contract_due_date='" + nowstr + "'";
    var res = ObjectStore.queryByYonQL(sql);
    for (var i = 0; i < res.length; i++) {
      //存在合同到期数据则向部门主管级上级发出预警消息
      var uspaceReceiver = [];
      var data = res[i];
      var userID = data.creator;
      uspaceReceiver.push(userID);
      var sysId = "yourIdHere";
      var tenantId = "yourIdHere";
      var userids = [data.creator];
      var result = listOrgAndDeptByUserIds(sysId, tenantId, userids);
      var resultJSON = JSON.parse(result);
      var resultData = "";
      if ("1" == resultJSON.status && resultJSON.data != null) {
        var userData = resultJSON.data;
        resultData = userData[userID];
      }
      let func1 = extrequire("GT60601AT58.backDefaultGroup.getOpenApiToken");
      let resToken = func1.execute();
      var token = resToken.access_token;
      //根据部门ID获取部门详情
      var deptUrl = "https://www.example.com/" + token + "&id=" + resultData.deptId;
      //根据员工ID查询用户
      var staffUrl = "https://www.example.com/" + token;
      //获取下游来源单据是否有上游单据
      var contenttype = "application/json;charset=UTF-8";
      var message = "";
      var header = {
        "Content-Type": contenttype
      };
      var deptrst = "";
      var principal = "";
      var staffresponse = "";
      var staffrst = "";
      let deptResponse = postman("GET", deptUrl, JSON.stringify(header), null);
      let deptresponseobj = JSON.parse(deptResponse);
      if ("200" == deptresponseobj.code) {
        deptrst = deptresponseobj.data;
        principal = deptrst.principal;
        staffresponse = postman("GET", staffUrl + "&id=" + principal, JSON.stringify(header), null);
        let staffresponseobj = JSON.parse(staffresponse);
        if ("200" == staffresponseobj.code) {
          staffrst = staffresponseobj.data;
          uspaceReceiver.push(staffrst.user_id);
        }
      }
      var channels = ["uspace"];
      var title = "收证合同到期预警";
      var content = "收证合同号【" + data.receiContract_code + "】,30天后即将过期";
      var messageInfo = {
        sysId: "yourIdHere",
        tenantId: "yourIdHere",
        uspaceReceiver: uspaceReceiver,
        channels: channels,
        subject: title,
        content: content,
        groupCode: "prewarning"
      };
      var result = sendMessage(messageInfo);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });