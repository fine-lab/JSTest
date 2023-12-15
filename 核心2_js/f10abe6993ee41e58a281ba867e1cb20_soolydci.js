let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let access_token = request.access_token;
    let subjectCode = request.subjectCode;
    let url = "https://www.example.com/" + access_token;
    const header = {
      "Content-Type": "application/json"
    };
    let body = {
      fields: ["id", "code", "name", "deficitcheckstrategy"],
      pageIndex: 1,
      pageSize: 100,
      conditions: [
        {
          value: subjectCode,
          operator: "=",
          field: "code"
        }
      ]
    };
    let subjectsid = -1;
    var subjectsResp = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    let subjectsResJson = JSON.parse(subjectsResp);
    if ("200" === subjectsResJson.code && subjectsResJson.data.length === 1) {
      subjectsid = subjectsResJson.data[0].id;
    } else if ("200" === subjectsResJson.code && subjectsResJson.data.length > 1) {
      let dataList = subjectsResJson.data;
      for (let data of dataList) {
        let deficitcheckstrategy = data.deficitcheckstrategy;
        if ("NoCheck" === deficitcheckstrategy) {
          subjectsid = data.id;
        }
      }
    }
    return { subjectsid, subjectsResJson };
  }
}
exports({ entryPoint: MyAPIHandler });