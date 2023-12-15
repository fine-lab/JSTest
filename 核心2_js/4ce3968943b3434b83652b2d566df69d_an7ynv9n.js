let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //生效才校验
    let ruleEnable = request.data.ruleEnable;
    if (!ruleEnable) {
      let result = true;
      return { result };
    }
    let useOrg = request.data.useOrg;
    let clients = request.data.IorderMergeReule_excClientList;
    let goods = request.data.IorderMergeReule_commodityList;
    let beginTime = request.data.beginTime;
    let endTime = request.data.endTime;
    let controlRule = request.data.controlRule;
    //根据orgId 查询时间重叠,并且已启动的所有规则档案id
    let sql = 'select id from GT80750AT4.GT80750AT4.IorderMergeReule where ruleEnable = 1 and beginTime <= "' + endTime + '" and endTime >= "' + beginTime + '"   and useOrg = "' + useOrg + '"';
    var res = ObjectStore.queryByYonQL(sql);
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
    //过滤已有规则中和待保存规则存在冲突商品的规则
    let unSaveGoodsIds = [];
    let unSaveClientIds = [];
    for (var good of goods) {
      unSaveGoodsIds.push(goods.commodity);
    }
    for (var client of clients) {
      unSaveClientIds.push(client.excClient);
    }
    let conflictRules = [];
    for (var rule of res) {
      if (rule.id == request.data.id) {
        //如果更新规则,跳过当前规则的历史数据判断
        continue;
      }
      //获取当前rule的goods 与 clients 控制规则
      let ruleGoodsIds = [];
      let ruleClientIds = [];
      let ruleControlRule = rule.controlRule;
      for (var good of rule.IorderMergeReule_commodityList) {
        ruleGoodsIds.push(goods.commodity);
      }
      for (var client of rule.IorderMergeReule_excClientList) {
        ruleClientIds.push(client.excClient);
      }
      //对比
      if (ruleControlRule == "ALL" || controlRule == "ALL") {
        //必然冲突,直接匹配是否有重复货物
        for (var goodId of ruleGoodsIds) {
          if (unSaveGoodsIds.includes(goodId)) {
            conflictRules.push(rule);
            break;
          }
        }
      } else if (controlRule == ruleControlRule) {
        //规则相同,匹配是否有重复客户
        let confilct = false;
        for (var clientId of ruleClientIds) {
          if (unSaveClientIds.includes(clientId)) {
            for (var goodId of ruleGoodsIds) {
              if (unSaveGoodsIds.includes(goodId)) {
                conflictRules.push(rule);
                confilct = true;
              }
            }
            if (confilct) {
              break;
            }
          }
        }
        //有重复客户,匹配是否有重复货物
      } else {
        //规则不一致
        if (controlRule == "EXC") {
          //如果当前保存规则为例外客户,当前集合全包含已有规则集合,才不会有冲突
          let isSuperset = isContian(unSaveClientIds, ruleClientIds);
          if (!isSuperset) {
            for (var goodId of ruleGoodsIds) {
              if (unSaveGoodsIds.includes(goodId)) {
                conflictRules.push(rule);
                break;
              }
            }
          }
        } else if (controlRule == "CON") {
          //如果当前客户为控制客户,要求已有客户全包含现有客户,才不会有冲突
          let isSuperset = isContian(ruleClientIds, unSaveClientIds);
          if (!isSuperset) {
            for (var goodId of ruleGoodsIds) {
              if (unSaveGoodsIds.includes(goodId)) {
                conflictRules.push(rule);
                break;
              }
            }
          }
        }
      }
    }
    return { conflictRules };
  }
}
exports({ entryPoint: MyAPIHandler });
//判断集合1是否全包含2
function isContian(arr1, arr2) {
  for (let elem of arr2) {
    if (!arr1.includes(elem)) {
      return false;
    }
  }
  return true;
}