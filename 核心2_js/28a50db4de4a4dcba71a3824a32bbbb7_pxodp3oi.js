let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request, params) {
    let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
    let ifUrl = DOMAIN + "/yonbip/digitalModel/custcategory/tree";
    let suffix = params.suffix;
    let orgName = params.orgName;
    let country = params.country;
    if (suffix == undefined || suffix == null || suffix == "") {
      suffix = includes(orgName, "建机") ? "A" : includes(orgName, "环保") ? "C" : "B";
    }
    let body = {
      condition: {
        isExtend: true,
        simpleVOs: [
          {
            field: "level",
            op: "gt",
            value1: 2
          },
          {
            field: "code",
            op: "like",
            value1: suffix
          },
          {
            field: "name",
            op: "eq",
            value1: country
          }
        ]
      }
    };
    let apiRes = openLinker("POST", ifUrl, "GT3734AT5", JSON.stringify(body)); //GZTBDM
    let apiResObj = JSON.parse(apiRes);
    if (apiResObj.code == 200 && apiResObj.data == null) {
      body = {
        condition: {
          isExtend: true,
          simpleVOs: [
            {
              field: "level",
              op: "gt",
              value1: 2
            },
            {
              field: "code",
              op: "like",
              value1: suffix + "9999"
            }
          ]
        }
      };
      apiRes = openLinker("POST", ifUrl, "GZTBDM", JSON.stringify(body));
    }
    return JSON.parse(apiRes);
  }
}
exports({ entryPoint: MyAPIHandler });