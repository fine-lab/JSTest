let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param;
    let NAME = data.name.zh_CN; // 名称
    let SORT1 = data.shortname.zh_CN; // 简称
    let JOBNO = data.code; // 外部流水号 - 客户编码
    let id = data.id;
    // 使用sql查询客户档案信息
    let cilentSql = "select * from aa.merchant.MerchantApplyRange where merchantId ='" + id + "'";
    var res2 = ObjectStore.queryByYonQL(cilentSql, "productcenter");
    let COUNTRY = data.country_code != undefined ? data.country_code : "CN"; // 国家
    let ADDRESS = data.address.zh_CN != undefined ? data.address.zh_CN : undefined; // 地址
    // 地区
    let areaStr = "";
    if (ADDRESS != undefined) {
      areaStr = substring(ADDRESS, 0, 2);
    }
    let REGION;
    let sql = "select * from GT62AT45.GT62AT45.reglon where area = '" + areaStr + "'";
    var res = ObjectStore.queryByYonQL(sql, "developplatform");
    if (res != null) {
      REGION = res[0].SapAreaCode;
    }
    // 默认拓展公司处理：
    let orgCodeList = [];
    if (res2 != undefined) {
      for (var i = 0; i < res2.length; i++) {
        orgCodeList.push(res2[i].orgId);
      }
    }
    let DEFAULT_BUKRS = join(orgCodeList, "/");
    let TAX_NUM = data.creditCode != undefined ? data.creditCode : undefined; // 统一社会信用代码
    // 银行信息
    let sql2 = "select * from aa.merchant.AgentFinancial where merchantId ='" + id + "'";
    var res4 = ObjectStore.queryByYonQL(sql2, "productcenter");
    let ZIFT_MA002_BANK = res4[0] != undefined ? res4[0] : undefined;
    if (ZIFT_MA002_BANK == undefined) {
      // 银行信息未填写
      return "";
    }
    let bankId = ZIFT_MA002_BANK.bank;
    let BANKZH;
    let KOINH;
    let BANKL;
    if (ZIFT_MA002_BANK != undefined) {
      let sql3 = "select * from	bd.bank.BankVO where id ='" + bankId + "'";
      var res5 = ObjectStore.queryByYonQL(sql3, "ucfbasedoc");
      BANKZH = ZIFT_MA002_BANK.bankAccount; // 银行账号
      KOINH = res5[0].name; // 银行名称
      BANKL = ZIFT_MA002_BANK.jointLineNo; // 银行联行号
    }
    let body = {
      funName: "ZIF_MA_FUNC_002",
      structure: {
        ZIFT_MA002_HEAD: {
          JOBNO: JOBNO, // 外部流水号 - 客户编码
          ZDKTYPE: "01", // 主数据新增类型 - 默认客户：01
          NAME: NAME, // 全称
          SORT1: SORT1, // 简称
          KUKLA: "01", // 客户分类 - 默认值：01
          ZLOWCASE: "", // 是否区分大小写 ，键值见附录，示例：
          ZFLAG_SG: "", // 是否具备免税资质，键值见附录，示例：
          WAERS: "CNY", // 货币，MDM中币种，示例：CNY
          TAX_NUM: TAX_NUM, // 统一社会信用代码，示例：91110105MA005J5T5E
          ADDRESS: ADDRESS, // 地址
          COUNTRY: COUNTRY, // 国家，MDM中国家/地区，示例：CN
          REGION: REGION, // 地区，MDM中国家/地区，示例：010
          DEFAULT_BUKRS: DEFAULT_BUKRS, // 默认拓展公司，MDM中法人公司，斜杆拼接，示例：1000/1020 - YS适用组织
          SENDER: "GYS" // 发送系统表示，示例：SCC
        }
      },
      tables: {
        ZIFT_MA002_BANK: [
          // 银行信息
          {
            CHK_KP: "", // 是否默认开票帐户，键值见附录，示例：X（默认），空（否）
            KOINH: KOINH, // 银行名称，示例：中国农业银行
            BANKZH: BANKZH, // 银行帐号，示例：87766238334
            BANKS: "CN", // 银行国家，MDM中国家/地区，示例：CN
            BANKL: BANKL, // 银行联行号，示例：123456789012
            BANK_SWIFT: "" // 银行SWIFT代码
          }
        ],
        ZIFT_MA002_ITEM: [
          // 组织架构信息
          {
            P_VKBUR: "1010", // 部门，MDM中部门，示例：1010
            VKGRP: "Q55" // 部组，MDM中部组，示例：Q55
          }
        ]
      }
    };
    return { body };
  }
}
exports({ entryPoint: MyTrigger });