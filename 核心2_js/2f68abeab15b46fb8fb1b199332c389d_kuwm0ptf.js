let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var ybresults = param.data;
    //获取当前时间 格式：2020-10-26 00:00:00
    var nowdate = param.date1;
    //获取access_token
    let func1 = extrequire("GT26509AT22.ApiFunction.getAccessToken");
    let res = func1.execute();
    var token = res.access_token;
    //应收单
    var reqoarurl = "https://www.example.com/" + token;
    //收款单
    var reqrecurl = "https://www.example.com/" + token;
    //客户档案列表查询
    var reqcusturl = "https://www.example.com/" + token;
    //结算方式查询
    var reqpaytypeurl = "https://www.example.com/" + token;
    var contenttype = "application/json;charset=UTF-8";
    var message = "";
    var header = {
      "Content-Type": contenttype
    };
    //查询结算方式信息
    var paytypeResponse = postman("Post", reqpaytypeurl, JSON.stringify(header), "");
    var paytypedatas = JSON.parse(paytypeResponse).data;
    //应收数组
    var oraArray = new Array();
    //收款数组
    var recArray = new Array();
    ybresults.forEach((ybresult) => {
      var a = ybresult.dailystatement_2246006828978432;
      var storename = a[0].store;
      var vipcustcode = "";
      var custbody = {
        pageIndex: 0,
        pageSize: 0,
        name: storename
      };
      var custResponse = postman("Post", reqcusturl, JSON.stringify(header), JSON.stringify(custbody));
      //客户档案信息
      var custresponseobj = JSON.parse(custResponse);
      if ("200" == custresponseobj.code) {
        let data = custresponseobj.data;
        if (data != undefined) {
          let recordLists = data.recordList;
          if (recordLists != undefined && recordLists.length > 0) {
            //拿到客户编码
            vipcustcode = recordLists[0].code;
          }
        }
      }
      var jkl = ybresult[0].dailyCode;
      //找到当前日结单号对应的销售、会员、挂账信息
      //销售信息
      var salesql = "select * from GT26509AT22.GT26509AT22.SalesIncome where SalesIncomeFk in (select id from GT26509AT22.GT26509AT22.DailyStatement where dailyCode='" + ybresult[0].dailyCode + "')";
      //会员信息
      var vipsql = "select * from GT26509AT22.GT26509AT22.vipAccount where vipAccountFk in (select id from GT26509AT22.GT26509AT22.DailyStatement where dailyCode='" + ybresult[0].dailyCode + "')";
      // 挂账信息
      var accountsql =
        "select * from GT26509AT22.GT26509AT22.openAccount where openAccountFk in (select id from GT26509AT22.GT26509AT22.DailyStatement where dailyCode='" + ybresult[0].dailyCode + "')";
      var saleresults = ObjectStore.queryByYonQL(salesql);
      var vipresults = ObjectStore.queryByYonQL(vipsql);
      var accountresults = ObjectStore.queryByYonQL(accountsql);
      var custListMap = {};
      saleresults.forEach((saleresult) => {
        let custList = new Array();
        //客户编号
        var custcode = saleresult.clientCode;
        //财务处理方式
        var arapdealmethod = saleresult.handleStyle;
        //支付方式编码
        var paytypecode = saleresult.payTypeCode;
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
        var custcode = accountresult.clientCode;
        //挂账金额
        var accountmoney = accountresult.openAccount;
        //还款金额
        var backmoney = accountresult.repayAccount;
        //财务处理方式
        var arapdealmethod = "";
        //支付方式编码
        var paytypecode = accountresult.payTypeCode;
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
        var custname = ybresult[0].store;
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
            //调账后的金额为空的话 =
            //挂账金额为空的话为 挂账金额为实收金额，挂账金额不为空的话，就是挂账金额
            var money = parseFloat(senddata.reconPriceAfter == undefined ? (senddata.openAccount == undefined ? senddata.actualAccount : senddata.openAccount) : senddata.reconPriceAfter);
            var son = {
              hasDefaultInit: true,
              _status: "Insert",
              oriMoney: money,
              natMoney: money,
              taxRate: 0,
              natSum: money,
              oriSum: money,
              orderno: ybresult[0].dailyCode
            };
            income = income + money;
            oarSon.push(son);
          });
          var oarbody = {
            currency: "G001ZM0000DEFAULTCURRENCT00000000001",
            basebilltype_name: "订单日报",
            accentity_code: ybresult[0].orgCode,
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
            orderno: ybresult[0].dailyCode,
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
          //到这了
          paytypedatas.forEach((paytypedata) => {
            if (paytypedata.code == paytypecode) {
              serviceAttr = paytypedata.serviceAttr;
            }
          });
          senddatas.forEach((senddata) => {
            var money = parseFloat(senddata.reconPriceAfter == undefined ? (senddata.repayAccount == undefined ? senddata.actualAccount : senddata.repayAccount) : senddata.reconPriceAfter);
            account = senddata.account == undefined ? "" : senddata.account;
            if (paytypecode == undefined) {
              account = "";
            }
            var isinadvance = senddata.isRepet == undefined ? "N" : senddata.isRepet;
            var quickType_code = isinadvance == "Y" ? "1" : "2";
            var son = {
              _status: "Insert",
              quickType_code: quickType_code,
              natSum: money,
              oriSum: money,
              orderno: ybresult[0].dailyCode
            };
            income = income + money;
            RecSon.push(son);
          });
          var recbody = null;
          if (serviceAttr == "0" && account != "") {
            recbody = {
              currency: "G001ZM0000DEFAULTCURRENCT00000000001",
              accentity_code: ybresult[0].orgCode,
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
              orderno: ybresult[0].dailyCode,
              _status: "Insert"
            };
          } else if (serviceAttr == "1" && account != "") {
            recbody = {
              currency: "G001ZM0000DEFAULTCURRENCT00000000001",
              accentity_code: ybresult[0].orgCode,
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
              orderno: ybresult[0].dailyCode,
              _status: "Insert"
            };
          } else {
            recbody = {
              currency: "G001ZM0000DEFAULTCURRENCT00000000001",
              accentity_code: ybresult[0].orgCode,
              vouchdate: nowdate,
              billtype: 7,
              tradetype_code: "arap_receipt_other",
              customer_code: customer_code,
              exchRate: 1,
              exchangeRateType_code: "01",
              oriSum: income,
              natSum: income,
              orderno: ybresult[0].dailyCode,
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
      throw new Error(message);
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
            var query_sql = "select id,issendora from GT26509AT22.GT26509AT22.DailyStatement where dailyCode = '" + billcodeno + "'";
            var query_res = ObjectStore.queryByYonQL(query_sql);
            let closeBillObject = { id: query_res[0].id, issendora: "Y" };
            //删除时判断这个字段，如果这个字段为Y，则已推送，推送了不允许删除
            ObjectStore.updateById("GT26509AT22.GT26509AT22.DailyStatement", closeBillObject);
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
            var query_sql = "select id,issendora from GT26509AT22.GT26509AT22.DailyStatement where dailyCode = '" + billcodeno + "'";
            var query_res = ObjectStore.queryByYonQL(query_sql);
            let closeBillObject = { id: query_res[0].id, issendora: "Y" };
            ObjectStore.updateById("GT26509AT22.GT26509AT22.DailyStatement", closeBillObject);
          });
        }
      }
    }
    return { message: message };
  }
}
exports({ entryPoint: MyTrigger });