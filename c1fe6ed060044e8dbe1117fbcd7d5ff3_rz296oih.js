let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //通过华为接口获取数据
    //调取ys保存接口
    let baseUrl = "https://www.example.com/";
    let body = { key: "yourkeyHere" };
    let saveUrl = baseUrl + "/yonbip/scm/applyorder/save";
    let apiResponse = openLinker("POST", saveUrl, "PU", JSON.stringify(body));
    //调用ys提交接口
    apiResponse = JSON.parse(apiResponse);
    if (apiResponse.code == "200" && apiResponse.data.failCount != 0) {
      return { message: apiResponse.data };
    } else if (apiResponse.code != "200") {
      return { message: "网关原因保存失败" };
    }
    let ids = [];
    let res = apiResponse.data.infos;
    res.map((item, i) => {
      ids.push({ id: item.id });
    });
    if (ids.length == 0) {
      return { message: "没有要提交和审核的采购单" };
    }
    let submitUrl = baseUrl + "/yonbip/scm/api/upu/batchsubmit";
    apiResponse = openLinker("POST", saveUrl, "PU", JSON.stringify({ data: ids }));
    apiResponse = JSON.parse(apiResponse);
    if (apiResponse.code != "200") {
      return { message: "网关原因提交失败" };
    } else if (apiResponse.data.failCountAI != 0) {
      return { message: apiResponse.data.message };
    }
    //调用ys审核接口
    let auditUrl = baseUrl + "/yonbip/scm/applyorder/batchaudit";
    apiResponse = openLinker("POST", saveUrl, "PU", JSON.stringify({ data: ids }));
    apiResponse = JSON.parse(apiResponse);
    if (apiResponse.code != "200") {
      return { message: "网关原因审核失败" };
    } else if (apiResponse.data.failCountAI != 0) {
      return { message: apiResponse.data.message };
    }
    return { data: "数据同步成功" };
  }
}
exports({ entryPoint: MyTrigger });