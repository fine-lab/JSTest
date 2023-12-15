let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var rebateid = request.rebateid;
    var querySaleSql = "select policyType, name, feeId, PolApplAmount, remark FROM AT16388E3408680009.AT16388E3408680009.mzgd_RebatePolicys where id='" + rebateid + "'";
    var custsql = "select rebateId FROM voucher.rebate.AmountRebateDefine where define1='" + rebateid + "'";
    var sumsql;
    var resultSales = ObjectStore.queryByYonQL(querySaleSql);
    var resultcustsql = ObjectStore.queryByYonQL(custsql, "marketingbill");
    var agentCode = ObjectStore.queryByYonQL("select code FROM aa.merchant.Merchant where id='" + request.UserAgentId + "'", "productcenter");
    //已使用金额
    var summoney = 0;
    resultcustsql.forEach((row) => {
      sumsql = ObjectStore.queryByYonQL("select rebateMoney FROM voucher.rebate.Rebate where id='" + row.rebateId + "'", "marketingbill");
      //客户费用金额总和
      summoney = summoney + sumsql[0].rebateMoney;
    });
    //查客户编码
    //未使用金额
    var querybalance = ObjectStore.queryByYonQL("select balance FROM AT16388E3408680009.AT16388E3408680009.mzgd_RebatePolicys where id='" + rebateid + "'");
    var balce = querybalance[0].balance + request.UseMoney;
    var object = [
      {
        policyType: resultSales[0].policyType, //政策类型
        name: resultSales[0].name, //政策名称
        feeId: resultSales[0].feeId, //费用项目
        PolApplAmount: resultSales[0].PolApplAmount, //政策申请金额
        remark: resultSales[0].remark, //备注
        UserbarAmount: summoney, //已使用金额
        AvailableAmount: balce, //返利未使用金额
        ChannelAgentID: request.ChannelAgentID, //客户费用金额ID
        ChannelAgentCode: request.ChannelAgentCode, //客户费用金额单号
        UserAgentId: request.UserAgentId, //客户id
        AgentCode: agentCode[0].code, //客户编码
        AgentName: request.agentId_name, //客户名称
        UseMoney: request.UseMoney //使用金额
      }
    ];
    // 改返利政策-余额数据
    var objectupd = {
      id: rebateid,
      balance: balce
    };
    var updatarehate = ObjectStore.updateById("AT16388E3408680009.AT16388E3408680009.mzgd_RebatePolicys", objectupd, "2a32a530List");
    var res = ObjectStore.insertBatch("AT16388E3408680009.AT16388E3408680009.flzcjlbzhu", object, "0ff04b89List");
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });