let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var stat = new Date();
    var refimestamp = stat.getTime();
    request.url = "https://www.example.com/";
    request.params = {
      locale: "zh_CN",
      serviceCode: "u8c_GZTACT020",
      refimestamp: refimestamp,
      terminalType: "1"
    };
    request.body = {
      page: {
        pageSize: 100,
        pageIndex: 1,
        totalCount: 1
      },
      billnum: "sys_authRole",
      condition: {
        commonVOs: [
          {
            itemName: "schemeName",
            value1: "默认方案"
          },
          {
            itemName: "isDefault",
            value1: true
          },
          {
            value1: "0",
            itemName: "userDefine_95670628_001"
          }
        ],
        filtersId: "yourIdHere",
        solutionId: 1103087813,
        bInit: true,
        filterName: "AA_sys_authRole_userlist"
      },
      bEmptyWithoutFilterTree: false,
      locale: "zh_CN",
      serviceCode: "u8c_GZTACT020",
      refimestamp: JSON.stringify(refimestamp),
      ownDomain: "u8c-auth",
      tplid: 7861088
    };
    request.header = {
      "Content-Type": "application/json;charset=UTF-8",
      "Domain-Key": "u8c-auth"
    };
    let func1 = extrequire("GT34544AT7.originscript.postRequest");
    let res = func1.execute(request);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });