let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取access_token
    var accessToken = extrequire("SCMSA.saleOrderRule.getToken").execute().access_token;
    return getTranstypeIdByParams({ code: request.code, defTranCode: request.defTranCode, path: "SCMSA1" });
    // 获取交易类型ID，编码为空返回默认交易类型编码
    function getTranstypeIdByParams(params) {
      // 封装请求参数
      let reqBody = {
        page: {
          pageIndex: 1,
          pageSize: 100
        },
        path: params.path
      };
      // 请求查询交易类型接口
      let result = postman("post", "https://www.example.com/" + accessToken, "", JSON.stringify(reqBody));
      // 转为JSON对象
      result = JSON.parse(result);
      // 返回信息校验
      if (result.code != "200") {
        throw new Error("查询交易类型异常:" + result.message);
      }
      if (result.data.recordCount === 0) {
        throw new Error("该单据下没有交易类型");
      }
      let recordList = result.data.recordList;
      // 系统的交易类型默认ID
      let defaultId;
      // 传进来的编码对应的默认ID
      let transId;
      // 传进来的默认编码对应的默认ID
      let defTranId;
      recordList.forEach((self, index) => {
        if (self.enable !== "1") {
          if (self.default === "1") {
            defaultId = self.id;
          } else if (self.code === params.defTranCode) {
            defTranId = self.id;
          } else if (self.code === params.code) {
            transId = self.id;
            return;
          }
        }
      });
      if (transId !== undefined) {
        return transId;
      } else if (defTranId !== undefined) {
        return defTranId;
      } else if (defaultId !== undefined) {
        return defaultId;
      } else {
        throw new Error("该单据下没有默认交易类型");
      }
    }
  }
}
exports({ entryPoint: MyAPIHandler });