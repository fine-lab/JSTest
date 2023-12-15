let AbstractAPIHandler = require("AbstractAPIHandler");
const ENV_KEY = "yourKEYHere";
const ENY_SEC = "ba2a2bded3a84844baa71fe5a3e59e00";
const HEADER_STRING = JSON.stringify({
  appkey: ENV_KEY,
  appsecret: ENY_SEC
});
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let { org_id, merchant, products = [], interfaceType = 0 } = request;
    let api = new EntCertCheckAPI();
    return api.validate(org_id, merchant, products, interfaceType);
  }
}
class EntCertCheckAPI {
  validate(org_id, merchant, products = [], interfaceType = 0) {
    var strResponse;
    // 友企联数据翻译调用
    var transData = {
      data: JSON.stringify({ org_id, merchant, preorder_bList: products })
    };
    let ctx = JSON.parse(AppContext()).currentUser;
    if (interfaceType === 1) {
      strResponse = ublinker(
        "post",
        `https://api.diwork.com/${ctx.tenantId}/commonProductCls/commonProduct/vochange/SINE_ENT_CERT_VALID_CHECK?appKey=${ENV_KEY}`,
        HEADER_STRING,
        JSON.stringify(transData)
      );
    } else if (interfaceType === 2) {
      strResponse = ublinker(
        "post",
        `https://api.diwork.com/${ctx.tenantId}/commonProductCls/commonProduct/vochange/SINE_ENT_CERT_SCOPE_CHECK?appKey=${ENV_KEY}`,
        HEADER_STRING,
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
      ncRes = this.SINE_ENT_CERT_VALID_CHECK(data);
    }
    if (interfaceType === 2) {
      ncRes = this.SINE_ENT_CERT_SCOPE_CHECK(data);
    }
    return { ncRes, ncParam: data, ncObj: ncObj.data };
  }
  SINE_ENT_CERT_VALID_CHECK(data) {
    var param = {
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
    let url = `https://api.diwork.com/${ctx.tenantId}/commonProductCls/commonProduct/commonapi?appKey=${ENV_KEY}`;
    let strResponse = ublinker("post", url, HEADER_STRING, JSON.stringify(param));
    return JSON.parse(strResponse);
  }
  SINE_ENT_CERT_SCOPE_CHECK(data) {
    var param = {
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
    let url = `https://api.diwork.com/${ctx.tenantId}/commonProductCls/commonProduct/commonapi?appKey=${ENV_KEY}`;
    let strResponse = ublinker("post", url, HEADER_STRING, JSON.stringify(param));
    return JSON.parse(strResponse);
  }
}
exports({ entryPoint: MyAPIHandler });