let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var requestdata = JSON.parse(param.requestData)[0];
    var id = requestdata.id;
    var sql = "select * from dsfa.terminalapply.TerminalApply where id = '" + id + "'";
    var data = ObjectStore.queryByYonQL(sql, "yycrm");
    var bill = data[0];
    var applyType = bill.applyType;
    var terminalData = bill.terminalData;
    var terminalData = JSON.parse(terminalData);
    var terminalid = bill.terminal; //终端id
    //查终端的自定义项
    var sql3 = "select define4,id from aa.store.StoreCustomItem where id in (" + terminalid + ")";
    var data = ObjectStore.queryByYonQL(sql3, "yxybase");
    var level = "";
    if (data[0] != null) {
      level = data[0].define4;
    }
    var code = terminalData.codebianma;
    var name = terminalData.name;
    var id = terminalData.id;
    var salesBusinessInfos = terminalData.salesBusinessInfo;
    var stop = terminalData.stop;
    var stortid = salesBusinessInfos[0].store;
    var ids = "";
    var area = "";
    var org = "";
    var status = "";
    for (let irow = 0; irow < 1; irow++) {
      let salesBusinessInfo = salesBusinessInfos[irow];
      ids = salesBusinessInfo.storeLevel;
      area = salesBusinessInfo.saleArea;
      org = salesBusinessInfo.saleOrg;
    }
    if (!ids && ids != null) {
      var sql = "select code from aa.store.StoreLevel where id = '" + ids + "'";
      var res = ObjectStore.queryByYonQL(sql, "yxybase");
      ids = res[0].code;
    }
    if (!area && area != null) {
      var sql1 = "select code from aa.salearea.SaleArea where id = '" + area + "'";
      var res1 = ObjectStore.queryByYonQL(sql1, "productcenter");
      area = res1[0].code;
    }
    if (!org && org != null) {
      var sql2 = "select code from org.func.BaseOrg where id = '" + org + "'";
      var res2 = ObjectStore.queryByYonQL(sql2, "ucf-org-center");
      org = res2[0].code;
    }
    if (applyType == 3) status = "1";
    else if (applyType == 2) status = "0";
    let json = {
      data: {
        id: id,
        name: name,
        code: code,
        stop: status,
        level: level,
        area: area,
        org: org
      }
    };
    if (stop == 0) {
      //停用的门店不调接口回写
      if (applyType == 2) {
        //申请停用的不调接口
        let url = "http://bip.pilotpen.com.cn:8800/uapws/rest/integration/writeCust";
        var strResponse = JSON.parse(postman("post", url, null, JSON.stringify(json)));
        if (strResponse.status == 1) throw new Error("U订货" + strResponse.msg);
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });