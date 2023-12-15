let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取当前用户的身份信息-----------
    var currentUser = JSON.parse(AppContext()).currentUser;
    var sysId = "yourIdHere";
    var tenantId = currentUser.tenantId;
    var userids = [currentUser.id];
    var result = listOrgAndDeptByUserIds(sysId, tenantId, userids);
    var resultJSON = JSON.parse(result);
    var userid;
    var usercode;
    var allData;
    var deptid;
    var deptCode;
    var orgid;
    if ("1" == resultJSON.status && resultJSON.data != null) {
      //根据当前用户信息去查询员工表
      var userData = resultJSON.data;
      //业务系统员工id
      userid = userData[currentUser.id].id;
      deptid = userData[currentUser.id].deptId;
      deptCode = userData[currentUser.id].deptCode;
      usercode = userData[currentUser.id].code;
      orgid = userData[currentUser.id].deptId;
    } else {
      throw new Error("获取员工信息异常");
    }
    var result = [];
    var deptCode2 = substring(deptCode, 0, 2);
    if ("02" !== deptCode2) {
      allData = "all";
    }
    if ("02" === deptCode) {
      allData = "allmess";
    }
    //获取部门信息  判断是否是部门负责人   根据部门ID分页获取租户下员工信息
    var token = "";
    let func1 = extrequire("GT46349AT1.backDefaultGroup.gettoken");
    let res = func1.execute(request);
    token = res.access_token;
    let apiResponsedept = postman("get", "https://www.example.com/" + token + "&id=" + deptid, null, null);
    var deptjson = JSON.parse(apiResponsedept);
    var deptrscode = deptjson.code;
    if (deptrscode !== "200") {
      throw new Error("查询错误" + deptjson.message + deptid);
    } else {
      var principal = deptjson.data.principal;
      //如果登录人和部门负责人相同 则可以看部门下全部人的单据
      if (principal === userid) {
        //查看部门下的人员
        var hmd_contenttype = "application/json;charset=UTF-8";
        let header = {
          "Content-Type": hmd_contenttype
        };
        var bodyhead = {
          index: 1,
          size: 100,
          deptIdList: [deptid],
          flag: "true"
        };
        let apiResponsedeptpson = postman("post", "https://www.example.com/" + token, JSON.stringify(header), JSON.stringify(bodyhead));
        var deptpsonjson = JSON.parse(apiResponsedeptpson);
        var deptpsonjsonmesscode = deptpsonjson.code;
        if (deptpsonjsonmesscode !== "200") {
          throw new Error("错误" + deptpsonjson.message + JSON.stringify(bodyhead));
        } else {
          var psondatas = deptpsonjson.data.content;
          for (var x = 0; x < psondatas.length; x++) {
            result.push(psondatas[x].id);
          }
        }
      } else {
        result.push(userid);
      }
    }
    return { res: result, allData: allData, usercode: usercode, orgid: orgid };
  }
}
exports({ entryPoint: MyAPIHandler });