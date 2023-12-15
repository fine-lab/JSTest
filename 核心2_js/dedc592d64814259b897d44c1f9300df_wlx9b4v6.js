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
    var allData;
    var deptid;
    var deptCode;
    var orgid;
    var usercode;
    var detpids = [];
    if ("1" == resultJSON.status && resultJSON.data != null) {
      //根据当前用户信息去查询员工表
      var userData = resultJSON.data;
      //业务系统员工id
      userid = userData[currentUser.id].id;
      deptid = userData[currentUser.id].deptId;
      deptCode = userData[currentUser.id].deptCode;
      detpids.push(deptid);
      usercode = userData[currentUser.id].code;
      if ("014" === deptCode) {
        deptCode = "015";
        deptid = "youridHere";
        detpids.push(deptid);
      }
      orgid = userData[currentUser.id].orgId;
    } else {
      throw new Error("获取员工信息异常");
    }
    var result = [];
    //王霞可以看全部
    if ("002" === deptCode || "001" === deptCode || "QZB0014" === usercode) {
      allData = "allmess";
    }
    var token = "";
    let func1 = extrequire("GT56492AT34.backDefaultGroup.gettoken");
    let res = func1.execute(request);
    token = res.access_token;
    //判断是不是管理员
    let apiResponseadmin = postman("get", "https://www.example.com/" + token + "&yhtUserId=" + userids, null, null);
    var adminjson = JSON.parse(apiResponseadmin);
    var admincode = adminjson.code;
    if (admincode === "0") {
    } else if (admincode === "200") {
      allData = "all";
    } else {
      throw new Error("判断是不是管理员查询错误" + adminjson.message);
    }
    //获取部门信息  判断是否是部门负责人   根据部门ID分页获取租户下员工信息
    let apiResponsedept = postman("get", "https://www.example.com/" + token + "&id=" + deptid, null, null);
    var deptjson = JSON.parse(apiResponsedept);
    var deptrscode = deptjson.code;
    if (deptrscode !== "200") {
      throw new Error("部门信息查询错误" + deptjson.message + deptid);
    } else {
      var principal = deptjson.data.principal;
      //如果登录人和部门负责人相同 则可以看部门下全部人的单据
      var hmd_contenttype = "application/json;charset=UTF-8";
      let header = {
        "Content-Type": hmd_contenttype
      };
      if (principal === userid) {
        //判断部门是否有下级部门
        var depttwo = {
          externalData: {
            parentorgid: deptid,
            enable: ["1"]
          }
        };
        let apiResponsedepttwo = postman("post", "https://www.example.com/" + token, JSON.stringify(header), JSON.stringify(depttwo));
        var depttwopsonjson = JSON.parse(apiResponsedepttwo);
        var epttwojsonmesscode = depttwopsonjson.code;
        if (epttwojsonmesscode !== "200") {
          throw new Error("判断部门是否有下级部门错误" + depttwopsonjson.message + JSON.stringify(depttwo));
        } else {
          var depttwodatas = depttwopsonjson.data;
          if (depttwodatas !== undefined && null !== depttwodatas) {
            for (var x = 0; x < depttwodatas.length; x++) {
              var detpid1 = depttwodatas[x].id;
              detpids.push(detpid1);
            }
          } else {
            detpids.push(deptid);
          }
        }
        //查看部门下的人员
        var bodyhead = {
          index: 1,
          size: 100,
          deptIdList: detpids,
          flag: "true"
        };
        let apiResponsedeptpson = postman("post", "https://www.example.com/" + token, JSON.stringify(header), JSON.stringify(bodyhead));
        var deptpsonjson = JSON.parse(apiResponsedeptpson);
        var deptpsonjsonmesscode = deptpsonjson.code;
        if (deptpsonjsonmesscode !== "200") {
          throw new Error("查看部门下的人员误" + deptpsonjsonmesscode.message + JSON.stringify(bodyhead));
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
    var retorgid = [];
    var retdeptid = [];
    var useridrole;
    var doctype;
    if (request.custdoctype != undefined) {
      if ("1" == resultJSON.status && resultJSON.data != null) {
        var userDatas = resultJSON.data;
        useridrole = userDatas[currentUser.id].id;
        doctype = request.custdoctype;
        var resa = ObjectStore.queryByYonQL(
          "select kongzhiweidu,zuzhi,bumen from GT90840AT64.GT90840AT64.djsjqxmx where djsjqxsz_id in (select id from GT90840AT64.GT90840AT64.djsjqxsz where danjumingchenMain in (" +
            doctype +
            ") ) and renyuan='" +
            useridrole +
            "' "
        );
        for (var x = 0; x < resa.length; x++) {
          if (resa[x].kongzhiweidu == "1") {
            retorgid.push(resa[x].zuzhi);
          }
          if (resa[x].kongzhiweidu == "2") {
            retdeptid.push(resa[x].bumen);
          }
        }
      } else {
        throw new Error("获取员工信息异常");
      }
    }
    return { res: result, allData: allData, orgid: orgid, deptCode: deptCode, usercode: usercode, userid: userid, retorgid: retorgid, retdeptid: retdeptid };
  }
}
exports({ entryPoint: MyAPIHandler });