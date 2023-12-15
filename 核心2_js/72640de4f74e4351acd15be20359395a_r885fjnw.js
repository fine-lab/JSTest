let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = {
      data: {
        data: {
          formmain_7667: {
            单据编号: "111",
            填报日期: "2022-12-16 12:36:35",
            申请组织: "1",
            申请人: "1",
            收款单位: "1",
            银行账号: "111",
            开户行: "111",
            付款总金额: "111",
            审批状态: "111",
            订单总金额: "111",
            付款类型: "111",
            付款比例: "111",
            付款方式: "111",
            申请部门: "111",
            备注: "111"
          },
          formson_7669: [
            {
              合同编号: "111",
              采购订单编号: "111",
              合同名称: "111",
              订单金额: "111",
              采购订单名称: "111"
            },
            {
              合同编号: "111",
              采购订单编号: "111",
              合同名称: "111",
              订单金额: "111",
              采购订单名称: "111"
            }
          ]
        },
        draft: "0",
        templateCode: "payment_request",
        attachments: []
      },
      appName: "collaboration"
    };
    let header = {
      "Content-Type": "application/json;charset=UTF-8",
      // 就是appCode
      apicode: "b65ba06816bf4d70919f41dc2c78f5fa",
      appkey: "yourkeyHere"
    };
    let responseObj = apiman("post", "http://218.4.202.238:9988/seeyon/rest/bpm/process/start", JSON.stringify(header), JSON.stringify(body));
    throw new Error(responseObj);
  }
}
exports({ entryPoint: MyTrigger });