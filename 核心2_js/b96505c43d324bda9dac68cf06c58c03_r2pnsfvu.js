let AbstractAPIHandler = require("AbstractAPIHandler");
const ENV_KEY = "yourKEYHere";
const ENY_SEC = "ba2a2bded3a84844baa71fe5a3e59e00";
const HEADER_STRING = JSON.stringify({
  appkey: ENV_KEY,
  appsecret: ENY_SEC
});
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var { pushIds } = request;
    if (!pushIds || pushIds.length === 0) {
      throw new Error("订单pushIds不可为空");
    }
    //查询内容
    var object = {
      ids: pushIds
    };
    var res = ObjectStore.selectBatchIds("GT7239AT6.GT7239AT6.preorder_h", object);
    if (res.length === 0) {
      throw new Error(`未找到主键为[${pushIds.join()}]的单据信息。`);
    }
    let idCodeMapping = {};
    res.map(function (v) {
      idCodeMapping[v.id] = v.code;
    });
    let errCodeArray = [];
    for (let v of res) {
      if (v.initializationFlag == "Y") {
        errCodeArray.push(v.code);
      }
    }
    if (errCodeArray.length > 0) {
      return {
        data: `{"code":666,"message":"期初订单不须撤回：编码[${errCodeArray.join()}]。","success":false}`,
        sendMessage,
        idCodeMapping
      };
    } else {
      var nc2Send = res.map(function (v) {
        return {
          vbdef20: v.code,
          vbdef8: v.id
        };
      });
      let sendMessage = getSenderMsg(nc2Send);
      var ncRes = constructNCInvokeParameters(sendMessage);
      if (ncRes && ncRes.status == "success") {
        var ncResDataObj = JSON.parse(ncRes.data);
        // 不管200 还是500只要有data都算成功。
        if (ncResDataObj.code == 200 || (ncResDataObj.code == 500 && ncResDataObj.data)) {
          let updateProp = pushIds.map(function (v) {
            return {
              id: v,
              isPushFinished: "N"
            };
          });
          var updatePropRes = ObjectStore.updateBatch("GT7239AT6.GT7239AT6.preorder_h", updateProp, "ac6f72c1");
        }
      }
      return { ncRes, sendMessage, idCodeMapping };
    }
  }
}
function getSenderMsg(orders) {
  return JSON.stringify({
    data: orders,
    code: "200"
  });
}
function constructNCInvokeParameters(sendMessage) {
  var p1 = {
    interface: "nc.itf.bip.pub.pfxx.ItfImportToNC",
    method: "impBipToNCDel",
    serviceMethodArgInfo: [
      {
        argType: "java.lang.String",
        argValue: sendMessage,
        agg: false,
        isArray: false,
        isPrimitive: false
      }
    ]
  };
  let ctx = JSON.parse(AppContext()).currentUser;
  let url = `https://api.diwork.com/${ctx.tenantId}/commonProductCls/commonProduct/commonapi?appKey=${ENV_KEY}`;
  let resp = ublinker("post", url, HEADER_STRING, JSON.stringify(p1));
  var data1 = JSON.parse(resp);
  if (data1.code == "200") {
    var data0 = JSON.parse(data1.data);
    return data0;
  }
  return JSON.parse(resp);
}
exports({ entryPoint: MyAPIHandler });