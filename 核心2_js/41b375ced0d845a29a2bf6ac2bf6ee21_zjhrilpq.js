let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var ybresults = request.data;
    var nowdate = request.date1;
    let func1 = extrequire("GT13741AT37.api.getOpenApiToken");
    let res = func1.execute(request);
    var token = res.access_token;
    var deptId = request;
    var reqoarurl = "https://www.example.com/" + token;
    var reqrecurl = "https://www.example.com/" + token;
    var reqcusturl = "https://www.example.com/" + token;
    var reqpaytypeurl = "https://www.example.com/" + token;
    var contenttype = "application/json;charset=UTF-8";
    var message = "";
    var header = {
      "Content-Type": contenttype
    };
    var paytypeResponse = postman("Post", reqpaytypeurl, JSON.stringify(header), "");
    var paytypedatas = JSON.parse(paytypeResponse).data;
    var oraArray = new Array();
    var recArray = new Array();
    ybresults.forEach((ybresult) => {
      var storename = ybresult.store;
      var vipcustcode = "";
      var custbody = {
        pageIndex: 0,
        pageSize: 0,
        name: storename
      };
      var custResponse = postman("Post", reqcusturl, JSON.stringify(header), JSON.stringify(custbody));
      var custresponseobj = JSON.parse(custResponse);
      if ("200" == custresponseobj.code) {
        let data = custresponseobj.data;
        if (data != undefined) {
          let recordLists = data.recordList;
          if (recordLists != undefined && recordLists.length > 0) {
            vipcustcode = recordLists[0].code;
          }
        }
      }
      var salesql =
        "select * from GT13741AT37.GT13741AT37.salemoneydetail where salemoneydetailFk in (select id from GT13741AT37.GT13741AT37.dayclosebill where dayclosecode='" + ybresult.dayclosecode + "')";
      var vipsql =
        "select * from GT13741AT37.GT13741AT37.memberincomedetail where memberincomedetailFk in (select id from GT13741AT37.GT13741AT37.dayclosebill where dayclosecode='" +
        ybresult.dayclosecode +
        "')";
      var accountsql =
        "select * from GT13741AT37.GT13741AT37.accountdetail where accountdetailFk in (select id from GT13741AT37.GT13741AT37.dayclosebill where dayclosecode='" + ybresult.dayclosecode + "')";
      var saleresults = ObjectStore.queryByYonQL(salesql);
      var vipresults = ObjectStore.queryByYonQL(vipsql);
      var accountresults = ObjectStore.queryByYonQL(accountsql);
      var custListMap = {};
      saleresults.forEach((saleresult) => {
        let custList = new Array();
        var custcode = saleresult.custcode;
        var arapdealmethod = saleresult.arapdealmethod;
        var paytypecode = saleresult.paytypecode;
        if (arapdealmethod != undefined && arapdealmethod == "应收") {
          paytypecode = "000000";
        }
        if (!custListMap.hasOwnProperty(custcode + "-" + paytypecode + "/" + arapdealmethod)) {
          custList.push(saleresult);
          custListMap[custcode + "-" + paytypecode + "/" + arapdealmethod] = custList;
        } else {
          custList = custListMap[custcode + "-" + paytypecode + "/" + arapdealmethod];
          custList.push(saleresult);
          custListMap[custcode + "-" + paytypecode + "/" + arapdealmethod] = custList;
        }
      });
      accountresults.forEach((accountresult) => {
        let custList = new Array();
        var custcode = accountresult.custcode;
        var accountmoney = accountresult.guazhangjine;
        var backmoney = accountresult.huaikuanjine;
        var arapdealmethod = "";
        var paytypecode = accountresult.zhifufangshibianma;
        if (accountmoney != undefined && accountmoney != 0) {
          arapdealmethod = "应收";
        }
        if (backmoney != undefined && backmoney != 0) {
          arapdealmethod = "收款";
        }
        if (arapdealmethod != undefined && arapdealmethod == "应收") {
          paytypecode = "000000";
        }
        if (!custListMap.hasOwnProperty(custcode + "-" + paytypecode + "/" + arapdealmethod)) {
          custList.push(accountresult);
          custListMap[custcode + "-" + paytypecode + "/" + arapdealmethod] = custList;
        } else {
          custList = custListMap[custcode + "-" + paytypecode + "/" + arapdealmethod];
          custList.push(accountresult);
          custListMap[custcode + "-" + paytypecode + "/" + arapdealmethod] = custList;
        }
      });
      vipresults.forEach((vipresult) => {
        let custList = new Array();
        var custname = ybresult.store;
        var custcode = vipcustcode;
        var arapdealmethod = vipresult.arapdealmethod;
        var paytypecode = "000000";
        if (!custListMap.hasOwnProperty(custcode + "-" + paytypecode + "/" + arapdealmethod)) {
          custList.push(vipresult);
          custListMap[custcode + "-" + paytypecode + "/" + arapdealmethod] = custList;
        } else {
          custList = custListMap[custcode + "-" + paytypecode + "/" + arapdealmethod];
          custList.push(vipresult);
          custListMap[custcode + "-" + paytypecode + "/" + arapdealmethod] = custList;
        }
      });
      for (var key in custListMap) {
        var senddatas = custListMap[key];
        var customer_code = key.substr(0, key.indexOf("-"));
        var paytypecode = key.substr(key.indexOf("-") + 1, key.indexOf("/") - key.indexOf("-") - 1);
        if (key.indexOf("应收") != -1) {
          var income = 0;
          var oarSon = new Array();
          senddatas.forEach((senddata) => {
            var money = parseFloat(senddata.aftermoveaccmoney == undefined ? (senddata.guazhangjine == undefined ? senddata.amountmoney : senddata.guazhangjine) : senddata.aftermoveaccmoney);
            var son = {
              hasDefaultInit: true,
              _status: "Insert",
              oriMoney: money,
              natMoney: money,
              taxRate: 0,
              natSum: money,
              oriSum: money,
              orderno: ybresult.dayclosecode
            };
            income = income + money;
            oarSon.push(son);
          });
          var oarbody = {
            currency: "G001ZM0000DEFAULTCURRENCT00000000001",
            basebilltype_name: "订单日报",
            accentity_code: ybresult.erporgcode,
            vouchdate: nowdate,
            billtype: 2,
            basebilltype_code: "arap_oar",
            tradetype_code: "arap_oar_other",
            customer_code: customer_code,
            exchRate: 1,
            exchangeRateType_code: "01",
            oriSum: income,
            invoicetype: 1,
            natSum: income,
            orderno: ybresult.dayclosecode,
            caobject: 1,
            oriMoney: income,
            natMoney: income,
            _status: "Insert"
          };
          oarbody["oarDetail"] = oarSon;
          oraArray.push(oarbody);
        }
        if (key.indexOf("收款") != -1) {
          var income = 0;
          var RecSon = new Array();
          var account = "";
          var serviceAttr = "";
          paytypedatas.forEach((paytypedata) => {
            if (paytypedata.code == paytypecode) {
              serviceAttr = paytypedata.serviceAttr;
            }
          });
          senddatas.forEach((senddata) => {
            var money = parseFloat(senddata.aftermoveaccmoney == undefined ? (senddata.huaikuanjine == undefined ? senddata.amountmoney : senddata.huaikuanjine) : senddata.aftermoveaccmoney);
            account = senddata.account == undefined ? "" : senddata.account;
            if (paytypecode == undefined) {
              account = "";
            }
            var isinadvance = senddata.isinadvance == undefined ? "N" : senddata.isinadvance;
            var quickType_code = isinadvance == "Y" ? "1" : "2";
            var son = {
              _status: "Insert",
              quickType_code: quickType_code,
              natSum: money,
              oriSum: money,
              orderno: ybresult.dayclosecode
            };
            income = income + money;
            RecSon.push(son);
          });
          var recbody = null;
          if (serviceAttr == "0" && account != "") {
            recbody = {
              currency: "G001ZM0000DEFAULTCURRENCT00000000001",
              accentity_code: ybresult.erporgcode,
              vouchdate: nowdate,
              billtype: 7,
              tradetype_code: "arap_receipt_other",
              customer_code: customer_code,
              exchRate: 1,
              exchangeRateType_code: "01",
              oriSum: income,
              natSum: income,
              settlemode_code: paytypecode,
              enterprisebankaccount_code: account,
              orderno: ybresult.dayclosecode,
              _status: "Insert"
            };
          } else if (serviceAttr == "1" && account != "") {
            recbody = {
              currency: "G001ZM0000DEFAULTCURRENCT00000000001",
              accentity_code: ybresult.erporgcode,
              vouchdate: nowdate,
              billtype: 7,
              tradetype_code: "arap_receipt_other",
              customer_code: customer_code,
              exchRate: 1,
              exchangeRateType_code: "01",
              oriSum: income,
              natSum: income,
              settlemode_code: paytypecode,
              cashaccount_code: account,
              orderno: ybresult.dayclosecode,
              _status: "Insert"
            };
          } else {
            recbody = {
              currency: "G001ZM0000DEFAULTCURRENCT00000000001",
              accentity_code: ybresult.erporgcode,
              vouchdate: nowdate,
              billtype: 7,
              tradetype_code: "arap_receipt_other",
              customer_code: customer_code,
              exchRate: 1,
              exchangeRateType_code: "01",
              oriSum: income,
              natSum: income,
              orderno: ybresult.dayclosecode,
              _status: "Insert"
            };
          }
          recbody["ReceiveBill_b"] = RecSon;
          recArray.push(recbody);
        }
      }
    });
    var oardata = {
      data: oraArray
    };
    var recdata = {
      data: recArray
    };
    if (oraArray.length <= 0 && recArray.length <= 0) {
      message = "无符合生单数据";
    } else {
      var oraresponseObj = "";
      var recresponseObj = "";
      if (oraArray.length > 0) {
        var oraResponse = postman("Post", reqoarurl, JSON.stringify(header), JSON.stringify(oardata));
        oraresponseObj = JSON.parse(oraResponse);
      }
      if (recArray.length > 0) {
        var reqResponse = postman("Post", reqrecurl, JSON.stringify(header), JSON.stringify(recdata));
        recresponseObj = JSON.parse(reqResponse);
      }
      if (("200" == oraresponseObj.code || oraresponseObj == "") && ("200" == recresponseObj.code || recresponseObj == "")) {
        var oradata = oraresponseObj.data;
        var recdata = recresponseObj.data;
        if (oradata != undefined) {
          let infos = oradata.infos;
          let messages = oradata.messages;
          messages.forEach((msg) => {
            if (message == "") {
              message = msg;
            } else {
              message = message + ";" + msg;
            }
          });
          infos.forEach((info) => {
            let billcodeno = info.orderno;
            var query_sql = "select id,issendora from GT13741AT37.GT13741AT37.dayclosebill where dayclosecode = '" + billcodeno + "'";
            var query_res = ObjectStore.queryByYonQL(query_sql);
            let closeBillObject = { id: query_res[0].id, issendora: "Y" };
            ObjectStore.updateById("GT13741AT37.GT13741AT37.dayclosebill", closeBillObject);
          });
        }
        if (recdata != undefined) {
          let infos = recdata.infos;
          let messages = recdata.messages;
          messages.forEach((msg) => {
            if (message == "") {
              message = msg;
            } else {
              message = message + ";" + msg;
            }
          });
          infos.forEach((info) => {
            let billcodeno = info.orderno;
            var query_sql = "select id,issendora from GT13741AT37.GT13741AT37.dayclosebill where dayclosecode = '" + billcodeno + "'";
            var query_res = ObjectStore.queryByYonQL(query_sql);
            let closeBillObject = { id: query_res[0].id, issendora: "Y" };
            ObjectStore.updateById("GT13741AT37.GT13741AT37.dayclosebill", closeBillObject);
          });
        }
      }
    }
    return { message: message };
  }
}
exports({ entryPoint: MyAPIHandler });