let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let url =
      "https://www.example.com/";
    let param = [
      {
        _md: "staff",
        birthdate: 252000000000,
        education: "HI300000000000007104",
        shortname: "yb",
        joinworkdate: 1685289600000,
        org_id: "youridHere",
        name: "杨波",
        cert_type: "0001-5130-48de-ae28-4233a47e3797",
        selfemail: "https://www.example.com/",
        cert_no: "120221197712271813",
        sex: 1,
        mobile: "13466502360",
        deptId: "yourIdHere",
        dr: 0,
        entityFullName: "com.yonyou.hrcloud.staff.model.Staff",
        entityMetaDefinedName: "staff",
        entityNameSpace: "hrcloud",
        es: 0,
        integrity: 0.0,
        psnclId: "yourIdHere",
        unitId: "yourIdHere"
      }
    ];
    let header = {};
    let strResponse = postman("post", url, JSON.stringify(header), JSON.stringify(param));
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });