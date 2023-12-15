let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var queryHistory = ObjectStore.selectByMap("GT80750AT4.GT80750AT4.address_split_info", { udhNo: request.data[0].udhNo, agentCode: request.data[0].agentCode, deletRow: 0 });
    var res;
    var tps;
    if (request.data[0].isPartialShipment === "Y") {
      let body = { code: "001", orgId: request.data[0].orgId };
      let url = "https://www.example.com/";
      let apiResponse = openLinker("POST", url, "GT80750AT4", JSON.stringify(body));
      const resp = typeof apiResponse === "string" ? JSON.parse(apiResponse) : apiResponse;
      if (resp.code == 200) {
        const enable = resp.data.filter((item) => item.enable == 1)[0];
        if (enable) {
          if (enable.value !== "Y") {
            deleteRow();
            throw new Error("部分发货的订单设置为不允许再拆分地址的，不允许提交！");
          }
        }
      } else {
        throw new Error("网络异常，请重试！");
      }
    }
    var finishOrder = ObjectStore.selectByMap("GT80750AT4.GT80750AT4.address_split_info", { udhNo: request.data[0].udhNo, agentCode: request.data[0].agentCode, oaStatus: 3 });
    if (finishOrder.length) {
      //已经成功推送过一次，是否允许再次分单
      let body = { code: "002", orgId: request.data[0].orgId };
      let url = "https://www.example.com/";
      let apiResponse = openLinker("POST", url, "GT80750AT4", JSON.stringify(body));
      const resp = JSON.parse(apiResponse);
      if (resp.code == 200) {
        const enable = resp.data.filter((item) => item.enable == 1)[0];
        if (enable) {
          if (enable.value !== "Y") {
            deleteRow();
            throw new Error("分地址拆分只能发起一次变更，再次发起变更不允许提交！");
          }
        }
      } else {
        throw new Error("网络异常，请重试！");
      }
    }
    //是否允许整车多地址拆分
    if (request.data[0].isWholeCar === "Y") {
      let body = { code: "003", orgId: request.data[0].orgId };
      let url = "https://www.example.com/";
      let apiResponse = openLinker("POST", url, "GT80750AT4", JSON.stringify(body));
      const resp = JSON.parse(apiResponse);
      if (resp.code == 200) {
        const enable = resp.data.filter((item) => item.enable == 1)[0];
        if (enable) {
          if (enable.value !== "Y") {
            deleteRow();
            throw new Error("整车订单不允许发起多地址拆分！");
          }
        }
      } else {
        throw new Error("网络异常，请重试！");
      }
    }
    let body = {};
    let url = "https://www.example.com/";
    let notAllowInfo = JSON.parse(openLinker("POST", url, "GT80750AT4", JSON.stringify(body)));
    if (notAllowInfo.code != 200) {
      throw new Error("网络异常，请重试！");
    }
    request.data.forEach((good) => {
      if (notAllowInfo.data.product_set.map((item) => item.product_code).includes(good.goodsId)) {
        throw new Error(good.goodsName + "属于不可多次拆分商品，请联系管理员");
      }
    });
    let body2 = {
      pageIndex: 1,
      pageSize: 1,
      code: request.data[0].udhNo,
      isSum: false
    };
    let url2 = "https://www.example.com/";
    let saleOrder = JSON.parse(openLinker("POST", url2, "GT80750AT4", JSON.stringify(body2)));
    if (saleOrder.code == 200 && saleOrder.data.recordList.length) {
      if (notAllowInfo.data.trans_type_set.map((item) => item.transType_code).includes(saleOrder.data.recordList[0].transactionTypeId_name)) {
        throw new Error(`当前订单交易类型【${saleOrder.data.recordList[0].transactionTypeId_name}】已被禁止多次拆分`);
      }
    }
    if (queryHistory.length) {
      if (queryHistory[0].oaStatus == 2) {
        throw new Error("当前单据正在审批中，不允许提交！");
      }
      //有历史数据，更新
      queryHistory.forEach((f) => {
        var sub = request.data.map((item) => Object.assign(item, { ytenant: JSON.parse(AppContext()).currentUser.tenantId })).find((item) => item.goodsId === f.goodsId);
        if (!sub) return;
        if (!sub.splited_infoList.length) return;
        if (f.amount !== sub.splited_infoList.reduce((prev, cur) => prev + cur.newAmount, 0)) {
          throw new Error("拆分数量不等于原单数量，请重试！");
        }
        let newSub = sub.splited_infoList.map((s) => Object.assign(s, { hasDefaultInit: true, _status: "Insert" }));
        var old = ObjectStore.selectByMap("GT80750AT4.GT80750AT4.splited_info", { address_split_info_id: f.id });
        old.forEach((o) => {
          newSub.push({ id: o.id, _status: "Delete" });
        });
        var object = Object.assign(f, { splited_infoList: newSub, reason: sub.reason, isPartialShipment: sub.isPartialShipment });
        res = ObjectStore.updateById("GT80750AT4.GT80750AT4.address_split_info", object, "yb2dd5e5fa");
      });
      tps = "update";
    } else {
      //无历史数据，新增
      var object = request.data.map((item) => Object.assign(item, { ytenant: JSON.parse(AppContext()).currentUser.tenantId }));
      for (let i = 0; i < object.length; i++) {
        const f = object[i];
        if (!f.splited_infoList.length) {
          continue;
        }
        if (f.amount !== f.splited_infoList.reduce((prev, cur) => prev + cur.newAmount, 0)) {
          throw new Error("拆分数量不等于原单数量，请重试！");
        }
      }
      res = ObjectStore.insertBatch("GT80750AT4.GT80750AT4.address_split_info", object, "yb2dd5e5fa");
      tps = "insert";
    }
    function deleteRow(code) {
      let body = { deletRow: 1 };
      let url = "https://www.example.com/";
      return openLinker("POST", url, "GT80750AT4", JSON.stringify({ udhNo: request.data[0].udhNo, data: body }));
    }
    return {
      code: 200,
      type: tps,
      data: res
    };
  }
}
exports({ entryPoint: MyAPIHandler });