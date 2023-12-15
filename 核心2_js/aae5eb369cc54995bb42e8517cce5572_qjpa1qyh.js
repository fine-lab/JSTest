let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var requestData = JSON.parse(param.requestData);
    var code = requestData.code;
    if (code != undefined || code != null) {
      let url = "https://www.example.com/";
      let body = {
        pageIndex: "1",
        pageSize: "10",
        isSum: "false",
        simpleVOs: [
          {
            value1: code,
            op: "eq",
            field: "frees.define8"
          }
        ]
      }; //请求参数
      let apiResponse = openLinker("POST", url, "GT46349AT1", JSON.stringify(body)); //TODO：注意填写应用编码(请看注意事项)
      apiResponse = JSON.parse(apiResponse);
      if (apiResponse.code != "200") {
        throw new Error("查询合同错误" + JSON.stringify(apiResponse));
      } else {
        var ctcount = apiResponse.data.recordCount;
        if (ctcount !== 0) {
          throw new Error("错误,已生成合同");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });