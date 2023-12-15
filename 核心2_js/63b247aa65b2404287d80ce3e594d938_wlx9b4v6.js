let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var currentUser = JSON.parse(AppContext()).currentUser;
    var sysId = "yourIdHere";
    var tenantId = currentUser.tenantId;
    var userids = [currentUser.id];
    var userid = currentUser.id;
    var result = listOrgAndDeptByUserIds(sysId, tenantId, userids);
    var resultJSON = JSON.parse(result);
    var uid = currentUser.id;
    var isrole = false;
    var resu = false;
    var deptid;
    var detpids = [];
    var userData = resultJSON.data;
    deptid = userData[currentUser.id].deptId;
    detpids.push(deptid);
    let base_path = "https://www.example.com/";
    var bodys = {
      userId: [userid]
    };
    var token = "";
    let func1 = extrequire("GT56492AT34.backDefaultGroup.gettoken");
    let res = func1.execute(request);
    token = res.access_token;
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    let apiResponse = postman("post", base_path + "?access_token=" + token, JSON.stringify(header), JSON.stringify(bodys));
    var apiResponsejaon = JSON.parse(apiResponse);
    var queryCode = apiResponsejaon.code;
    if (queryCode !== "200") {
      throw new Error("查询用户对应人员错误 " + apiResponsejaon.message);
    }
    var psndocid = apiResponsejaon.data.data[0].id;
    var Body;
    var apiResponseadmin;
    var depttwopsonjson;
    var epttwojsonmesscode;
    var resultData;
    Body = {
      roleId: "yourIdHere",
      pageNumber: 1,
      pageSize: 200
    };
    apiResponseadmin = postman("post", "https://www.example.com/" + token, JSON.stringify(header), JSON.stringify(Body));
    depttwopsonjson = JSON.parse(apiResponseadmin);
    epttwojsonmesscode = depttwopsonjson.code;
    resultData = depttwopsonjson.data;
    if (epttwojsonmesscode !== "200") {
    } else {
      for (var x = 0; x < resultData.list.length; x++) {
        if (resultData.list[x].yhtUserId == uid) {
          resu = true;
          return { resu: resu };
        }
      }
      if (!resu) {
        var result = [];
        let apiResponsedept = postman("get", "https://www.example.com/" + token + "&id=" + deptid, null, null);
        var deptjson = JSON.parse(apiResponsedept);
        var deptrscode = deptjson.code;
        if (deptrscode !== "200") {
          throw new Error("部门信息查询错误" + deptjson.message + deptid);
        } else {
          var principal = deptjson.data.principal;
          if (principal == currentUser.staffId) {
            var depttwo = {
              externalData: {
                parentorgid: deptid,
                enable: ["1"]
              }
            };
            let apiResponsedepttwo = postman("post", "https://www.example.com/" + token, JSON.stringify(header), JSON.stringify(depttwo));
            depttwopsonjson = JSON.parse(apiResponsedepttwo);
            epttwojsonmesscode = depttwopsonjson.code;
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
            result.push(currentUser.staffId);
          }
        }
        for (var i = 0; i < result.length; i++) {
          if (result[i] == request.baseuserid) {
            return {
              resu: true
            };
          }
        }
        return {
          resu: false
        };
      }
    }
    return { resu: resu };
  }
}
exports({ entryPoint: MyAPIHandler });