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
      ids: pushIds,
      compositions: [
        {
          name: "preorder_bList"
        }
      ]
    };
    var res, res2;
    //实体查询
    res = ObjectStore.selectBatchIds("GT7239AT6.GT7239AT6.preorder_h", object);
    if (res.length === 0) {
      throw new Error(`未找到主键为[${pushIds.join()}]的单据信息。`);
    }
    // 审批态校验
    let errVerifystateArr = [];
    res.map(function (v) {
      if (v.verifystate !== 2) {
        errVerifystateArr.push(v.code);
      }
    });
    if (errVerifystateArr.length > 0) {
      throw new Error(`订单编码为[${errVerifystateArr.join()}]的单据不是审批态。`);
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
        ncRes: {
          data: `{"code":666,"message":"期初订单不能推送：编码[${errCodeArray.join()}]。","success":false}`
        },
        data: { code: 200, message: `期初订单不能推送：编码[${errCodeArray.join()}]。`, success: false },
        sendMessage,
        idCodeMapping
      };
    } else {
      // 友企联数据翻译调用
      var transData = {
        data: JSON.stringify(res)
      };
      debugger;
      var strResponse = ublinker("post", `https://api.diwork.com/commonProductCls/commonProduct/vochanges/SINE_PREORDER_H?appKey=${ENV_KEY}`, HEADER_STRING, JSON.stringify(transData));
      var ncObj = null;
      try {
        ncObj = JSON.parse(strResponse);
      } catch (e) {
        throw new Error(strResponse);
      }
      if (ncObj.status !== "success") {
        throw new Error(strResponse);
      }
      let sendMessage = getSenderMsg(JSON.parse(ncObj.data));
      var ncRes = constructNCInvokeParameters(sendMessage);
      if (ncRes && ncRes.status == "success") {
        var ncResDataObj = JSON.parse(ncRes.data);
        // 不管200 还是500只要有data都算成功。
        if (ncResDataObj.code == 200 || (ncResDataObj.code == 500 && ncResDataObj.data)) {
          let updateProp = pushIds.map(function (v) {
            return {
              id: v,
              isPushFinished: "Y"
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
    bill: orders
  });
}
function constructNCInvokeParameters(sendMessage) {
  var p1 = {
    interface: "nc.itf.bip.pub.pfxx.ItfImportToNC",
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
  debugger;
  let ctx = JSON.parse(AppContext()).currentUser;
  let url = `https://api.diwork.com/${ctx.tenantId}/commonProductCls/commonProduct/commonapi?appKey=${ENV_KEY}`;
  let resp = ublinker("post", url, HEADER_STRING, JSON.stringify(p1));
  return JSON.parse(resp);
}
exports({ entryPoint: MyAPIHandler });