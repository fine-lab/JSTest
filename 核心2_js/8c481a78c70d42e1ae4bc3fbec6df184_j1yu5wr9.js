let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let rows = request.rows;
    let agentId = request.agentId;
    let code = request.code;
    let merchantApplyRangeId = request.merchantApplyRangeId;
    let func1 = extrequire("GT46163AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(request);
    let token = res.access_token;
    //客户详情
    let getKHurl = "https://www.example.com/" + token + "&id=" + agentId + "&code=" + code + "&merchantApplyRangeId=" + merchantApplyRangeId;
    //销售订单列表
    let getXSDDurl = "https://www.example.com/" + token;
    //销售退货列表
    let getXSTHurl = "https://www.example.com/" + token;
    let contenttype = "application/json;charset=UTF-8";
    let message = "";
    let header = {
      "Content-Type": contenttype
    };
    var custResponse1 = postman("GET", getKHurl, JSON.stringify(header), null);
    var custresponseobj1 = JSON.parse(custResponse1);
    if ("200" == custresponseobj1.code) {
      let rst1 = custresponseobj1.data;
      let khflId = rst1.customerClass;
      let custCategoryApplyRangesIds = rst1.merchantApplyRanges;
      let custCategoryApplyRangesId = custCategoryApplyRangesIds[0].id;
      //客户分类详情
      let getKHFLurl = "https://www.example.com/" + token + "&id=" + khflId + "&custCategoryApplyRangesId=" + custCategoryApplyRangesId;
      let custResponse2 = postman("GET", getKHFLurl, JSON.stringify(header), null);
      let custresponseobj2 = JSON.parse(custResponse2);
      if ("200" == custresponseobj2.code) {
        let rst2 = custresponseobj2.data;
        let isQiyong = rst2["custCategoryDefines!define2"];
        let qiyDate = rst2["custCategoryDefines!define1"];
        if (isQiyong != undefined && isQiyong == "启用") {
          for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            let productId = row.kehubianma;
            let thxssl = row.tuihuoxiaoshoushuliang * row.xiaoshouhuansuanlv;
            let totalxs = 0;
            let totaltuihuo = 0;
            let xsbody = {
              pageIndex: 0,
              pageSize: 0,
              open_orderDate_begin: qiyDate,
              nextStatusName: "TAKEDELIVERY",
              isSum: false,
              simpleVOs: [
                {
                  op: "eq",
                  value1: agentId,
                  field: "agentId"
                }
              ]
            };
            let custResponse3 = postman("Post", getXSDDurl, JSON.stringify(header), JSON.stringify(xsbody));
            let custresponseobj3 = JSON.parse(custResponse3);
            if ("200" == custresponseobj3.code) {
              let rst3 = custresponseobj3.data;
              let xslist = rst3.recordList;
              xslist.forEach((param1) => {
                if (param1.productId == productId) {
                  totalxs += param1.sendQty;
                }
              });
              if (totalxs > 0) {
                var thbody = {
                  open_createTime_begin: qiyDate,
                  pageIndex: 0,
                  pageSize: 0,
                  saleReturnStatus: "ENDSALERETURN",
                  isSum: false,
                  simpleVOs: [
                    {
                      op: "eq",
                      value1: agentId,
                      field: "agentId"
                    }
                  ]
                };
                let custResponse4 = postman("POST", getXSTHurl, JSON.stringify(header), JSON.stringify(thbody));
                let custresponseobj4 = JSON.parse(custResponse4);
                if ("200" == custresponseobj4.code) {
                  let rst4 = custresponseobj4.data;
                  let list = rst4.recordList;
                  list.forEach((param) => {
                    if (param.productId == productId) {
                      totaltuihuo += param.totalOutStockQuantity;
                    }
                  });
                  if (thxssl > totalxs - totaltuihuo) {
                    return { code: 3 };
                  } else {
                    return { code: 4 };
                  }
                } else {
                  return { code: 0 };
                }
              } else {
                return { code: 2 };
              }
            } else {
              return { code: 0 };
            }
          }
        } else {
          return { code: 1 };
        }
      } else {
        return { code: 0 };
      }
    } else {
      return { code: 0 };
    }
  }
}
exports({ entryPoint: MyAPIHandler });