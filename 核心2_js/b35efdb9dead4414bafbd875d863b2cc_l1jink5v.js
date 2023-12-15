let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var editObj = param.data[0];
    var resObj = ObjectStore.queryByYonQL("select  MProductTag,MProductTag.code MProductTag_code,*  from GT4691AT1.GT4691AT1.MRebateAmountLog where id ='" + editObj.id + "' ");
    if (resObj.length <= 0) {
      throw new Error("保存失败");
    }
    editObj = resObj[0];
    var changeNum = 0;
    if (editObj.rpQuantity < 0) {
      //去掉当负数导入或负数手动调整时，会生成兑付记录的操作。因为会导致重复扣减
      return {};
    } else {
      return {};
    }
    let sql =
      "select  MProductTag,MProductTag.code MProductTag_code,sum(rpAftQuantity) as qty,rpBU  from GT4691AT1.GT4691AT1.MRebateAmountLog where rgCustomer='" +
      +editObj.rgCustomer +
      "' and rpLegalEntity='" +
      editObj.rpLegalEntity +
      "'  and rpAftQuantity>0 and MProductTag ='" +
      editObj.MProductTag +
      "'  and rpBU = '" +
      editObj.rpBU +
      "'   group by  MProductTag,MProductTag.code,rpBU ";
    let res = ObjectStore.queryByYonQL("" + sql);
    if (res.length <= 0) {
      throw new Error(
        "【" + editObj.MProductTag_code + "】【" + editObj.rpLegalEntity + "】【" + editObj.rgCustomerName + "】【" + editObj.rpBU + "】超出返利余额，本次调整金额：" + changeNum + "，返利余额：0"
      );
    }
    if (res.length > 0 && res[0].qty < changeNum) {
      throw new Error(
        "【" +
          editObj.MProductTag_code +
          "】【" +
          editObj.rpLegalEntity +
          "】【" +
          editObj.rgCustomerName +
          "】【" +
          editObj.rpBU +
          "】超出返利余额，本次调整金额：" +
          changeNum +
          "，返利余额：" +
          res[0].qty
      );
    }
    //满足可调整数量
    let sqlRecord =
      "select * from GT4691AT1.GT4691AT1.MRebateAmountLog where rgCustomer='" +
      +editObj.rgCustomer +
      "' and rpLegalEntity='" +
      editObj.rpLegalEntity +
      "' and rpAftQuantity>0 and MProductTag ='" +
      editObj.MProductTag +
      "' and rpBU = '" +
      editObj.rpBU +
      "'  order by MProductTag asc,createTime asc";
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
    let inRes = ObjectStore.insertBatch("GT4691AT1.GT4691AT1.MRebateAmountLog", insertRecords, "7a529c02");
    if (insertRecords.length == 0 || inRes.length != insertRecords.length) {
      throw new Error("保存失败：插入手动调整记录失败");
    }
    //更新返利品数量
    let upRes = ObjectStore.updateBatch("GT4691AT1.GT4691AT1.MRebateAmountLog", updateRecords);
    if (updateRecords.length == 0 || upRes.length != updateRecords.length) {
      throw new Error("保存失败：更新返利品记录失败");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });