let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取到传过来的数据param
    var requestData = param.requestData;
    let requestdata = "";
    if (Object.prototype.toString.call(requestData) === "[object Array]") {
      requestdata = requestData[0];
    }
    if (Object.prototype.toString.call(requestData) === "[object String]") {
      requestdata = JSON.parse(requestData);
    }
    var id;
    if (requestdata.id == null) {
      //判断requestdata中是否有id
      id = requestdata[0].id; //前端传的数据id，根据数据id去查数据库
    } else {
      id = requestdata.id; //前端传的数据id，根据数据id去查数据库
    }
    //查营销物料申领表
    var sql = "select * from dsfa.terminalassets.TerminalAssets where id = '" + id + "'";
    var TerminalAssets = ObjectStore.queryByYonQL(sql, "yycrm");
    let json = {
      crmcode: TerminalAssets[0].code
    };
    //审批通过的单据，接触预留单，审批中或者其他状态下的单据，删除预留单
    if (TerminalAssets[0].verifystate == 2) {
      let url = "http://219.133.71.172:39066/uapws/rest/total/FreeReserve";
      var strResponse = JSON.parse(postman("post", url, null, JSON.stringify(json)));
      if (strResponse.status == 1) {
        throw new Error("NCC:" + strResponse.msg);
      }
    } else if (TerminalAssets[0].verifystate == 4 || TerminalAssets[0].verifystate == 3) {
      let url = "http://219.133.71.172:39066/uapws/rest/total/DeleteReserve";
      var strResponse = JSON.parse(postman("post", url, null, JSON.stringify(json)));
      if (strResponse.status == 1) {
        throw new Error("NCC:" + strResponse.msg);
      }
    } else {
      throw new Error("不可取消预留");
    }
    throw new Error("NCC预留单解除成功");
    return {};
  }
}
exports({ entryPoint: MyTrigger });