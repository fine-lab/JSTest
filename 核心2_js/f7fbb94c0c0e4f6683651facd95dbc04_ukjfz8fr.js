let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let queryCostUtil = new Object();
    //定义一些测试
    {
      //测试获取openapi token
      queryCostUtil.getCostTest = function (param) {
        let result = {
          code: -1,
          message: param,
          data: {
            invcode: null,
            cost: 0.01
          }
        };
        return result;
      };
      // 通过yongql 获取调入单成本
      queryCostUtil.getCostByYonql = function (param) {
        let result = {
          code: -1,
          message: param,
          data: {
            invcode: null,
            cost: 0.2
          }
        };
        let id = param.id;
        let res = {
          code: -1,
          des: "错误",
          data: []
        };
        let sql = "select * from st.storein.StoreIn  where id='" + id + "'";
        let res2 = ObjectStore.queryByYonQL(sql, "ustock");
        if (res2.length > 0) {
          let srcBillNO = res2[0].srcBillNO;
          let sql = "select mainid.code as code, * from st.storeout.StoreOutDetail where mainid.code='" + srcBillNO + "'";
          let res_diaobochu = ObjectStore.queryByYonQL(sql, "ustock");
          res = {
            code: 0,
            des: "sucess",
            data: res_diaobochu
          };
        } else {
          res = {
            code: -2,
            des: "未查找到相应调入单" + code,
            data: []
          };
        }
        result = res;
        return result;
      };
    }
    return queryCostUtil.getCostByYonql(request);
  }
}
exports({ entryPoint: MyAPIHandler });