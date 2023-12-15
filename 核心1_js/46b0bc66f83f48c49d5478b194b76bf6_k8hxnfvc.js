let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let pbids = [];
    let id = request.id;
    let contractMaterialList = request.contractMaterialList;
    let reqMap = new Map();
    let pbMap = new Map();
    //获取采购任务ids
    for (var i7 = 0; i7 < contractMaterialList.length; i7++) {
      if (contractMaterialList[i7].pritemid) {
        pbids.push(contractMaterialList[i7].pritemid);
        reqMap.set(contractMaterialList[i7].pritemid, contractMaterialList[i7].taxMoney);
      }
    }
    if (pbids.length == 0) {
      return { status: "error", errmsg: "采购合同变更金额不能大于原采购合同金额！" };
    }
    let result = {};
    let ids = [];
    let hids = [];
    let bids = [];
    let praybillbids = [];
    let praybillids = [];
    let conMoneyMap = new Map(); //采购合同的合同金额：<需求申请单，预算金额>
    for (let i1 = 0; i1 < pbids.length; i1++) {
      let reqSql1 = "select * from sourcing.pureq.IpuPuReq  where id='" + pbids[i1] + "'";
      let ipuPuReqs = ObjectStore.queryByYonQL(reqSql1, "yonbip-cpu-sourcing"); // 'yonbip-cpu-sourcing'
      if (!praybillbids.includes(ipuPuReqs[0].sourcebid)) {
        praybillbids.push(ipuPuReqs[0].sourcebid);
      }
      let pbid = ipuPuReqs[0].sourcehid;
      if (!praybillids.includes(pbid)) {
        praybillids.push(pbid);
      }
      if (conMoneyMap.has(pbid)) {
        let money = conMoneyMap.get(pbid);
        money = money + reqMap.get(pbids[i1]);
        conMoneyMap.set(pbid, money);
      } else {
        conMoneyMap.set(pbid, reqMap.get(pbids[i1]));
      }
    }
    //获取需求申请预算金额<需求申请单,预算金额>
    let PBDetail = new Map();
    let pbsql = "select * from AXT000132.AXT000132.purchaseRequest where id in('" + praybillids.join("','") + "')";
    let pbheads = ObjectStore.queryByYonQL(pbsql, "yonbip-cpu-sourcing");
    for (let i3 = 0; i3 < pbheads.length; i3++) {
      PBDetail.set(pbheads[i3].id, pbheads[i3]);
    }
    //获取每个需求申请的累计采购合同金额
    let pb_contract_Map = new Map();
    for (let i4 = 0; i4 < praybillids.length; i4++) {
      let sql = "select * from sourcing.pureq.IpuPuReq  where sourcehid='" + praybillids[i4] + "'";
      let reqObjs = ObjectStore.queryByYonQL(sql, "yonbip-cpu-sourcing"); //ycReqManagement
      let pbReqBudgetMoney = 0;
      for (var p1 = 0; p1 < reqObjs.length; p1++) {
        let pritemid = reqObjs[p1].id;
        let conbSql = "select * from `cpu-contract.contract.ContractBodyVO` where pritemid ='" + pritemid + "' ";
        let conbObjs = ObjectStore.queryByYonQL(conbSql, "yonbip-cpu-cooperation"); //ycReqManagement
        for (let i5 = 0; i5 < conbObjs.length; i5++) {
          if (!id || conbObjs[i5].contractId !== id) {
            let conhSql = "select * from `cpu-contract.contract.ContractVO` where id ='" + conbObjs[i5].contractId + "' ";
            let conhObjs = ObjectStore.queryByYonQL(conhSql, "yonbip-cpu-cooperation"); //ycReqManagement
            if (conhObjs && conhObjs.length > 0 && conhObjs[0].billstatus !== "-1") {
              pbReqBudgetMoney += conbObjs[i5].taxMoney;
            }
          }
        }
      }
      let pbmny = PBDetail.get(praybillids[i4]).reqBudgetMny;
      let curconMny = conMoneyMap.get(praybillids[i4]);
      if (pbmny < curconMny + pbReqBudgetMoney) {
        result.status = "error";
        result.errmsg = "合同金额不能超出需求申请单预算金额！";
        result.praybill = PBDetail.get(praybillids[i4]);
        return result;
      }
    }
    result.status = "success";
    return result;
  }
}
exports({ entryPoint: MyAPIHandler });