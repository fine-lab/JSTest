let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var AppCode = "ST";
    //产品入库单删除Url
    var storeprorecordBatchdeleteUrl = "https://www.example.com/";
    //产平入库单删除Body
    var storeprorecordBatchdeleteBody = {
      data: [
        {
          id: request.id
        }
      ]
    };
    var storeprorecordBatchdeleteApiResponse = openLinker("POST", storeprorecordBatchdeleteUrl, AppCode, JSON.stringify(storeprorecordBatchdeleteBody));
    return { storeprorecordBatchdeleteApiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });