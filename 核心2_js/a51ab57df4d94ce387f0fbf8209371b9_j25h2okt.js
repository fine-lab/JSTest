let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 查询销售出库列表
    let body = {
      pageIndex: 1,
      pageSize: 500,
      isSum: false,
      simpleVOs: [
        { op: "eq", field: "warehouse.code", value2: "YADS01", value1: "YADS01" },
        { op: "eq", field: "headDefine.define2", value2: "1", value1: "1" }
      ]
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "ST", JSON.stringify(body));
    let APIMessage = JSON.parse(apiResponse);
    if (APIMessage.code == 200) {
      // 数据集合
      let List = APIMessage.data.recordList;
      if (List.length > 0) {
        for (let i = 0; i < List.length; ) {
          let XSCKID = List[i].id;
          let func1 = extrequire("ST.api001.getToken");
          let res = func1.execute(require);
          let token = res.access_token;
          let headers = { "Content-Type": "application/json;charset=UTF-8" };
          // 销售出库详情查询
          let apiResponse1 = postman("get", "https://www.example.com/" + token + "&id=" + XSCKID, JSON.stringify(headers), null);
          let XSCKapi = JSON.parse(apiResponse1);
          if (XSCKapi.code == 200) {
            throw new Error(JSON.stringify(XSCKapi));
            var Data = XSCKapi.data;
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });