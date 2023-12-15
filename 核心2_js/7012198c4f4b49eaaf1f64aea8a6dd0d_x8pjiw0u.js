let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let wuliaoId = request.wuliaoId;
    let picihao = request.picihao;
    let body = {
      pageIndex: 1,
      pageSize: 10,
      product: [wuliaoId],
      batchno: [picihao]
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "ST", JSON.stringify(body));
    var object = JSON.parse(apiResponse);
    if (object.code != "200") {
      throw new Error("查询批次号接口出错，请开发人员进行排查");
    }
    if (object.data.recordList.length < 1) {
      throw new Error("根据批次号：" + picihao + "，物料skuID：" + wuliaoId + "  查询出来的批次号接口没有数据");
    }
    return { object };
  }
}
exports({ entryPoint: MyAPIHandler });