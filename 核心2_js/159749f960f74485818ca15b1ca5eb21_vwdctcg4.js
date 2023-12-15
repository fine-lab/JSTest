let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var editObj = param.data[0];
    var changeNum = 0;
    if (editObj.rpQuantity < 0) {
      //去掉当负数导入或负数手动调整时，会生成兑付记录的操作。因为会导致重复扣减
      return {};
    } else {
      return {};
    }
    let sql =
      "select  rpInv,rpInvCode,rpInvName,sum(rpAftQuantity) as qty,rpBU,rpbInStock  from GT4691AT1.GT4691AT1.MRebateProductsLog where rgCustomer='" +
      +editObj.rgCustomer +
      "'   and rpAftQuantity>0 and rpInv ='" +
      editObj.rpInv +
      "'   and rpBU = '" +
      editObj.rpBU +
      "'   group by  rpInv,rpInvCode,rpInvName,rpBU,rpbInStock ";
    let res = ObjectStore.queryByYonQL("" + sql);
    if (res.length <= 0) {
      throw new Error("【" + editObj.rgCustomerName + "】【" + editObj.rpInv_name + "】【" + editObj.rpBU + "】超出赠品池数量，本次调整数量：" + changeNum + "，赠品池数量：0");
    }
    if (res[0]["rpbInStock"] != "是") {
      throw new Error("物料【" + editObj.rpInv_name + "】当前无库存兑换    | " + sql + "  | " + res[0]["rpbInStock"]);
    }
    if (res.length > 0 && res[0].qty < changeNum) {
      throw new Error("【" + editObj.rgCustomerName + "】【" + editObj.rpInv_name + "】【" + editObj.rpBU + "】超出赠品池数量，本次调整数量：" + changeNum + "，赠品池数量：" + res[0].qty);
    }
    //满足可调整数量
    let sqlRecord =
      "select  *  from GT4691AT1.GT4691AT1.MRebateProductsLog where rgCustomer='" +
      +editObj.rgCustomer +
      "'  and rpAftQuantity>0 and rpInv ='" +
      editObj.rpInv +
      "'  and rpbInStock='是'   and rpBU = '" +
      editObj.rpBU +
      "'    order by rpInv asc,createTime asc";
    let resRecord = ObjectStore.queryByYonQL("" + sqlRecord);
    let insertRecords = [];
    let updateRecords = [];
    function getDate(date) {
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return y + "-" + m + "-" + d;
    }
    let formatDate = getDate(new Date());
    for (let i = 0; i < resRecord.length; i++) {
      //如果小于
      let redNum = resRecord[i]["rpAftQuantity"] >= changeNum ? changeNum : resRecord[i]["rpAftQuantity"];
      //修改原记录
      resRecord[i]["rpAftQuantity"] = resRecord[i]["rpAftQuantity"] - redNum;
      let updateRow = {};
      updateRow.id = resRecord[i]["id"];
      updateRow.rpAftQuantity = resRecord[i]["rpAftQuantity"];
      updateRecords.push(updateRow);
      changeNum = changeNum - redNum;
      //插入一行记录
      let inRow = JSON.parse(JSON.stringify(resRecord[i]));
      inRow["rpQuantity"] = 0;
      inRow["rgExQuantity"] = redNum;
      inRow["rpAftQuantity"] = 0;
      inRow["rpId"] = "";
      inRow["rpSourceBillCode"] = editObj.code;
      inRow["logSource"] = "手动调整";
      inRow["rpdDate"] = formatDate;
      inRow["rpPreQuantity"] = resRecord[i]["rpAftQuantity"];
      inRow["rpExMemo"] = resRecord[i]["code"];
      inRow["rpParentId"] = resRecord[i]["id"];
      //记录前置订单单号
      insertRecords.push(inRow);
      if (changeNum <= 0) {
        break;
      }
    }
    let inRes = ObjectStore.insertBatch("GT4691AT1.GT4691AT1.MRebateProductsLog", insertRecords, "3544faf8");
    if (insertRecords.length == 0 || inRes.length != insertRecords.length) {
      throw new Error("保存失败：插入手动调整记录失败");
    }
    //更新返利品数量
    let upRes = ObjectStore.updateBatch("GT4691AT1.GT4691AT1.MRebateProductsLog", updateRecords);
    if (updateRecords.length == 0 || upRes.length != updateRecords.length) {
      throw new Error("保存失败：更新返利品记录失败");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });