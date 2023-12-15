let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var curTime = request.curTime;
    var idSql =
      "select distinct id from GT4691AT1.GT4691AT1.BInvGroupMain where gmCount = " +
      Object.keys(request.groupData).length +
      "   and ( (gmEffTime is null and gmdvTime is null ) or (gmEffTime <='" +
      curTime +
      "' and gmdvTime  >='" +
      curTime +
      "')) and eVouchState= 1";
    var itemObj = {};
    for (var prop in request.groupData) {
      idSql += " and gmDetId like '" + request.groupData[prop].fdInv + "'  ";
      itemObj[request.groupData[prop].fdInv] = request.groupData[prop]["fdMainQty"];
    }
    var idRes = ObjectStore.queryByYonQL(idSql);
    if (idRes.length <= 0) {
      return { message: false };
    }
    var idStr = "";
    for (var prop in idRes) {
      idStr += idRes[prop].id + ",";
    }
    idStr = substring(idStr, 0, idStr.length - 1);
    var inCustSql =
      "select distinct  MInvGroupInCustFk from GT4691AT1.GT4691AT1.MInvGroupInCust  where MInvGroupInCustFk in ('" +
      idStr +
      "') and   (gcCustomer = '" +
      request.customer +
      "' or  gcCustClass ='" +
      request.fmCustCategory +
      "') ";
    var inCustRes = ObjectStore.queryByYonQL(inCustSql);
    if (inCustRes.length <= 0) {
      return { message: false };
    }
    var inCustStr = "";
    for (var prop in inCustRes) {
      inCustStr += inCustRes[prop]["MInvGroupInCustFk"] + ",";
    }
    inCustStr = substring(inCustStr, 0, inCustStr.length - 1);
    var custSql = "select  distinct MInvGroupCustFk  from GT4691AT1.GT4691AT1.MInvGroupCust where  MInvGroupCustFk  in ('" + inCustStr + "') and gcLimitCustomer='" + request.customer + "'";
    var custRes = ObjectStore.queryByYonQL(custSql);
    inCustStr = inCustStr + ",";
    for (var prop in custRes) {
      inCustStr = replace(inCustStr, custRes[prop]["MInvGroupCustFk"], "");
    }
    if (inCustStr.length <= 0) {
      return { message: false };
    }
    inCustStr = substring(inCustStr, 0, inCustStr.length - 1);
    var inIdList = JSON.parse(split(inCustStr, ",", 100));
    for (var prop in inIdList) {
      if (inIdList[prop] !== undefined && inIdList[prop] != "") {
        var itemSql = "select BInvGroupDetFk.*, * from GT4691AT1.GT4691AT1.BInvGroupDet where  BInvGroupDetFk ='" + inIdList[prop] + "'";
        var itemRes = ObjectStore.queryByYonQL(itemSql);
        var mutiple = -1;
        var message = "";
        var groupMsg = {};
        for (var prop in itemRes) {
          var inv = itemRes[prop]["gdInventory"];
          var quantity = itemRes[prop]["gdQuantity"];
          var price = itemRes[prop]["gdDisPrice"];
          if (parseFloat(itemObj[inv]) % quantity == 0) {
            var qty = parseFloat(itemObj[inv]) / quantity;
            if (mutiple == -1) {
              mutiple = qty;
              groupMsg[inv] = itemRes[prop];
            } else if (mutiple != qty) {
              message += "【" + itemRes[prop]["gdInvCode"] + " " + itemRes[prop]["gdInvName"] + "】输入数量不符合成套条件";
              continue;
            } else {
              groupMsg[inv] = itemRes[prop];
            }
          } else {
            message += "【" + itemRes[prop]["gdInvCode"] + " " + itemRes[prop]["gdInvName"] + "】输入数量不符合成套条件";
            continue;
          }
        }
        //符合要求的组合
        if (message === "") {
          return { groupMsg: groupMsg, itemRes: itemRes, itemSql: itemSql };
        } else {
          return { message: message };
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });