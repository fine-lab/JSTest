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
    let contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": contenttype,
      noCipherFlag: true
    };
    let userMobile = "17746559826";
    let response = [];
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var object = { voucher_date: sendDate, sale_accrual_h_id: row.id, voucher_status: 1 };
      var res = ObjectStore.selectByMap("GT65230AT76.GT65230AT76.sales_split_b", object);
      if (res.length > 0) {
        for (var j = 0; j < res.length; j++) {
          var pzmx = res[j];
          let body = {
            accbookCode: "81000001",
            voucherTypeCode: "1",
            makerMobile: userMobile,
            makeTime: sendDate,
            bodies: [
              {
                description: sendDate + "销售订单" + row.sale_code + "自动生成凭证",
                accsubjectCode: "11220101",
                debitOriginal: MoneyFormatReturnBd(pzmx.money, 2),
                debitOrg: MoneyFormatReturnBd(pzmx.money, 2),
                clientAuxiliaryList: [
                  {
                    filedCode: "0005",
                    valueCode: row.merchantCode
                  }
                ]
              },
              {
                description: sendDate + "销售订单" + row.sale_code + "自动生成凭证",
                accsubjectCode: "60010101",
                creditOriginal: MoneyFormatReturnBd(pzmx.wushuijine, 2),
                creditOrg: MoneyFormatReturnBd(pzmx.wushuijine, 2),
                clientAuxiliaryList: [
                  {
                    filedCode: "0005",
                    valueCode: row.merchantCode
                  },
                  {
                    filedCode: "0001",
                    valueCode: row.salesDepartment
                  },
                  {
                    filedCode: "0006",
                    valueCode: pzmx.wlclass_code
                  }
                ]
              },
              {
                description: sendDate + "销售订单" + row.sale_code + "自动生成凭证",
                accsubjectCode: "22210153",
                creditOriginal: MoneyFormatReturnBd(pzmx.shuie, 2),
                creditOrg: MoneyFormatReturnBd(pzmx.shuie, 2)
              }
            ]
          };
          let addVoucherResponse = postman("POST", addVoucherUrl, JSON.stringify(header), JSON.stringify(body));
          let addVoucherresponseobj = JSON.parse(addVoucherResponse);
          return { addVoucherresponseobj, body };
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