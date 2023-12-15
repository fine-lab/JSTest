let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var currentUser = JSON.parse(AppContext()).currentUser; //通过上下文获取当前的用户信息
    let rows = request.rows;
    let sendDate = request.sendDate;
    let func1 = extrequire("GT65230AT76.backDefaultGroup.getApitoken");
    let resToken = func1.execute();
    var token = resToken.access_token;
    let addVoucherUrl = "https://www.example.com/" + token;
    let getBookUrl = "https://www.example.com/" + token;
    let contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": contenttype,
      noCipherFlag: true
    };
    let isNext = true;
    let index = 1;
    let response = [];
    let getExchangerate = "https://www.example.com/" + token + "&endTime=" + sendDate + " 23:59:59";
    let rateResponse = postman("GET", getExchangerate, JSON.stringify(header), null);
    let rateresponseobj = JSON.parse(rateResponse);
    let rateList = [];
    let rate = 0;
    if ("200" == rateresponseobj.code) {
      var rateData = rateresponseobj.data;
      if (rateData.length > 0) {
        rateData.forEach((rates) => {
          if (rates.enable == "1" && rates.exchangeratetype == "m784i3g3" && rates.sourcecurrency_id == "2548951700151045" && rates.targetcurrency_id == "2548951700151040") {
            rateList.push(rates);
          }
        });
      }
      if (rateList.length > 0) {
        rateList.sort(function (a, b) {
          return Date.parse(b.quotationdate) - Date.parse(a.quotationdate);
        });
      }
      let rateresult = rateList[0];
      rate = rateresult.exchangerate;
    }
    var getUserData = "https://www.example.com/" + token;
    var userIDBody = {
      userIds: [currentUser.id]
    };
    let userMobile = "";
    let userResponse = postman("POST", getUserData, JSON.stringify(header), JSON.stringify(userIDBody));
    let userresponseobj = JSON.parse(userResponse);
    if ("200" == userresponseobj.code) {
      var users = userresponseobj.data;
      var user = users[0];
      userMobile = user.userMobile;
    }
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var pzrate = row.bizhong == "CNY" ? 1.0 : rate;
      var merchant_update_date = row.merchant_update_date;
      var isUpdateMerchant = false;
      if (typeof merchant_update_date == "undefined" || merchant_update_date == null || merchant_update_date == "") {
        isUpdateMerchant = false;
      } else {
        isUpdateMerchant = true;
      }
      let bookBody = {
        conditions: [
          {
            field: "pk_org",
            value: row.BaseOrg,
            operator: "="
          }
        ]
      };
      let bookResponse = postman("POST", getBookUrl, JSON.stringify(header), JSON.stringify(bookBody));
      let bookresponseobj = JSON.parse(bookResponse);
      let bookCode = "";
      if ("200" == bookresponseobj.code) {
        var books = bookresponseobj.data;
        var book = books[0];
        bookCode = book.code;
      }
      var object = { voucher_date: sendDate, sale_accrual_h_id: row.id, voucher_status: 1 };
      var res = ObjectStore.selectByMap("GT65230AT76.GT65230AT76.sales_split_b", object);
      if (res.length > 0) {
        for (var j = 0; j < res.length; j++) {
          var pzmx = res[j];
          var hanshuidebitOrg = new Big(Math.floor(MoneyFormatReturnBd(pzmx.money, 2) * pzrate * 100) / 100);
          var wushuidebitOrg = new Big(Math.floor(MoneyFormatReturnBd(pzmx.wushuijine, 2) * pzrate * 100) / 100);
          let body = {
            accbookCode: bookCode,
            voucherTypeCode: "1",
            makerMobile: userMobile,
            makeTime: sendDate,
            bodies: [
              {
                description: sendDate + "销售订单" + row.sale_code + "自动生成凭证",
                accsubjectCode: row.ccount_type == "1" ? "112201" : "112202",
                currencyCode: row.bizhong,
                rateType: "01",
                rateOrg: pzrate,
                debitOriginal: MoneyFormatReturnBd(pzmx.money, 2),
                debitOrg: hanshuidebitOrg,
                clientAuxiliaryList: [
                  {
                    filedCode: "0005",
                    valueCode: isUpdateMerchant ? row.merchant_update_code : row.merchantCode
                  },
                  {
                    filedCode: "0006",
                    valueCode: pzmx.wlclass_code
                  }
                ]
              },
              {
                description: sendDate + "销售订单" + row.sale_code + "自动生成凭证",
                accsubjectCode: row.ccount_type == "1" ? "600101" : "600102",
                currencyCode: row.bizhong,
                rateType: "01",
                rateOrg: pzrate,
                creditOriginal: MoneyFormatReturnBd(pzmx.wushuijine, 2),
                creditOrg: wushuidebitOrg
              },
              {
                description: sendDate + "销售订单" + row.sale_code + "自动生成凭证",
                accsubjectCode: "222101",
                currencyCode: row.bizhong,
                rateType: "01",
                rateOrg: pzrate,
                creditOriginal: MoneyFormatReturnBd(pzmx.shuie, 2),
                creditOrg: hanshuidebitOrg.minus(wushuidebitOrg)
              }
            ]
          };
          let addVoucherResponse = postman("POST", addVoucherUrl, JSON.stringify(header), JSON.stringify(body));
          let addVoucherresponseobj = JSON.parse(addVoucherResponse);
          if ("200" == addVoucherresponseobj.code) {
            var object = { id: pzmx.id, voucher_status: "2" };
            var res = ObjectStore.updateById("GT65230AT76.GT65230AT76.sales_split_b", object, "7a6a78a3");
          } else {
            response.push({ message: "销售订单" + row.sale_code + "生成凭证时间：" + sendDate + "失败原因" + addVoucherresponseobj.message, body: body });
          }
        }
      }
    }
    return { response };
  }
}
exports({ entryPoint: MyAPIHandler });