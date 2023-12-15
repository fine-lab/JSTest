let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var qrybody = {
      pageIndex: "1",
      pageSize: 1,
      custdocdefcode: "sale_contract",
      code: param.data[0].code
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "SACT", JSON.stringify(qrybody));
    var recordList = JSON.parse(apiResponse).data.recordList;
    if (recordList.length == 0) {
      throw new Error("在自定義檔案未找到對應的合同編號");
    }
    var id = JSON.parse(apiResponse).data.recordList[0].id;
    var data = new Array();
    var info = {
      id: id
    };
    data.push(info);
    let editbody = {
      data: data
    };
    url = "https://www.example.com/";
    apiResponse = openLinker("POST", url, "SACT", JSON.stringify(editbody));
    var sucessCount = JSON.parse(apiResponse).data.sucessCount;
    if (sucessCount > 0) {
      return {};
    } else {
      var message = JSON.parse(apiResponse).data.messages;
      throw new Error(message);
    }
  }
}
exports({ entryPoint: MyTrigger });