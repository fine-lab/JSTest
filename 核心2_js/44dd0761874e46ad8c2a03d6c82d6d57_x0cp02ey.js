let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var AppCode = "ST";
    var detailUrl = "https://www.example.com/";
    var listUrl = "https://www.example.com/";
    var saveUrl = "https://www.example.com/";
    var deleteUrl = "https://www.example.com/";
    var body = {};
    var materialoutDetail = openLinker("GET", `${detailUrl}?id=${request.id}`, AppCode, JSON.stringify(body));
    var materialoutDetailJson = JSON.parse(materialoutDetail);
    delete materialoutDetailJson.data.inventoryowner;
    delete materialoutDetailJson.data.ownertype;
    var materOuts = new Array();
    for (let i = 0; i < materialoutDetailJson.data.materOuts.length; i++) {
      delete materialoutDetailJson.data.materOuts[i].inventoryowner;
      delete materialoutDetailJson.data.materOuts[i].ownertype;
      materOuts.push(materialoutDetailJson.data.materOuts[i]);
    }
    materialoutDetailJson.data.materOuts = materOuts;
    materialoutDetailJson.data.bustype = 2322623556850688;
    materialoutDetailJson.data._status = "Update";
    var materialoutSaveBody = materialoutDetailJson;
    var materialoutSaveResult = JSON.parse(openLinker("POST", saveUrl, AppCode, JSON.stringify(materialoutSaveBody)));
    var returnMsg = "操作成功,可以删除材料出库单:" + materialoutDetailJson.data.code;
    if (materialoutSaveResult.code != 200) {
      returnMsg = "操作失败,不可以删除材料出库单:" + materialoutDetailJson.data.code;
    }
    return { returnMsg };
  }
}
exports({ entryPoint: MyAPIHandler });