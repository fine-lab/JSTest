let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var currentUser = JSON.parse(AppContext()).currentUser; //通过上下文获取当前的用户信息
    let rows = request.rows;
    let sale_code = request.sale_code;
    let ccount_type = request.ccount_type;
    let merchantCode = request.merchantCode;
    let bizhong = request.bizhong;
    let SalesOrg = request.SalesOrg;
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
    let bookBody = {
      conditions: [
        {
          field: "pk_org",
          value: SalesOrg,
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
    for (var i = 0; i < rows.length; i++) {
      let pzmx = rows[i];
      let getExchangerate = "https://www.example.com/" + token + "&endTime=" + pzmx.voucher_date + " 23:59:59";
      let rateResponse = postman("GET", getExchangerate, JSON.stringify(header), null);
      let rateresponseobj = JSON.parse(rateResponse);
      let rateList = [];
      let rate = 0;
      if ("200" == rateresponseobj.code) {
        var rateData = rateresponseobj.data;
        if (rateData.length > 0) {
          rateData.forEach((rates) => {
            if (rates.exchangeratetype == "m784i3g3" && (rates.sourcecurrency_id == "2548951700151045") & (rates.targetcurrency_id == "2548951700151040")) {
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
      let rateOrg = bizhong == "CNY" ? 1.0 : rate;
      let hanshuidebitOrg = new Big(Math.floor(MoneyFormatReturnBd(pzmx.money, 2) * rateOrg * 100) / 100);
      let wushuidebitOrg = new Big(Math.floor(MoneyFormatReturnBd(pzmx.wushuijine, 2) * rateOrg * 100) / 100);
      let body = {
        accbookCode: bookCode,
        voucherTypeCode: "1",
        makerMobile: userMobile,
        makeTime: pzmx.voucher_date,
        bodies: [
          {
            description: sendDate + "销售订单" + row.sale_code + "红冲凭证",
            accsubjectCode: ccount_type == "1" ? "112201" : "112202",
            currencyCode: bizhong,
            rateType: "01",
            rateOrg: rateOrg,
            debitOriginal: -MoneyFormatReturnBd(pzmx.money, 2),
            debitOrg: -hanshuidebitOrg,
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
            description: sendDate + "销售订单" + row.sale_code + "红冲凭证",
            accsubjectCode: ccount_type == "1" ? "600101" : "600102",
            currencyCode: bizhong,
            rateType: "01",
            rateOrg: rateOrg,
            creditOriginal: -MoneyFormatReturnBd(pzmx.wushuijine, 2),
            creditOrg: -wushuidebitOrg
          },
          {
            description: sendDate + "销售订单" + row.sale_code + "红冲凭证",
            accsubjectCode: "222101",
            currencyCode: bizhong,
            rateType: "01",
            rateOrg: rateOrg,
            creditOriginal: -MoneyFormatReturnBd(pzmx.shuie, 2),
            creditOrg: -hanshuidebitOrg.minus(wushuidebitOrg)
          }
        ]
      };
      let addVoucherResponse = postman("POST", addVoucherUrl, JSON.stringify(header), JSON.stringify(body));
      let addVoucherresponseobj = JSON.parse(addVoucherResponse);
      if ("200" == addVoucherresponseobj.code) {
        var object = { id: pzmx.id, voucher_status: "1", isHC: "2" };
        var res = ObjectStore.updateById("GT65230AT76.GT65230AT76.sales_split_b", object, "7a6a78a3");
      } else {
        response.push({ message: "销售订单" + sale_code + "生成凭证时间：" + pzmx.voucher_date + "失败原因" + addVoucherresponseobj.message, body: body });
      }
    }
    return { response };
  }
}
exports({ entryPoint: MyAPIHandler });