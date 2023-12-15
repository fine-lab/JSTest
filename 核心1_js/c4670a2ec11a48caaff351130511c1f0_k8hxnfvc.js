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
    let personObj = openLinker("GET", personUrl, "APCT", JSON.stringify({}));
    let psnCode = JSON.parse(personObj).data.code;
    //查询部门code
    let deptUrl = "https://www.example.com/" + deptId;
    let deptObj = openLinker("GET", deptUrl, "APCT", JSON.stringify({}));
    let deptCode = JSON.parse(deptObj).data.code;
    //查询组织code
    let orgUrl = "https://www.example.com/";
    let orgObj = openLinker("GET", orgUrl + orgId, "APCT", JSON.stringify({}));
    let orgCode = JSON.parse(orgObj).data.code;
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
      deptCode: deptCode //,
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
    var ret = retArr;
    return { ret };
  }
}
exports({ entryPoint: MyAPIHandler });