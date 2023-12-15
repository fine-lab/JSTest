let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let JOBNO = param.JOBNO; // 外部流水号
    let CRED_ID = param.CRED_ID; // SAP申请流水号
    // 组装客户档案审核接口请求body参数：
    let auditBody = {
      funName: "ZIF_MA_FUNC_004",
      structure: {
        ZIFS_MA004_HEAD: {
          JOBNO: JOBNO, // 外部流水号，示例：SHCS000001
          CRED_ID: CRED_ID, // SAP申请流水号，示例：0000008770
          SENDER: "GYS" // 发送系统，示例：SCC
        }
      }
    };
    // 调用SAP接口：
    let func2 = extrequire("AT15C9C13409B00004.A3.sendSap");
    let sapStrResponse1 = func2.execute(null, auditBody); // null可换SAP接口url地址
    let sapStrResponseJSON = JSON.parse(sapStrResponse1.strResponse);
    if (sapStrResponseJSON.ZIF_MA_FUNC_004.OUTPUT.ZIFS_MA004_RETURN.TRAN_FLAG == 0) {
      // 审核成功，返回SAP客商编码
      var clientCode = sapStrResponseJSON.ZIF_MA_FUNC_004.OUTPUT.ZIFS_MA004_RETURN.SAPNUM;
      return { clientCode };
    } else {
      // 审核失败
      throw new Error("客户档案推送SAP审核失败：" + JSON.stringify(sapStrResponse1.ZIF_MA_FUNC_004.OUTPUT.ZIFS_MA004_RETURN.ZMESSAGE));
    }
    return { clientCode };
  }
}
exports({ entryPoint: MyTrigger });