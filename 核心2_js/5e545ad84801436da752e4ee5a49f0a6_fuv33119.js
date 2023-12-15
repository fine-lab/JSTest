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
    if ("1" == resultJSON.status && resultJSON.data != null) {
      //根据当前用户信息去查询员工表
      var userData = resultJSON.data;
      //业务系统员工id
      userid = userData[currentUser.id].id;
      deptid = userData[currentUser.id].deptId;
      deptCode = userData[currentUser.id].deptCode;
    } else {
      throw new Error("获取员工信息异常");
    }
    var result = [];
    if ("B01" === deptCode) {
      allData = "allmess";
    }
    var token = "";
    let func1 = extrequire("GT50937AT1.backDefaultGroup.gettoken");
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
      throw new Error("查询错误" + deptjson.message + deptid);
    } else {
      var detpids = [];
      detpids.push(deptid);
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
          throw new Error("错误" + depttwopsonjson.message + JSON.stringify(depttwo));
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
    var listrole = [
      "f8f067d9-52f9-4a79-a936-08bf2ae35359", //库管员
      "e49da630-154f-4270-b4e3-93007c34f63b", //五金库库管
      "d8fd038d-c5af-46c6-85e4-264eaf110390", //劳保库管员
      "c7d91d0d-d3e7-4d43-b6a9-b65ccd53c866", //成品库库管
      "9a88e2e1-a3e6-4dc6-87f9-6e15230379ec", //文库管理员
      "429ceda6-7796-472a-8cc7-ecac8432cba1" //五金库库管01
    ];
    var headerl = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    var Body;
    var apiResponseadminl;
    var depttwopsonjsonl;
    var epttwojsonmesscodel;
    var resultDatal;
    var Listwhcode = [];
    for (var i = 0; i < listrole.length; i++) {
      Body = {
        roleId: listrole[i],
        pageNumber: 1,
        pageSize: 500
      };
      let base_path = "https://www.example.com/";
      apiResponseadminl = openLinker("post", base_path, "GT50937AT1", JSON.stringify(Body));
      depttwopsonjsonl = JSON.parse(apiResponseadminl);
      epttwojsonmesscodel = depttwopsonjsonl.code;
      resultDatal = depttwopsonjsonl.data;
      if (epttwojsonmesscodel !== "200") {
      } else {
        for (var x = 0; x < resultDatal.list.length; x++) {
          if (resultDatal.list[x].yhtUserId == currentUser.id) {
            if (listrole[i] == "e49da630-154f-4270-b4e3-93007c34f63b") {
              //五金库库管
              Listwhcode.push("物料库");
            }
            if (listrole[i] == "d8fd038d-c5af-46c6-85e4-264eaf110390") {
              //劳保库管员
              Listwhcode.push("办公劳保库");
            }
            if (listrole[i] == "c7d91d0d-d3e7-4d43-b6a9-b65ccd53c866") {
              //成品库库管
              Listwhcode.push("K14");
              Listwhcode.push("K16");
            }
            break;
          }
        }
      }
    }
    return { res: result, allData: allData, Listwhcode: Listwhcode };
  }
}
exports({ entryPoint: MyAPIHandler });