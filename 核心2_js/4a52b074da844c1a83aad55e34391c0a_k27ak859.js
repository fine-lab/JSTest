let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var code = "200"; //接口返回状态码
    var msg; //接口返回状态信息
    var sql;
    var dt; //sql查询返回的对象
    var errMsg = "";
    try {
      if (request.data.customerClass == "undefined") {
        throw new Error("客户分类不存在");
      }
      sql = "SELECT qidingshuliang,qidingjine1,yueshumoshi FROM AT163BD39E08680003.AT163BD39E08680003.kehuqidingliangdangan where kehufenleibianma =  '" + request.data.customerClass + "'";
      dt = ObjectStore.queryByYonQL(sql);
      if (dt.length == 0) {
        errMsg += "客户分类[" + request.data.customerClass_Name + "]未配置起订量";
      } else if (dt.length > 1) {
        errMsg += "客户分类[" + request.data.customerClass_Name + "]重复配置起订量";
      }
      if (errMsg.length > 0) {
        throw new Error(errMsg);
      }
      //判断数量和金额是否需要同时满足
      if (dt[0].yueshumoshi == "1") {
        if ((request.data.sumqty < dt[0].qidingshuliang) & (request.data.summoney < dt[0].qidingjine1)) {
          errMsg += "起订数量为【" + dt[0].qidingshuliang + "】当前合计数量为【" + request.data.sumqty + "】";
          errMsg += "起订金额为【" + dt[0].qidingjine1 + "】当前合计金额为【" + request.data.summoney + "】";
          errMsg += "数量和金额必须满足一个！";
        }
      } else {
        if (request.data.sumqty < dt[0].qidingshuliang) {
          errMsg += "起订数量为【" + dt[0].qidingshuliang + "】当前合计数量为【" + request.data.sumqty + "】";
        }
        if (request.data.summoney < dt[0].qidingjine1) {
          errMsg += "起订金额为【" + dt[0].qidingjine1 + "】当前合计金额为【" + request.data.summoney + "】";
        }
      }
      if (errMsg.length > 0) {
        throw new Error(errMsg);
      }
    } catch (e) {
      code = "999";
      msg = e.toString();
    } finally {
      var res = {
        code: code,
        msg: msg
      };
      return {
        res
      };
    }
  }
}
exports({
  entryPoint: MyAPIHandler
});