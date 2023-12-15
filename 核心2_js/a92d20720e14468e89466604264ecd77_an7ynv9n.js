let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    //生效才校验
    let ruleEnable = data.ruleEnable;
    if (!ruleEnable) {
      let result = true;
      return { result };
    }
    let useOrg = data.useOrg;
    let clients = data.IorderMergeReule_excClientList;
    let goods = data.IorderMergeReule_commodityList;
    let beginTime = formatDate(new Date(data.beginTime));
    let endTime = formatDate(new Date(data.endTime));
    let controlRule = data.controlRule;
    //根据orgId 查询时间重叠,并且已启动的所有规则档案id
    let sql = 'select id from GT80750AT4.GT80750AT4.IorderMergeReule where ruleEnable = 1 and beginTime <= "' + endTime + '" and endTime >= "' + beginTime + '"   and useOrg = "' + useOrg + '"';
    var res = ObjectStore.queryByYonQL(sql);
    let ids = [];
    for (var id of res) {
      if (id.id != data.id) {
        //查询排除自身
        ids.push(id.id);
      }
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
    if (ids.length > 0) {
      //实体查询
      var res = ObjectStore.selectBatchIds("GT80750AT4.GT80750AT4.IorderMergeReule", object);
    }
    //过滤已有规则中和待保存规则存在冲突商品的规则
    let unSaveGoodsIds = [];
    let unSaveClientIds = [];
    for (var good of goods) {
      unSaveGoodsIds.push(Number(good.commodity));
    }
    for (var client of clients) {
      unSaveClientIds.push(Number(client.excClient));
    }
    let conflictRules = [];
    for (var rule of res) {
      if (rule.id == data.id) {
        //如果更新规则,跳过当前规则的历史数据判断
        continue;
      }
      //获取当前rule的goods 与 clients 控制规则
      let ruleGoodsIds = [];
      let ruleClientIds = [];
      let ruleControlRule = rule.controlRule;
      if (rule.IorderMergeReule_commodityList) {
        for (var good of rule.IorderMergeReule_commodityList) {
          ruleGoodsIds.push(Number(good.commodity));
        }
      }
      if (rule.IorderMergeReule_excClientList) {
        for (var client of rule.IorderMergeReule_excClientList) {
          ruleClientIds.push(Number(client.excClient));
        }
      }
      //对比
      if (ruleControlRule == "ALL" || controlRule == "ALL") {
        //必然冲突,直接匹配是否有重复货物
        for (var goodId of ruleGoodsIds) {
          if (goodId && unSaveGoodsIds.includes(goodId)) {
            conflictRules.push(rule);
            break;
          }
        }
      } else if (controlRule == ruleControlRule) {
        //规则相同,匹配是否有重复客户
        let confilct = false;
        for (var clientId of ruleClientIds) {
          if (clientId && unSaveClientIds.includes(clientId)) {
            for (var goodId of ruleGoodsIds) {
              if (goodId && unSaveGoodsIds.includes(goodId)) {
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
              if (goodId && unSaveGoodsIds.includes(goodId)) {
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
              if (goodId && unSaveGoodsIds.includes(goodId)) {
                conflictRules.push(rule);
                break;
              }
            }
          }
        }
      }
    }
    let msg = "";
    for (var rule of conflictRules) {
      msg += rule.ruleName + ",";
    }
    msg = msg.slice(0, -1);
    if (conflictRules.length) {
      throw new Error("当前规则和已生效规则存在冲突商品\n冲突规则名称 : " + msg);
    }
  }
}
//判断集合1是否全包含2
function isContian(arr1, arr2) {
  for (let elem of arr2) {
    if (!arr1.includes(elem)) {
      return false;
    }
  }
  return true;
}
function showTime(t) {
  var time;
  time = t > 10 ? t : "0" + t;
  return time;
}
//加一个判断集合的方法
function formatDate(d) {
  //由于服务器的时间没设置中国时区,所以手动转化为中国时间
  const date = new Date(d);
  const offset = 8; // 中国时区为UTC+8
  const utc = date.getTime() + date.getTimezoneOffset() * 60000; // 计算当前时间的UTC时间戳
  const localDate = new Date(utc + 3600000 * offset); // 根据偏移量计算中国时区的时间
  const year = localDate.getFullYear();
  const month = ("0" + (localDate.getMonth() + 1)).slice(-2);
  const day = ("0" + localDate.getDate()).slice(-2);
  const hour = ("0" + localDate.getHours()).slice(-2);
  const minute = ("0" + localDate.getMinutes()).slice(-2);
  const second = ("0" + localDate.getSeconds()).slice(-2);
  const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  return formattedDate;
}
exports({ entryPoint: MyTrigger });