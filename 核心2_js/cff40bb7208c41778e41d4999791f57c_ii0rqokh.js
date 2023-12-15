let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(ziduan2) {
    let getXMdataUrl = "https://www.example.com/";
    let xmBody = {
      code: ziduan2,
      pageIndex: "1",
      pageSize: "10"
    };
    let apiResponse = openLinker("POST", getXMdataUrl, "GT59740AT1", JSON.stringify(xmBody));
    let xmresponseobj = JSON.parse(apiResponse);
    let xmList = undefined;
    if (xmresponseobj.code === "200") {
      let data = xmresponseobj.data;
      let recordList = data.recordList;
      if (recordList.length > 0) {
        xmList = recordList;
      }
    }
    return { xmList };
  }
}
exports({ entryPoint: MyAPIHandler });