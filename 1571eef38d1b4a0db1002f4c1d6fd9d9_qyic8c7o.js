let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    const body = {
      page: {
        pageSize: 500,
        pageIndex: 1,
        totalCount: 1
      },
      billnum: "340b39f3",
      condition: {
        commonVOs: [
          {
            itemName: "schemeName",
            value1: "默认方案"
          },
          {
            itemName: "isDefault",
            value1: true
          }
        ],
        filtersId: "yourIdHere",
        solutionId: 201001225,
        bInit: true
      },
      bEmptyWithoutFilterTree: true,
      designPreview: "true",
      serviceCode: "1519800780766314496",
      queryId: 1675251409548
    };
    //信息头
    const header = {
      "Domain-Key": "developplatform",
      cookie: "yht_access_token=" + JSON.parse(AppContext()).token
    };
    let url = "https://www.example.com/";
    let responseStr = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    let responseObj = JSON.parse(responseStr);
    const resObj = responseObj.data.recordList.map((item) => {
      return {
        stuffNo: item.stuffNo,
        stuffName2: item.stuffName2,
        stuffId: item.stuffName,
        CCAccount: item.CCAccount,
        DeptCode: item.DeptCode,
        DeptName: item.DeptName,
        OrgCode: item.OrgCode,
        servicesOrg: item.servicesOrg,
        IsValid: item.IsValid,
        districtList: Array.isArray(item.XSFFRY2_DistrictList) && item.XSFFRY2_DistrictList.map((item) => item.XSFFRY2_DistrictList),
        productlineNameList: Array.isArray(item.XSFFRY2_productlineNameList) && item.XSFFRY2_productlineNameList.map((item) => item.XSFFRY2_productlineNameList)
      };
    });
    return (
      responseObj.code == 200 && {
        data: resObj
      }
    );
  }
}
exports({
  entryPoint: MyAPIHandler
});