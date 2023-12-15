let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param;
    let JYNUM = data.code; // 外部流水号
    let MSEHI = data.unit_Name; // 基本计量单位 - 当前拿的是单位名称
    let MAKTX = data.name.zh_CN; // 物料描述 - 当前拿的是物料名称
    let ZTAXHB = ""; // TODO 税务合并编码
    if (data.detailinTaxrate == undefined) {
      throw new Error("进项税率未维护，请检查");
    }
    if (data.detailoutTaxrate == undefined) {
      throw new Error("销项税率未维护，请检查");
    }
    let inTaxrate = data.detailinTaxrate; // 进项税码
    let outTaxrate = data.detailoutTaxrate; // 销项税率
    let sql = "select * from AT15D7426009680001.AT15D7426009680001.allTax where taxRateVO = '" + inTaxrate + "'";
    var res = ObjectStore.queryByYonQL(sql, "developplatform");
    if (res == undefined) {
      throw new Error("查询进项税率对应关系失败，请重试");
    }
    let TAXIM_ZZ = res[0].taxValue; // 内贸增值税税码 - 需要确定对应关系
    let sql1 = "select * from AT15D7426009680001.AT15D7426009680001.allTax where taxRateVO = '" + outTaxrate + "'";
    var res1 = ObjectStore.queryByYonQL(sql1, "developplatform");
    if (res1 == undefined) {
      throw new Error("查询销项税率对应关系失败，请重试");
    }
    let TAXIM_CK = res1[0].taxValue; // 出口退税率 - 需要确定对应关系
    // 组装body参数
    let body = {
      funName: "ZIF_MA_FUNC_005",
      structure: {
        ZIFT_MA005_HEAD: {
          JYNUM: JYNUM, // 外部流水号-ys物料编码
          EKORG: "1340", // 部门编码 - 固定值：1340
          MSEHI: "KG", // 基本计量单位
          TAXIM_ZZ: TAXIM_ZZ, // 内贸增值税税码，示例：4（代表13%）
          TAXIM_CK: TAXIM_CK, // 出口退税率，示例：11 - 非必填
          SPART: "22", // 产品组 ，示例：22 - 固定值：22
          MATKL: "22001", // 物料组 ，示例：22001
          ZTAXHB: "1060105010000000000", // 税务合并编码，示例：1060105010000000000
          MAKTX: MAKTX, // 物料描述，40位，示例：金光无品牌HTP2热敏纸收银型-02TEST11
          ZCKZY: "", // 出口直运，是：X；否：空，示例：
          ZJKZY: "", // 进口直运，是：X；否：空，示例：
          ACTION: "1", // 操作标志，目前固定“1”，示例：1
          SENDER: "GYS" // 发送系统，示例：SCC - 固定值 -
        }
      }
    };
    return { body: body };
  }
}
exports({ entryPoint: MyTrigger });