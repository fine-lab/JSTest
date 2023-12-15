let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var curTime = request.curTime;
    var deptId = request.fdDept;
    if (deptId == undefined) {
      deptId = "";
    }
    if (request.fmCustCategory == undefined) {
      request.fmCustCategory = "";
    }
    var idSql =
      "select distinct id from GT4691AT1.GT4691AT1.BInvGroupMain where gmCount = " +
      Object.keys(request.groupData).length +
      " and (gmDept1 is null or gmDept1 = '" +
      deptId +
      "')  and ( (gmEffTime is null and gmdvTime is null ) or (gmEffTime <='" +
      curTime +
      "' and gmdvTime  >='" +
      curTime +
      "')) and eVouchState= 1";
    var invNameStr = "";
    var itemObj = {};
    let gmdetIdArr = [];
    for (var prop in request.groupData) {
      idSql += " and gmDetId like '" + request.groupData[prop].fdInv + "'  ";
      gmdetIdArr.push(request.groupData[prop].fdInv);
      itemObj[request.groupData[prop].fdInv] = request.groupData[prop]["fdMainQty"];
      invNameStr += "【" + prop + "】" + request.groupData[prop]["fdMainQty"] + " ,";
    }
    invNameStr = invNameStr.substring(0, invNameStr.length - 1);
    idSql += " order by gmDept1 desc ";
    var idRes = ObjectStore.queryByYonQL(idSql);
    if (idRes.length <= 0) {
      return { message: invNameStr + "不存在此套装组合", querystr: idSql };
    }
    var idStr = "";
    for (var prop in idRes) {
      idStr += idRes[prop].id + ",";
    }
    idStr = substring(idStr, 0, idStr.length - 1);
    var inCustSql =
      "select distinct  MInvGroupInCustFk from GT4691AT1.GT4691AT1.MInvGroupInCust  where MInvGroupInCustFk in (" +
      idStr +
      ") and   (gcCustomer = '" +
      request.customer +
      "' or  gcCustClass ='" +
      request.fmCustCategory +
      "') ";
    inCustSql += " order by MInvGroupInCustFk.gmDept1 desc ";
    var inCustRes = ObjectStore.queryByYonQL(inCustSql);
    if (inCustRes.length <= 0) {
      return { message: "当前客户不参与此套装活动" };
    }
    var inCustStr = "";
    for (var prop in inCustRes) {
      inCustStr += inCustRes[prop]["MInvGroupInCustFk"] + ",";
    }
    inCustStr = substring(inCustStr, 0, inCustStr.length - 1);
    var custSql = "select  distinct MInvGroupCustFk  from GT4691AT1.GT4691AT1.MInvGroupCust where  MInvGroupCustFk  in (" + inCustStr + ") and gcLimitCustomer='" + request.customer + "'";
    var custRes = ObjectStore.queryByYonQL(custSql);
    inCustStr = inCustStr + ",";
    for (var prop in custRes) {
      inCustStr = replace(inCustStr, custRes[prop]["MInvGroupCustFk"], "");
    }
    if (inCustStr.length <= 0) {
      return { message: "套装商品不一致或客户不参与" };
    }
    inCustStr = substring(inCustStr, 0, inCustStr.length - 1);
    var inIdList = JSON.parse(split(inCustStr, ",", 100));
    for (var prop in inIdList) {
      if (inIdList[prop] !== undefined && inIdList[prop] != "") {
        var itemSql = "select BInvGroupDetFk.*, * from GT4691AT1.GT4691AT1.BInvGroupDet where  BInvGroupDetFk ='" + inIdList[prop] + "' ";
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
              message += "【" + itemRes[prop]["gdInvCode"] + " " + itemRes[prop]["gdInvName"] + "】输入数量'" + itemObj[inv] + "'不符合套装比例 ";
              continue;
            } else {
              groupMsg[inv] = itemRes[prop];
            }
          } else {
            message += "【" + itemRes[prop]["gdInvCode"] + " " + itemRes[prop]["gdInvName"] + "】输入数量'" + itemObj[inv] + "'不符合套装比例 ";
            continue;
          }
        }
        //符合要求的组合
        if (message === "") {
          return { groupMsg: groupMsg, itemRes: itemRes, itemSql: itemSql, idSql: idSql, inCustSql: inCustSql, custSql: custSql };
        } else {
          message = invNameStr + "不符合套装比例，请检查套装【" + itemRes[0]["BInvGroupDetFk_gmName"] + "】";
          continue;
        }
      }
    }
    return { message: message, querystr: idSql };
  }
}
exports({ entryPoint: MyAPIHandler });