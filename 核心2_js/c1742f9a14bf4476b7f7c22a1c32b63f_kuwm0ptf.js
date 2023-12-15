let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //收款单列表接口
    let pageIndex = request.pageIndex;
    let pageSize = request.pageSize;
    var urlNow = ObjectStore.env().url;
    let url = urlNow + "/iuap-api-gateway/yonbip/fi/receivebill/list/v2";
    let body = {
      pageIndex: pageIndex,
      pageSize: pageSize
    };
    let apiResponse = openLinker("POST", url, "AT181B7E9009F80002", JSON.stringify(body)); //TODO：注意填写应用编码(请看注意事项)
    var res1 = JSON.parse(apiResponse);
    // 	对接口返回编码进行判断 0失败  200正常返回
    let code = res1.code;
    if (code && code == 200) {
      let codeArr = [];
      for (let e of res1.data.recordList) {
        codeArr.push(e.code);
      }
      return { data: codeArr };
    } else {
      return { msg: res1.message };
    }
  }
}
exports({ entryPoint: MyAPIHandler });