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
      var rowList = rows[i];
      var ID = rowList.id;
      var merchant = rowList.merchant;
      var method = rowList.revenueMethod;
      var sql = "select * from aa.merchant.Merchant where id = " + merchant + "";
      var res = ObjectStore.queryByYonQL(sql, "productcenter");
      var qq = "select * from aa.custcategory.CustCategory where id = '" + res[0].customerClass + "'";
      var ss = ObjectStore.queryByYonQL(qq, "productcenter");
      var sqqq = "select * from GT65230AT76.GT65230AT76.sales_split_b where voucher_date = '" + sendDate + "' and voucher_status = '1'";
      var qwe = ObjectStore.queryByYonQL(sqqq, "developplatform");
      var queryMain = "select * from GT65230AT76.GT65230AT76.sale_accrual_h where id = '" + ID + "'";
      var mainRes = ObjectStore.queryByYonQL(queryMain, "developplatform");
      if (qwe.length != 0) {
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
              value: rows[i].productType,
              field: "name",
              operator: "like"
            }
          ]
        };
        let apiResponse = postman("POST", queryUrl, JSON.stringify(header), JSON.stringify(body));
        let apiResponseobj = JSON.parse(apiResponse);
        if (apiResponseobj.code == "200") {
          var array1 = apiResponseobj.data;
          for (var kl = 0; kl < unique(array1, "code").length; kl++) {
            var codeValue = unique(array1, "code")[kl].code;
            if (method != "分摊") {
              if (ss[0].code == "C0" || ss[0].code == "C2") {
                if (
                  codeValue == "60010101" ||
                  codeValue == "60010102" ||
                  codeValue == "60010103" ||
                  codeValue == "60010104" ||
                  codeValue == "60010105" ||
                  codeValue == "60010106" ||
                  codeValue == "60010107" ||
                  codeValue == "60010201" ||
                  codeValue == "60010202" ||
                  codeValue == "60010203"
                ) {
                  for (var j = 0; j < qwe.length; j++) {
                    var pzmx = qwe[j];
                    let body = {
                      accbookCode: "81000001",
                      voucherTypeCode: "1",
                      makerMobile: userMobile,
                      makeTime: sendDate,
                      bodies: [
                        {
                          description: sendDate + "销售订单" + rowList.sale_code + "自动生成凭证",
                          accsubjectCode: "11220101",
                          debitOriginal: MoneyFormatReturnBd(pzmx.wushuijine, 2),
                          debitOrg: MoneyFormatReturnBd(pzmx.wushuijine, 2),
                          clientAuxiliaryList: [
                            {
                              filedCode: "0005",
                              valueCode: rowList.merchantCode
                            }
                          ]
                        },
                        {
                          description: sendDate + "销售订单" + rowList.sale_code + "自动生成凭证",
                          accsubjectCode: codeValue,
                          creditOriginal: MoneyFormatReturnBd(pzmx.wushuijine, 2),
                          creditOrg: MoneyFormatReturnBd(pzmx.wushuijine, 2),
                          clientAuxiliaryList: [
                            {
                              filedCode: "0005",
                              valueCode: rowList.merchantCode
                            },
                            {
                              filedCode: "0001",
                              valueCode: rowList.salesCode
                            },
                            {
                              filedCode: "0006",
                              valueCode: pzmx.wlclass_code
                            }
                          ]
                        }
                      ]
                    };
                    let number = mainRes[0].wushuijine - pzmx.wushuijine;
                    let addVoucherResponse = postman("POST", addVoucherUrl, JSON.stringify(header), JSON.stringify(body));
                    let addVoucherresponseobj = JSON.parse(addVoucherResponse);
                    if ("200" == addVoucherresponseobj.code) {
                      let objectA = { id: ID, sales_split_bList: [{ id: pzmx.id, voucher_status: "2", _status: "Update" }] };
                      let resA = ObjectStore.updateById("GT65230AT76.GT65230AT76.sale_accrual_h", objectA, "7a6a78a3");
                      let objectB = { id: ID, _status: "Update", wushuijine: number };
                      let resB = ObjectStore.updateById("GT65230AT76.GT65230AT76.sale_accrual_h", objectB, "7a6a78a3");
                    } else {
                      response.push({ message: "销售订单" + rowList.sale_code + "生成凭证时间：" + sendDate + "失败原因" + addVoucherresponseobj.message, body: body });
                    }
                    return { addVoucherresponseobj, body };
                  }
                }
              } else {
                if (
                  codeValue == "60011102" ||
                  codeValue == "60011103" ||
                  codeValue == "60011104" ||
                  codeValue == "60011105" ||
                  codeValue == "60011106" ||
                  codeValue == "60011107" ||
                  codeValue == "60011201" ||
                  codeValue == "60011202" ||
                  codeValue == "60011203"
                ) {
                  for (var w = 0; w < qwe.length; w++) {
                    var pzbc = qwe[w];
                    let body = {
                      accbookCode: "81000001",
                      voucherTypeCode: "1",
                      makerMobile: userMobile,
                      makeTime: sendDate,
                      bodies: [
                        {
                          description: sendDate + "销售订单" + rowList.sale_code + "自动生成凭证",
                          accsubjectCode: "11220101",
                          debitOriginal: MoneyFormatReturnBd(pzbc.wushuijine, 2),
                          debitOrg: MoneyFormatReturnBd(pzbc.wushuijine, 2),
                          clientAuxiliaryList: [
                            {
                              filedCode: "0005",
                              valueCode: rowList.merchantCode
                            }
                          ]
                        },
                        {
                          description: sendDate + "销售订单" + rowList.sale_code + "自动生成凭证",
                          accsubjectCode: codeValue,
                          creditOriginal: MoneyFormatReturnBd(pzbc.wushuijine, 2),
                          creditOrg: MoneyFormatReturnBd(pzbc.wushuijine, 2),
                          clientAuxiliaryList: [
                            {
                              filedCode: "0005",
                              valueCode: rowList.merchantCode
                            },
                            {
                              filedCode: "0001",
                              valueCode: rowList.salesCode
                            },
                            {
                              filedCode: "0006",
                              valueCode: pzbc.wlclass_code
                            }
                          ]
                        }
                      ]
                    };
                    let numberOne = mainRes[0].wushuijine - pzbc.wushuijine;
                    let addVoucherResponse = postman("POST", addVoucherUrl, JSON.stringify(header), JSON.stringify(body));
                    let addVoucherresponseobj = JSON.parse(addVoucherResponse);
                    if ("200" == addVoucherresponseobj.code) {
                      let objectC = { id: ID, sales_split_bList: [{ id: pzbc.id, voucher_status: "2", _status: "Update" }] };
                      let resC = ObjectStore.updateById("GT65230AT76.GT65230AT76.sale_accrual_h", objectC, "7a6a78a3");
                      let objectD = { id: ID, _status: "Update", wushuijine: numberOne };
                      let resD = ObjectStore.updateById("GT65230AT76.GT65230AT76.sale_accrual_h", objectD, "7a6a78a3");
                    } else {
                      response.push({ message: "销售订单" + rowList.sale_code + "生成凭证时间：" + sendDate + "失败原因" + addVoucherresponseobj.message, body: body });
                    }
                    return { addVoucherresponseobj, body };
                  }
                }
              }
            } else {
              if (ss[0].code == "C0" || ss[0].code == "C2") {
                if (
                  codeValue == "60010101" ||
                  codeValue == "60010102" ||
                  codeValue == "60010103" ||
                  codeValue == "60010104" ||
                  codeValue == "60010105" ||
                  codeValue == "60010106" ||
                  codeValue == "60010107" ||
                  codeValue == "60010201" ||
                  codeValue == "60010202" ||
                  codeValue == "60010203"
                ) {
                  for (var b = 0; b < qwe.length; b++) {
                    var pzmxl = qwe[b];
                    let body = {
                      accbookCode: "81000001",
                      voucherTypeCode: "1",
                      makerMobile: userMobile,
                      makeTime: sendDate,
                      bodies: [
                        {
                          description: sendDate + "销售订单" + rowList.sale_code + "自动生成凭证",
                          accsubjectCode: "11220101",
                          debitOriginal: MoneyFormatReturnBd(pzmxl.wushuijine, 2),
                          debitOrg: MoneyFormatReturnBd(pzmxl.wushuijine, 2),
                          clientAuxiliaryList: [
                            {
                              filedCode: "0005",
                              valueCode: rowList.merchantCode
                            }
                          ]
                        },
                        {
                          description: sendDate + "销售订单" + rowList.sale_code + "自动生成凭证",
                          accsubjectCode: "22040101",
                          creditOriginal: MoneyFormatReturnBd(pzmxl.wushuijine, 2),
                          creditOrg: MoneyFormatReturnBd(pzmxl.wushuijine, 2),
                          clientAuxiliaryList: [
                            {
                              filedCode: "0005",
                              valueCode: rowList.merchantCode
                            }
                          ]
                        },
                        {
                          description: sendDate + "销售订单" + rowList.sale_code + "自动生成凭证",
                          accsubjectCode: "22040101",
                          debitOriginal: MoneyFormatReturnBd(pzmxl.wushuijine, 2),
                          debitOrg: MoneyFormatReturnBd(pzmxl.wushuijine, 2),
                          clientAuxiliaryList: [
                            {
                              filedCode: "0005",
                              valueCode: rowList.merchantCode
                            }
                          ]
                        },
                        {
                          description: sendDate + "销售订单" + rowList.sale_code + "自动生成凭证",
                          accsubjectCode: codeValue,
                          creditOriginal: MoneyFormatReturnBd(pzmxl.wushuijine, 2),
                          creditOrg: MoneyFormatReturnBd(pzmxl.wushuijine, 2),
                          clientAuxiliaryList: [
                            {
                              filedCode: "0005",
                              valueCode: rowList.merchantCode
                            },
                            {
                              filedCode: "0001",
                              valueCode: rowList.salesCode
                            },
                            {
                              filedCode: "0006",
                              valueCode: pzmxl.wlclass_code
                            }
                          ]
                        }
                      ]
                    };
                    let numberTwo = mainRes[0].wushuijine - pzmxl.wushuijine;
                    let addVoucherResponse = postman("POST", addVoucherUrl, JSON.stringify(header), JSON.stringify(body));
                    let addVoucherresponseobj = JSON.parse(addVoucherResponse);
                    if ("200" == addVoucherresponseobj.code) {
                      let objectE = { id: ID, sales_split_bList: [{ id: pzmxl.id, voucher_status: "2", _status: "Update" }] };
                      let resE = ObjectStore.updateById("GT65230AT76.GT65230AT76.sale_accrual_h", objectE, "7a6a78a3");
                      let objectF = { id: ID, _status: "Update", wushuijine: numberTwo };
                      let resF = ObjectStore.updateById("GT65230AT76.GT65230AT76.sale_accrual_h", objectF, "7a6a78a3");
                    } else {
                      response.push({ message: "销售订单" + rowList.sale_code + "生成凭证时间：" + sendDate + "失败原因" + addVoucherresponseobj.message, body: body });
                    }
                    return { addVoucherresponseobj, body };
                  }
                }
              } else {
                if (
                  codeValue == "60011102" ||
                  codeValue == "60011103" ||
                  codeValue == "60011104" ||
                  codeValue == "60011105" ||
                  codeValue == "60011106" ||
                  codeValue == "60011107" ||
                  codeValue == "60011201" ||
                  codeValue == "60011202" ||
                  codeValue == "60011203"
                ) {
                  for (var t = 0; t < qwe.length; t++) {
                    var pzbcl = qwe[t];
                    let body = {
                      accbookCode: "81000001",
                      voucherTypeCode: "1",
                      makerMobile: userMobile,
                      makeTime: sendDate,
                      bodies: [
                        {
                          description: sendDate + "销售订单" + rowList.sale_code + "自动生成凭证",
                          accsubjectCode: "11220101",
                          debitOriginal: MoneyFormatReturnBd(pzbcl.wushuijine, 2),
                          debitOrg: MoneyFormatReturnBd(pzbcl.wushuijine, 2),
                          clientAuxiliaryList: [
                            {
                              filedCode: "0005",
                              valueCode: rowList.merchantCode
                            }
                          ]
                        },
                        {
                          description: sendDate + "销售订单" + rowList.sale_code + "自动生成凭证",
                          accsubjectCode: "22040101",
                          creditOriginal: MoneyFormatReturnBd(pzbcl.wushuijine, 2),
                          creditOrg: MoneyFormatReturnBd(pzbcl.wushuijine, 2),
                          clientAuxiliaryList: [
                            {
                              filedCode: "0005",
                              valueCode: rowList.merchantCode
                            }
                          ]
                        },
                        {
                          description: sendDate + "销售订单" + rowList.sale_code + "自动生成凭证",
                          accsubjectCode: "22040101",
                          debitOriginal: MoneyFormatReturnBd(pzbcl.wushuijine, 2),
                          debitOrg: MoneyFormatReturnBd(pzbcl.wushuijine, 2),
                          clientAuxiliaryList: [
                            {
                              filedCode: "0005",
                              valueCode: rowList.merchantCode
                            }
                          ]
                        },
                        {
                          description: sendDate + "销售订单" + rowList.sale_code + "自动生成凭证",
                          accsubjectCode: codeValue,
                          creditOriginal: MoneyFormatReturnBd(pzbcl.wushuijine, 2),
                          creditOrg: MoneyFormatReturnBd(pzbcl.wushuijine, 2),
                          clientAuxiliaryList: [
                            {
                              filedCode: "0005",
                              valueCode: rowList.merchantCode
                            },
                            {
                              filedCode: "0001",
                              valueCode: rowList.salesCode
                            },
                            {
                              filedCode: "0006",
                              valueCode: pzbcl.wlclass_code
                            }
                          ]
                        }
                      ]
                    };
                    let numberThree = mainRes[0].wushuijine - pzbcl.wushuijine;
                    let addVoucherResponse = postman("POST", addVoucherUrl, JSON.stringify(header), JSON.stringify(body));
                    let addVoucherresponseobj = JSON.parse(addVoucherResponse);
                    if ("200" == addVoucherresponseobj.code) {
                      let objectG = { id: ID, sales_split_bList: [{ id: pzbcl.id, voucher_status: "2", _status: "Update" }] };
                      let resG = ObjectStore.updateById("GT65230AT76.GT65230AT76.sale_accrual_h", objectG, "7a6a78a3");
                      let objectH = { id: ID, _status: "Update", wushuijine: numberThree };
                      let resH = ObjectStore.updateById("GT65230AT76.GT65230AT76.sale_accrual_h", objectH, "7a6a78a3");
                    } else {
                      response.push({ message: "销售订单" + rowList.sale_code + "生成凭证时间：" + sendDate + "失败原因" + addVoucherresponseobj.message, body: body });
                    }
                    return { addVoucherresponseobj, body };
                  }
                }
              }
            }
          }
        }
      } else {
        let err = "未查到该凭证日期" + sendDate + "未生成凭证的单据";
        return { err };
      }
    }
    return { response };
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