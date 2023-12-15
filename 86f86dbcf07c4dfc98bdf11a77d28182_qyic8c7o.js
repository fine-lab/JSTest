let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var projectType = request.projectType;
    var personId = request.personId;
    var orgId = request.orgId;
    var deptId = request.deptId;
    var accountOrgId = request.accountOrgId;
    //查询员工code
    let personUrl = "https://www.example.com/" + personId;
    let personObj = openLinker("GET", personUrl, "ycContractManagement", JSON.stringify({}));
    let psnCode = JSON.parse(personObj).data.code;
    //查询部门code
    let deptUrl = "https://www.example.com/" + deptId;
    let deptObj = openLinker("GET", deptUrl, "ycContractManagement", JSON.stringify({}));
    let deptCode = JSON.parse(deptObj).data.code;
    //查询组织code
    let orgUrl = "https://www.example.com/";
    let orgObj = openLinker("GET", orgUrl + orgId, "ycContractManagement", JSON.stringify({}));
    let orgCode = JSON.parse(orgObj).data.code;
    //查询会计主体code
    let accountOrgCode = "";
    if (accountOrgId == orgId) {
      accountOrgCode = orgCode;
    } else {
      let accountOrgObj = openLinker("GET", orgUrl + accountOrgId, "ycContractManagement", JSON.stringify({}));
      accountOrgCode = JSON.parse(accountOrgObj).data.code;
    }
    let tokenUrl = "https://www.example.com/";
    let body = {};
    let header = {};
    let actoken = postman("get", tokenUrl, JSON.stringify(header), JSON.stringify(body));
    var token = JSON.parse(actoken).accesstoken;
    var url = "https://www.example.com/";
    url = url + "&accesstoken=" + token;
    var argValueObj = {
      projectType: projectType,
      psnCode: psnCode,
      corpCode: orgCode,
      deptCode: deptCode,
      partiOrgCode: accountOrgCode
    };
    var param = {
      weburl: "nc.itf.ppm.projectbuild.pub.IProjectQueryForYFK",
      methodname: "queryProjectCode",
      serviceMethodArgInfo: [
        {
          argType: "java.lang.String",
          isPrimitive: false,
          argValue: JSON.stringify(argValueObj),
          agg: false,
          isArray: false
        }
      ]
    };
    let header1 = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    let projectobj = postman("post", url, JSON.stringify(header1), JSON.stringify(param));
    var retObj = JSON.parse(projectobj).retObj;
    var retArr = retObj.split(",");
    var ret = [];
    for (var i = 0; i < retArr.length; i++) {
      ret.push(retArr[i].split("_")[0]);
    }
    return { ret };
  }
}
exports({ entryPoint: MyAPIHandler });