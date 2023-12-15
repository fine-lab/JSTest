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
    var contenttype = "application/json;charset=UTF-8";
    var header = {
      "Content-Type": contenttype
    };
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
        if (!custListMap.hasOwnProperty(custcode + "-" + arapdealmethod)) {
          custList.push(saleresult);
          custListMap[custcode + "-" + arapdealmethod] = custList;
        } else {
          custList = custListMap[custcode + "-" + arapdealmethod];
          custList.push(saleresult);
          custListMap[custcode + "-" + arapdealmethod] = custList;
        }
      });
      accountresults.forEach((accountresult) => {
        let custList = new Array();
        var custcode = accountresult.custcode;
        var accountmoney = accountresult.guazhangjine;
        var backmoney = accountresult.huaikuanjine;
        var arapdealmethod = "";
        if (accountmoney != undefined && accountmoney != 0) {
          arapdealmethod = "应收";
        }
        if (backmoney != undefined && backmoney != 0) {
          arapdealmethod = "收款";
        }
        if (!custListMap.hasOwnProperty(custcode + "-" + arapdealmethod)) {
          custList.push(accountresult);
          custListMap[custcode + "-" + arapdealmethod] = custList;
        } else {
          custList = custListMap[custcode + "-" + arapdealmethod];
          custList.push(accountresult);
          custListMap[custcode + "-" + arapdealmethod] = custList;
        }
      });
      vipresults.forEach((vipresult) => {
        let custList = new Array();
        var custname = ybresult.store;
        var custcode = vipcustcode;
        var arapdealmethod = vipresult.arapdealmethod;
        if (!custListMap.hasOwnProperty(custcode + "-" + arapdealmethod)) {
          custList.push(vipresult);
          custListMap[custcode + "-" + arapdealmethod] = custList;
        } else {
          custList = custListMap[custcode + "-" + arapdealmethod];
          custList.push(vipresult);
          custListMap[custcode + "-" + arapdealmethod] = custList;
        }
      });
      for (var key in custListMap) {
        var senddatas = custListMap[key];
        var customer_code = key.substr(0, key.indexOf("-"));
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
          senddatas.forEach((senddata) => {
            var money = parseFloat(senddata.aftermoveaccmoney == undefined ? (senddata.huaikuanjine == undefined ? senddata.amountmoney : senddata.huaikuanjine) : senddata.aftermoveaccmoney);
            var son = {
              _status: "Insert",
              quickType_code: "2",
              natSum: money,
              oriSum: money,
              orderno: ybresult.dayclosecode
            };
            income = income + money;
            RecSon.push(son);
          });
          var recbody = {
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
    var oraResponse = postman("Post", reqoarurl, JSON.stringify(header), JSON.stringify(oardata));
    var reqResponse = postman("Post", reqrecurl, JSON.stringify(header), JSON.stringify(recdata));
    var oraresponseObj = JSON.parse(oraResponse);
    var recresponseObj = JSON.parse(reqResponse);
    if ("200" == oraresponseObj.code && "200" == recresponseObj.code) {
      var oradata = oraresponseObj.data;
      var recdata = recresponseObj.data;
      if (oradata != undefined) {
        let infos = oradata.infos;
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
        infos.forEach((info) => {
          let billcodeno = info.orderno;
          var query_sql = "select id,issendora from GT13741AT37.GT13741AT37.dayclosebill where dayclosecode = '" + billcodeno + "'";
          var query_res = ObjectStore.queryByYonQL(query_sql);
          let closeBillObject = { id: query_res[0].id, issendora: "Y" };
          ObjectStore.updateById("GT13741AT37.GT13741AT37.dayclosebill", closeBillObject);
        });
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });