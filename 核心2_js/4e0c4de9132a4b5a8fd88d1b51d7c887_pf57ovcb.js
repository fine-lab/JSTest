let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //公共变量
    //域名变量
    let httpURL = "https://c2.yonyoucloud.com";
    //引入日期格式化函数
    let funFmtDt = extrequire("AT17C47D1409580006.rule.dateFormatP");
    //当天日期
    let dtNow = new Date();
    let sFmtEndDate = funFmtDt.execute(dtNow) + " 23:59:59";
    //当天日期减7天，天*小时*分钟*秒*毫秒
    dtNow.setTime(dtNow.getTime() - 1 * 24 * 60 * 60 * 1000);
    let sFmtStartDate = funFmtDt.execute(dtNow) + " 00:00:00";
    //根据时间日期查询收款信息，找出最近审批时间为30天（暂定）的收款数据，查询其对应的销售订单编码、金额、审批时间；
    let sql = "select orderno,sum(oriSum) as pOriSum, max(mainid.auditTime) as pTime from arap.receivebill.ReceiveBill_b";
    sql += " where mainid.auditstatus='1'"; // 根据收款单的审批状态(已审批)去查询
    sql += " and mainid.auditTime>='2023-01-01 00:00:00' and mainid.auditTime<='2023-03-31 23:59:59'"; // 根据收款单的审批时间（1天以内）去查询
    sql += " group by orderno";
    let res = ObjectStore.queryByYonQL(sql, "fiarap");
    let orderhNO = res.map((x) => "'" + x.orderno + "'").join(",");
    for (let i = 0; i < res.length; i++) {
      let sqlid = "select id from voucher.order.Order";
      sqlid += " where code = '" + res[i].orderno + "'"; // 根据收款单的订单编号去查询销售订单id
      let resid = ObjectStore.queryByYonQL(sqlid, "udinghuo");
      sql = "select orderno,sum(oriSum) as pOriSum2, max(mainid.auditTime) as pTime2 from arap.receivebill.ReceiveBill_b";
      sql += " where orderno= '" + res[i].orderno + "'"; //
      let resP = ObjectStore.queryByYonQL(sql, "fiarap");
      //调用更新自定义项接口
      let url = httpURL + "/iuap-api-gateway/yonbip/sd/api/updateDefinesInfo";
      let definesInfo = {};
      definesInfo["isHead"] = true;
      definesInfo["isFree"] = true;
      if (resP.length > 0) {
        definesInfo["define18"] = resP[0].pTime2;
        definesInfo["define17"] = resP[0].pOriSum2;
      } else {
        definesInfo["define18"] = resP[0].pTime;
        definesInfo["define17"] = resP[0].pOriSum;
      }
      let body2 = {
        billnum: "voucher_order",
        datas: [
          {
            id: resid[0].id,
            code: res[0].orderno,
            definesInfo: [definesInfo]
          }
        ]
      };
      let apiResponse = openLinker("POST", url, "AT17C47D1409580006", JSON.stringify(body2)); //TODO：注意填写应用编码(请看注意事项)
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });