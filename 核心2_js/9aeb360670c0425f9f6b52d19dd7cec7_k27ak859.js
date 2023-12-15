let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var code = "200"; //接口返回状态码
    var msg; //接口返回状态信息
    var sql;
    var dt; //sql查询返回的对象
    let domainkey = "yourkeyHere";
    let errMsg = "";
    try {
      let body = "";
      let url = "";
      let uri = "";
      //获取客户分类信息
      url = "https://www.example.com/" + request.customerID + "";
      uri = "AT163BD39E08680003";
      let apiResCusClass = JSON.parse(openLinker("GET", url, uri, ""));
      if (apiResCusClass.code != 200) {
        throw new Error("获取客户分类信息失败：" + JSON.stringify(apiResCusClass));
      }
      if (
        typeof apiResCusClass.data.customerClass == "undefined" ||
        apiResCusClass.data.customerClass == null ||
        apiResCusClass.data.customerClass == "" ||
        apiResCusClass.data.customerClass == "undefined"
      ) {
        throw new Error("获取客户分类为空");
      }
      //客户起订量
      sql = "SELECT qidingshuliang,qidingjine1,yueshumoshi FROM AT163BD39E08680003.AT163BD39E08680003.kehuqidingliangdangan where kehufenleibianma =  '" + apiResCusClass.data.customerClass + "'";
      dt = ObjectStore.queryByYonQL(sql, domainkey);
      if (dt.length == 0) {
        errMsg += "客户分类[" + apiResCusClass.data.customerClass_Name + "]未配置起订量";
      } else if (dt.length > 1) {
        errMsg += "客户分类[" + apiResCusClass.data.customerClass_Name + "]重复配置起订量";
      } else {
        if (dt[0].yueshumoshi == "1") {
          if ((request.sumqty < dt[0].qidingshuliang) & (request.summoney < dt[0].qidingjine1)) {
            errMsg += "起订数量为【" + dt[0].qidingshuliang + "】当前合计数量为【" + request.sumqty + "】";
            errMsg += "起订金额为【" + dt[0].qidingjine1 + "】当前合计金额为【" + request.summoney + "】";
            errMsg += "数量和金额必须满足一个！";
          }
        } else {
          if (request.sumqty < dt[0].qidingshuliang) {
            errMsg += "起订数量为【" + dt[0].qidingshuliang + "】当前合计数量为【" + request.sumqty + "】";
          }
          if (request.summoney < dt[0].qidingjine1) {
            errMsg += "起订金额为【" + dt[0].qidingjine1 + "】当前合计金额为【" + request.summoney + "】";
          }
        }
      }
      if (errMsg.length > 0) {
        throw new Error("起订量：" + errMsg);
      }
    } catch (e) {
      code = "999";
      msg = "起订量获取" + e.toString();
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