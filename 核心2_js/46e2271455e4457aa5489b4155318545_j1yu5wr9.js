let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //单据日期
    let billdate = request.billdate;
    //物料名称
    let wlId = request.wlId;
    let kxwlId = request.kxwl_id;
    //客户id
    let kuId = request.kuId;
    //客户分类id
    let kuclassId = request.kuclassId;
    //销售组织id
    let org_id = request.org_id;
    let func1 = extrequire("GT46163AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute();
    let token = res.access_token;
    //模板优先级1、按照客户商品查询2按照客户分类3按照商品查询价格
    let templateIds = ["2373136573403401", "2373136573419776", "2373136573403395"];
    let func2 = extrequire("GT46163AT1.backDefaultGroup.getPriceApi");
    let contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": contenttype
    };
    let price = undefined;
    let kxprice = undefined;
    let body = "";
    let kxbody = "";
    a: for (let i = 0; i < templateIds.length; i++) {
      if (i == 0) {
        body = {
          pageIndex: 0,
          pageSize: 0,
          status: "VALID",
          priceTemplateId: templateIds[i],
          simpleVOs: [
            {
              op: "elt",
              field: "beginDate",
              value1: billdate
            },
            {
              op: "egt",
              field: "endDate",
              value1: billdate
            },
            {
              op: "eq",
              field: "dimension.agentId",
              value1: kuId
            },
            {
              op: "eq",
              field: "dimension.productId",
              value1: wlId
            }
          ]
        };
      } else if (i == 1) {
        body = {
          pageIndex: 0,
          pageSize: 0,
          status: "VALID",
          priceTemplateId: templateIds[i],
          simpleVOs: [
            {
              op: "elt",
              field: "beginDate",
              value1: billdate
            },
            {
              op: "egt",
              field: "endDate",
              value1: billdate
            },
            {
              op: "eq",
              field: "dimension.agentClassId",
              value1: kuclassId
            },
            {
              op: "eq",
              field: "dimension.productId",
              value1: wlId
            }
          ]
        };
      } else if (i == 2) {
        body = {
          pageIndex: 0,
          pageSize: 0,
          status: "VALID",
          priceTemplateId: templateIds[i],
          simpleVOs: [
            {
              op: "elt",
              field: "beginDate",
              value1: billdate
            },
            {
              op: "egt",
              field: "endDate",
              value1: billdate
            },
            {
              op: "eq",
              field: "dimension.productId",
              value1: wlId
            }
          ]
        };
      }
      let wlprice = func2.execute(null, body);
      let priceList = wlprice.priceList;
      if (priceList != undefined && priceList.length > 0) {
        price = priceList;
        break a;
      }
    }
    b: for (let j = 0; j < templateIds.length; j++) {
      if (j == 0) {
        kxbody = {
          pageIndex: 0,
          pageSize: 0,
          status: "VALID",
          priceTemplateId: templateIds[j],
          simpleVOs: [
            {
              op: "elt",
              field: "beginDate",
              value1: billdate
            },
            {
              op: "egt",
              field: "endDate",
              value1: billdate
            },
            {
              op: "eq",
              field: "dimension.agentId",
              value1: kuId
            },
            {
              op: "eq",
              field: "dimension.productId",
              value1: kxwlId
            }
          ]
        };
      } else if (j == 1) {
        kxbody = {
          pageIndex: 0,
          pageSize: 0,
          status: "VALID",
          priceTemplateId: templateIds[j],
          simpleVOs: [
            {
              op: "elt",
              field: "beginDate",
              value1: billdate
            },
            {
              op: "egt",
              field: "endDate",
              value1: billdate
            },
            {
              op: "eq",
              field: "dimension.agentClassId",
              value1: kuclassId
            },
            {
              op: "eq",
              field: "dimension.productId",
              value1: kxwlId
            }
          ]
        };
      } else if (j == 2) {
        kxbody = {
          pageIndex: 0,
          pageSize: 0,
          status: "VALID",
          priceTemplateId: templateIds[j],
          simpleVOs: [
            {
              op: "elt",
              field: "beginDate",
              value1: billdate
            },
            {
              op: "egt",
              field: "endDate",
              value1: billdate
            },
            {
              op: "eq",
              field: "dimension.productId",
              value1: kxwlId
            }
          ]
        };
      }
      let kxwlprice = func2.execute(null, kxbody);
      let kxpriceList = kxwlprice.priceList;
      if (kxpriceList != undefined && kxpriceList.length > 0) {
        kxprice = kxpriceList;
        break b;
      }
    }
    return { price: price, kxprice: kxprice };
  }
}
exports({ entryPoint: MyAPIHandler });