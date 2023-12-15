let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let useOrg = request.orgId;
    let time = request.time;
    let clientId = request.clientId;
    let func = extrequire("GT80750AT4.frontPublicFunction.formatDateTime");
    let now = func.execute();
    const product_ids = request.goodsList.map((good) => good.commodity);
    const body = { data: { id: product_ids } };
    const url = "https://www.example.com/";
    const resp = openLinker("POST", url, "GT80750AT4", JSON.stringify(body));
    const apiResponse = typeof resp === "string" ? JSON.parse(resp) : resp;
    if (apiResponse.code != "200") {
      throw new Error("请求物料起订量失败，请重试！");
    }
    for (let i = 0; i < apiResponse.data.recordList.length; i++) {
      const cur = apiResponse.data.recordList[i];
      const p_count = request.goodsList.filter((item) => item.commodity === cur.id)[0].count;
      if (!cur.detail.iMinOrderQuantity) {
        continue;
      }
      if (cur.detail.iMinOrderQuantity > p_count) {
        throw new Error(`物料【${cur.name}】最低起订量为${cur.detail.iMinOrderQuantity},请重试！`);
      }
    }
    //根据orgId 查询符合时间范围,并且已启动的所有规则档案id
    var res = ObjectStore.queryByYonQL(
      'select id from GT80750AT4.GT80750AT4.IorderMergeReule where ruleEnable = 1 and beginTime <= "' +
        now.formattedDate +
        '" and endTime >= "' +
        now.formattedDate +
        '"   and useOrg = "' +
        useOrg +
        '"'
    );
    //没有规则限制,直接通过
    let bol = true;
    if (res.length == 0) {
      return { bol };
    }
    let ids = [];
    for (var id of res) {
      ids.push(id.id);
    }
    //查询档案对象所有信息
    var object = {
      ids: ids,
      compositions: [
        {
          name: "IorderMergeReule_commodityList"
        },
        {
          name: "IorderMergeReule_excClientList"
        }
      ]
    };
    //实体查询
    var res = ObjectStore.selectBatchIds("GT80750AT4.GT80750AT4.IorderMergeReule", object);
    //过滤命中当前客户的档案规则
    let docs = [];
    for (var doc of res) {
      let controlRule = doc.controlRule;
      //获取控制客户ids
      let clientList = doc.IorderMergeReule_excClientList;
      let clientIds = [];
      if (clientList) {
        for (var client of clientList) {
          clientIds.push(client.excClient);
        }
      }
      switch (controlRule) {
        case "ALL":
          docs.push(doc);
          break;
        case "EXC":
          if (!clientIds.includes(clientId)) {
            docs.push(doc);
          }
          break;
        case "CON":
          if (clientIds.includes(clientId)) {
            docs.push(doc);
          }
          break;
        default:
          throw new Error("未知客户控制类型,请检查合并订单规则档案");
      }
    }
    //从档案中提取商品规则参数
    //同时再次校验是否有重复规则,有则抛异常
    let allGoods = [];
    let rules = [];
    for (var doc of docs) {
      let goods = doc.IorderMergeReule_commodityList;
      let goodsList = [];
      for (let good of goods) {
        if (allGoods.includes(good.commodity)) {
          throw new Error("同时生效的规则中,存在冲突商品,ID:" + goods.commodity);
        }
        allGoods.push(good.commodity);
        goodsList.push(good.commodity);
      }
      rules.push({
        docId: doc.id,
        minOrderNum: doc.minOrderNum,
        goodsList: goodsList,
        ruleName: doc.ruleName
      });
    }
    //比对规则
    let orderGoods = request.goodsList;
    let hitGoods = 0;
    let rulesCheck = [];
    let dissatisfyRule = {};
    //同时生效的规则中不会存在重复商品
    for (var rule of rules) {
      let groupCount = 0;
      let goodsList = rule.goodsList;
      if (goodsList.every((rg) => orderGoods.map((og) => og.commodity).includes(rg))) {
        //订单中的商品全部包含在规则商品中
        groupCount += orderGoods.reduce((prev, cur) => prev + cur.count, 0);
        hitGoods = hitGoods + orderGoods.length;
      } else {
        //否则直接返回
        return { bol };
      }
      if (rule.minOrderNum > groupCount) {
        //不符合最低订单标准
        rulesCheck.push(0);
        dissatisfyRule = rule;
      } else {
        rulesCheck.push(1);
      }
    }
    let ruleName = dissatisfyRule.ruleName;
    if (hitGoods == 0) {
      return { bol, ruleName };
    }
    if (rulesCheck.includes(0)) {
      bol = false;
    }
    return { bol, ruleName };
  }
}
exports({ entryPoint: MyAPIHandler });