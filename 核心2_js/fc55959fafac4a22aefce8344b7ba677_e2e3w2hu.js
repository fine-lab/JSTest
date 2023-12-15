let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var AppCode = "ST";
    //形态转换列表查询Url
    var morphologyconversionListUrl = "https://www.example.com/";
    //形态转换弃审Url
    var morphologyconversionbatchunauditUrl = "https://www.example.com/";
    //形态转换删除Url
    var morphologyconversionBatchdeleteUrl = "https://www.example.com/";
    var morphologyconversionListBody = {
      isSum: true,
      pageIndex: 1,
      pageSize: 10,
      simpleVOs: [
        {
          op: "eq",
          value1: request.id,
          field: "headItem.define1"
        }
      ]
    };
    var morphologyconversionBatchdeleteApiResponse = JSON.parse(openLinker("POST", morphologyconversionListUrl, AppCode, JSON.stringify(morphologyconversionListBody)));
    //弃审删除Body
    var morphologyconversionBatchdeleteBody = {
      data: [
        {
          id: morphologyconversionBatchdeleteApiResponse.data.recordList[0].id
        }
      ]
    };
    //已审核单据 弃审
    if (morphologyconversionBatchdeleteApiResponse.data.recordList[0].verifystate == 2) {
      var morphologyconversionbatchunaudit = JSON.parse(openLinker("POST", morphologyconversionbatchunauditUrl, AppCode, JSON.stringify(morphologyconversionBatchdeleteBody)));
    }
    var morphologyconversionBatchdelete = JSON.parse(openLinker("POST", morphologyconversionBatchdeleteUrl, AppCode, JSON.stringify(morphologyconversionBatchdeleteBody)));
    throw new Error(JSON.stringify(morphologyconversionBatchdelete));
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });