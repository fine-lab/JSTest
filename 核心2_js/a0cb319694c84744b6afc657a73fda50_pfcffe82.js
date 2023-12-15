let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var { pushIds } = request;
    //查询内容
    var object = {
      ids: pushIds,
      compositions: [
        {
          name: "preorder_bList"
        }
      ]
    };
    var res, res2;
    if (pushIds || pushIds.length == 0) {
      res = ObjectStore.queryByYonQL(`select * from GT7239AT6.GT7239AT6.preorder_h where vnote like '%sph%'`);
    }
    //实体查询
    res = ObjectStore.selectBatchIds("GT7239AT6.GT7239AT6.preorder_h", object);
    // 友企联数据翻译调用
    var transData = {
      data: JSON.stringify(res)
    };
    var strResponse = postman("post", "https://www.example.com/", null, null, JSON.stringify(transData));
    var ncObj = JSON.parse(strResponse);
    if (ncObj.status !== "success") {
      throw new Error(strResponse);
    }
    let sendMessage = getSenderMsg(JSON.parse(ncObj.data));
    var ncRes = constructNCInvokeParameters(sendMessage);
    return { ncRes, sendMessage };
  }
}
function getSenderMsg(orders) {
  return JSON.stringify({
    bill: orders
  });
}
function constructNCInvokeParameters(sendMessage) {
  var p1 = {
    interface: "nc.itf.bip.pub.pfxx.ItfImportToNC",
    modulecode: "moq",
    usercode: "wangsyf",
    method: "impToNCData",
    serviceMethodArgInfo: [
      {
        argType: "java.lang.String",
        argValue: "30",
        agg: false,
        isArray: false,
        isPrimitive: false
      },
      {
        argType: "java.lang.String",
        argValue: "01",
        agg: false,
        isArray: false,
        isPrimitive: false
      },
      {
        argType: "java.lang.String",
        argValue: sendMessage,
        agg: false,
        isArray: false,
        isPrimitive: false
      },
      {
        argType: "java.lang.String",
        argValue: null,
        agg: false,
        isArray: false,
        isPrimitive: false
      },
      {
        argType: "java.lang.String",
        argValue: null,
        agg: false,
        isArray: false,
        isPrimitive: false
      },
      {
        argType: "java.lang.String",
        argValue: null,
        agg: false,
        isArray: false,
        isPrimitive: false
      }
    ]
  };
  let ctx = JSON.parse(AppContext()).currentUser;
  let url = `https://api.diwork.com/${ctx.tenantId}/commonProductCls/commonProduct/commonapi?appKey=39dfa78142a44b1892b0d0acb8f5bb0f`;
  let resp = postman("post", url, null, null, JSON.stringify(p1));
  var data1 = JSON.parse(resp);
  if (data1.code == "200") {
    var data0 = JSON.parse(data1.data);
    return data0;
  }
  return JSON.parse(resp);
}
function constructBizArray(orders) {
  var res = orders.map((order) => {
    var body = order["so_saleorder_b"];
    delete order["so_saleorder_b"];
    return {
      head: order,
      body: body
    };
  });
  return res;
}
function getTestData() {
  return {
    bill: [
      {
        pk_org: "0001V11000000017OJH6",
        cdeptid: "youridHere",
        cemployeeid: "youridHere",
        ccustomerid: "youridHere",
        agent: "10000787",
        items: [
          {
            vbdef8: "a1",
            vbdef9: "aa1",
            cmaterialvid: "youridHere",
            nnum: "1",
            nqtorigtaxprice: "33",
            nqtorigprice: "33",
            ntaxrate: "13",
            norigmny: "1111",
            ncaltaxmny: "1",
            ntax: "1"
          },
          {
            vbdef8: "a1",
            vbdef9: "aa2",
            cmaterialvid: "youridHere",
            nnum: "1",
            nqtorigtaxprice: "33",
            nqtorigprice: "33",
            ntaxrate: "13",
            norigmny: "1111",
            ncaltaxmny: "1",
            ntax: "1"
          }
        ]
      },
      {
        pk_org: "0001V11000000017OJH6",
        cdeptid: "youridHere",
        cemployeeid: "youridHere",
        ccustomerid: "youridHere",
        agent: "10000787",
        items: [
          {
            vbdef8: "a2",
            vbdef9: "aa1",
            cmaterialvid: "youridHere",
            nnum: "1",
            nqtorigtaxprice: "33",
            nqtorigprice: "33",
            ntaxrate: "13",
            norigmny: "1111",
            ncaltaxmny: "1",
            ntax: "1"
          },
          {
            vbdef8: "a2",
            vbdef9: "aa2",
            cmaterialvid: "youridHere",
            nnum: "1",
            nqtorigtaxprice: "33",
            nqtorigprice: "33",
            ntaxrate: "13",
            norigmny: "1111",
            ncaltaxmny: "1",
            ntax: "1"
          }
        ]
      }
    ]
  };
}
exports({ entryPoint: MyAPIHandler });