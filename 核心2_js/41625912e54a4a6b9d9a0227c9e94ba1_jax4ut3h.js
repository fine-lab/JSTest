let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let id = "youridHere";
    let body = {
      pageIndex: "1",
      pageSize: "10",
      custdocdefcode: context.custdocdefcode,
      name: context.name,
      code: context.code
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "AT1672920C08100005", JSON.stringify(body));
    // 因查询条件不对，接口返回信息可能为空，判断后返回错误ID 999999，不造成后续报错
    let count = JSON.parse(apiResponse).data.recordCount;
    if (count == 0) {
      return { id };
    }
    id = JSON.parse(apiResponse).data.recordList[0].id;
    return { id };
  }
}
exports({ entryPoint: MyTrigger });