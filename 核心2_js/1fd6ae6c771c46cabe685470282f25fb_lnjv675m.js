let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var url = "https://www.example.com/";
    var params = {
      locale: "zh_CN",
      serviceCode: "u8c_GZTACT020",
      refimestamp: "1641799140275",
      terminalType: "1"
    };
    var body = {
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
      refimestamp: "1641799140275",
      ownDomain: "u8c-auth",
      tplid: 7861088
    };
    var header = {
      "Content-Type": "application/json;charset=UTF-8",
      "Domain-Key": "u8c-auth"
    };
    var suf = "?";
    for (let key in params) {
      let value = params[key];
      suf += key + "=" + value + "&";
    }
    var ur = url + suf;
    var requrl = suf === "?" ? url : substring(ur, 0, ur.length - 1);
    var accept = postman("post", requrl, JSON.stringify(header), JSON.stringify(body));
    var res = JSON.parse(accept);
    throw new Error(res);
    return { res };
  }
}
exports({ entryPoint: MyTrigger });