let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var ybresults = request.data;
    //前端函数传递的当前时间
    var nowdate = request.nowDate;
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
      var storename = ybresult.store;
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
      var jkl = ybresult.dailyCode;
      //找到当前日结单号对应的销售、会员、挂账信息
      //销售信息
      var salesql = "select * from GT26509AT22.GT26509AT22.SalesIncome where SalesIncomeFk in (select id from GT26509AT22.GT26509AT22.DailyStatement where dailyCode='" + ybresult.dailyCode + "')";
      //会员信息
      var vipsql = "select * from GT26509AT22.GT26509AT22.vipAccount where vipAccountFk in (select id from GT26509AT22.GT26509AT22.DailyStatement where dailyCode='" + ybresult.dailyCode + "')";
      // 挂账信息
      var accountsql = "select * from GT26509AT22.GT26509AT22.openAccount where openAccountFk in (select id from GT26509AT22.GT26509AT22.DailyStatement where dailyCode='" + ybresult.dailyCode + "')";
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
        //客户编码
        var customer_code = key.substr(0, key.indexOf("-"));
        var paytypecode = key.substr(key.indexOf("-") + 1, key.indexOf("/") - key.indexOf("-") - 1);
        //应收单的参数拼接
        if (key.indexOf("应收") != -1) {
          var income = 0;
          //获取结算方式信息
          var payTypeId = "";
          var payTypeName = "";
          paytypedatas.forEach((payData) => {
            if (payData.code == paytypecode) {
              payTypeId = payData.id;
              payTypeName = payData.name;
            }
          });
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
              orderno: ybresult.dailyCode
            };
            income = income + money;
            oarSon.push(son);
          });
          var oarbody = {
            currency: "2102947499529472",
            accentity_code: ybresult.orgCode,
            vouchdate: nowdate,
            basebilltype_name: "订单日报",
            billtype: 2,
            srcitem: 9,
            basebilltype_code: "arap_orderdaily",
            basebilltype: "HSFWYSGLYY8",
            tradetype: "2102947517993236",
            tradetype_name: "订单日报",
            customer_code: customer_code,
            exchRate: 1,
            exchangeRateType_code: "01",
            oriSum: income,
            invoicetype: 1,
            natSum: income,
            orderno: ybresult.dailyCode,
            //支付方式
            "headItem!define5_name": payTypeName,
            //支付方式id
            "headItem!define5": payTypeId,
            caobject: 1,
            oriMoney: income,
            natMoney: income,
            _status: "Insert"
          };
          oarbody["oarDetail"] = oarSon;
          oraArray.push(oarbody);
        }
        //收款单的参数拼接
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
              //款项类型 2：
              quickType_code: quickType_code,
              natSum: money,
              oriSum: money,
              orderno: ybresult.dailyCode
            };
            income = income + money;
            RecSon.push(son);
          });
          var recbody = null;
          if (serviceAttr == "0" && account != "") {
            recbody = {
              currency: "G001ZM0000DEFAULTCURRENCT00000000001",
              accentity_code: ybresult.orgCode,
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
              orderno: ybresult.dailyCode,
              _status: "Insert"
            };
          } else if (serviceAttr == "1" && account != "") {
            recbody = {
              currency: "G001ZM0000DEFAULTCURRENCT00000000001",
              accentity_code: ybresult.orgCode,
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
              orderno: ybresult.dailyCode,
              _status: "Insert"
            };
          } else {
            //收款单的参数拼接
            recbody = {
              //缺少code参数
              code: ybresult.dailyCode,
              //该从哪个实体里取
              "headItem!define2 ": 10,
              //币种精度(该从哪个实体里取),不写会报币种精度ID不能为空
              currency: "2102947499529472",
              accentity_code: ybresult.orgCode,
              vouchdate: nowdate,
              //事项类型 5:订单日报  7：收款单
              billtype: 5,
              basebilltype_name: "订单日报",
              //交易类型编码：其他收款
              tradetype_code: "arap_receipt_other",
              //客户编码
              customer_code: customer_code,
              //汇率
              exchRate: 1,
              //汇率类型编码
              exchangeRateType_code: "01",
              oriSum: income,
              natSum: income,
              orderno: ybresult.dailyCode,
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
          //根据订单号更新是否生成财务单据，订单号-》日结单号
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
exports({ entryPoint: MyAPIHandler });