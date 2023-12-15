let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var rows = request.rows;
    var sendDate = request.sendDate;
    var currentUser = JSON.parse(AppContext()).currentUser; //通过上下文获取当前的用户信息
    let func1 = extrequire("GT65230AT76.backDefaultGroup.getApitoken");
    let resToken = func1.execute();
    var token = resToken.access_token;
    var addVoucherUrl = "https://www.example.com/" + token;
    let contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": contenttype,
      noCipherFlag: true
    };
    var userMobile = "17746559826";
    var response = [];
    for (var i = 0; i < rows.length; i++) {
      var rowArray = rows[i];
      var ID = rowArray.id;
      // 主表
      var sql2 = "select * from GT65230AT76.GT65230AT76.sale_accrual_h where id = '" + ID + "'";
      var res2 = ObjectStore.queryByYonQL(sql2, "developplatform");
      // 子表
      var sql = "select * from GT65230AT76.GT65230AT76.sales_split_b where voucher_date = '" + sendDate + "' and voucher_status = '1'";
      var res = ObjectStore.queryByYonQL(sql, "developplatform");
      for (var q = 0; q < res2.length; q++) {
        if (res2.length != 0) {
          if (res.length != 0) {
            for (var j = 0; j < res.length; j++) {
              var queryUrl = "https://www.example.com/" + token;
              let contenttype = "application/json;charset=UTF-8";
              let header = {
                "Content-Type": contenttype,
                noCipherFlag: true
              };
              let body = {
                fields: ["name", "code"],
                conditions: [
                  {
                    value: res[j].shuilv,
                    field: "name",
                    operator: "like"
                  }
                ]
              };
              var number = res2[0].shuie - res[j].shuie;
              let apiResponse = postman("POST", queryUrl, JSON.stringify(header), JSON.stringify(body));
              let apiResponseobj = JSON.parse(apiResponse);
              if (apiResponseobj.code == "200") {
                var array1 = apiResponseobj.data;
                for (var k = 0; k < unique(array1, "code").length; k++) {
                  var codeValue = unique(array1, "code")[k].code;
                  if (codeValue == "22210151" || codeValue == "22210152" || codeValue == "22210153" || codeValue == "22210154" || codeValue == "22210155" || codeValue == "22210156") {
                    var slpz = res[j];
                    let body = {
                      accbookCode: "81000001",
                      voucherTypeCode: "1",
                      makerMobile: userMobile,
                      makeTime: sendDate,
                      bodies: [
                        {
                          description: sendDate + "销售订单" + rowArray.sale_code + "自动生成凭证",
                          accsubjectCode: "11220101",
                          debitOriginal: MoneyFormatReturnBd(slpz.shuie, 2),
                          debitOrg: MoneyFormatReturnBd(slpz.shuie, 2),
                          clientAuxiliaryList: [
                            {
                              filedCode: "0005",
                              valueCode: rowArray.merchantCode
                            }
                          ]
                        },
                        {
                          description: sendDate + "销售订单" + rowArray.sale_code + "自动生成凭证",
                          accsubjectCode: codeValue,
                          creditOriginal: MoneyFormatReturnBd(slpz.shuie, 2),
                          creditOrg: MoneyFormatReturnBd(slpz.shuie, 2)
                        }
                      ]
                    };
                    let addVoucherResponse = postman("POST", addVoucherUrl, JSON.stringify(header), JSON.stringify(body));
                    let addVoucherresponseobj = JSON.parse(addVoucherResponse);
                    if ("200" == addVoucherresponseobj.code) {
                      var wqw = "select * from GT65230AT76.GT65230AT76.sales_split_b where sale_accrual_h_id = 'youridHere'";
                      var res1 = ObjectStore.queryByYonQL(wqw, "developplatform");
                      var object = { id: rows[i].id, sales_split_bList: [{ id: slpz.id, voucher_status: "2", _status: "Update" }] };
                      var res00 = ObjectStore.updateById("GT65230AT76.GT65230AT76.sale_accrual_h", object, "7a6a78a3");
                      var object1 = { id: rows[i].id, _status: "Update", shuie: number };
                      var reslt = ObjectStore.updateById("GT65230AT76.GT65230AT76.sale_accrual_h", object1, "7a6a78a3");
                    } else {
                      response.push({ message: "销售订单" + rowArray.sale_code + "生成凭证时间：" + sendDate + "失败原因" + addVoucherresponseobj.message, body: body });
                    }
                    return { addVoucherresponseobj, body };
                  }
                }
              } else {
                response.push({ message: "销售订单" + rowArray.sale_code + "生成凭证时间：" + sendDate + "失败原因" + apiResponseobj.message, body: body });
              }
            }
          } else {
            let err = "未查到该凭证日期" + sendDate + "未生成凭证的单据";
            return { err };
          }
        } else {
          let err = "未查到该凭证日期" + sendDate;
          return { err };
        }
      }
      return { response };
    }
    function unique(arr, u_key) {
      const obj = {};
      const result = [];
      arr.forEach((item) => {
        const typeof_key = typeof item[u_key] + item[u_key];
        obj[typeof_key] = item;
      });
      for (const key in obj) {
        result.push(obj[key]);
      }
      return result;
    }
  }
}
exports({ entryPoint: MyAPIHandler });