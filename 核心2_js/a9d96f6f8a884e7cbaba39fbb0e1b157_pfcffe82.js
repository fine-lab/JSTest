let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let { org_id, merchant, products = [], interfaceType = 0 } = request;
    let productRows = products.map(function (v) {
      return { product: v };
    });
    var strResponse;
    // 友企联数据翻译调用
    var transData = {
      data: JSON.stringify({ org_id, merchant, preorder_bList: productRows })
    };
    if (interfaceType === 1) {
      strResponse = postman(
        "post",
        "https://www.example.com/",
        null,
        null,
        JSON.stringify(transData)
      );
    } else if (interfaceType === 2) {
      strResponse = postman(
        "post",
        "https://www.example.com/",
        null,
        null,
        JSON.stringify(transData)
      );
    } else {
      throw new Error("未知的客户证照校验类型");
    }
    var ncObj = JSON.parse(strResponse);
    if (ncObj.status !== "success") {
      throw new Error(strResponse);
    }
    let data = JSON.parse(ncObj.data);
    var ncRes;
    if (interfaceType === 1) {
      ncRes = SINE_ENT_CERT_VALID_CHECK(data);
    }
    if (interfaceType === 2) {
      ncRes = SINE_ENT_CERT_SCOPE_CHECK(data);
    }
    return { ncRes, ncParam: data };
  }
}
function SINE_ENT_CERT_VALID_CHECK(data) {
  var p1 = {
    interface: "nc.pubitf.moq.entcert.alert.IEntCertValidit2",
    method: "validCheck",
    serviceMethodArgInfo: [
      {
        argType: "java.lang.String",
        argValue: data.pk_org,
        agg: false,
        isArray: false,
        isPrimitive: false
      },
      {
        argType: "java.lang.Integer",
        argValue: 1,
        agg: false,
        isArray: false,
        isPrimitive: false
      },
      {
        argType: "java.lang.String",
        argValue: "2020-11-25 17:37:30",
        agg: false,
        isArray: false,
        isPrimitive: false
      },
      {
        argType: "java.lang.String",
        argValue: data.ccustomerid,
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
function SINE_ENT_CERT_SCOPE_CHECK(data) {
  var p1 = {
    interface: "nc.pubitf.moq.entcert.alert.IEntCertValidit2",
    method: "scopeCheckInterceptForSaleOrder",
    serviceMethodArgInfo: [
      {
        argType: "java.lang.String",
        argValue: JSON.stringify(data),
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
exports({ entryPoint: MyAPIHandler });