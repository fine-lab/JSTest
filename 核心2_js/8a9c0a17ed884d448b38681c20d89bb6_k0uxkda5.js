let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let dataOrder = param.data;
    let codeList = new Array();
    for (let j = 0; j < dataOrder.length; j++) {
      let param1 = { billcode: dataOrder[j].code };
      let func = extrequire("SCMSA.backDesignerFunction.queryTransStock");
      let apiResponseRes = func.execute(param1);
      if (apiResponseRes.code == "200") {
        let recordList = apiResponseRes.data.recordList;
        if (recordList.length > 0) {
          for (var k = 0; k < recordList.length; k++) {
            codeList.push(recordList[k].code);
          }
        }
      }
      //查询其他入库单表
      let querySql = "select id from st.othinrecord.OthInRecordDefine where define1='" + dataOrder[j].code + "'";
      var res = ObjectStore.queryByYonQL(querySql, "ustock");
      if (res.length > 0) {
        throw new Error("无法弃审，需要先删除[" + dataOrder[j].code + "]对应的其他入库单后，方可弃审");
      }
    }
    if (codeList.length > 0) {
      var res = join(codeList, ",");
      throw new Error("无法弃审，需要先删除[" + res + "]转库单后，方可弃审");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });