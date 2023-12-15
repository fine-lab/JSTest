let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param;
    let NAME = data.name.zh_CN != undefined ? data.name.zh_CN : null; // 名称
    let SORT1 = data.shortname.zh_CN != undefined ? data.shortname.zh_CN : null; // 简称
    let JOBNO = data.code; // 外部流水号 - 客户编码
    let id = data.id;
    // 使用sql查询客户档案信息
    let COUNTRY = data.country_code != undefined ? data.country_code : "CN"; // 国家
    let ADDRESS = data.address.zh_CN != undefined ? data.address.zh_CN : undefined; // 地址
    // 地区
    let areaStr;
    if (ADDRESS != undefined) {
      areaStr = substring(ADDRESS, 0, 2);
    } else {
      throw new Error("客户档案未在资质信息中维护详细地址信息");
    }
    let REGION;
    let sql = "select * from AT15D7426009680001.AT15D7426009680001.region where area = '" + areaStr + "'";
    var res = ObjectStore.queryByYonQL(sql, "developplatform");
    if (res != undefined) {
      if (res[0] != undefined) {
        REGION = res[0].SapAreaCode != undefined ? res[0].SapAreaCode : undefined;
      } else {
        throw new Error("SAP系统地区对应编码查询失败，请检查详细地址信息格式是否正确");
      }
    }
    if (REGION == undefined) {
      throw new Error("SAP系统地区对应编码查询失败，请检查详细地址信息格式是否正确");
    }
    // 默认拓展公司处理：
    if (context == undefined) {
      throw new Error("适用组织为空，请检查！");
    }
    let orgCodeList = context;
    let DEFAULT_BUKRS = join(orgCodeList, "/");
    let TAX_NUM = data.creditCode != undefined ? data.creditCode : undefined; // 统一社会信用代码
    if (TAX_NUM == undefined) {
      throw new Error("未填写资质信息项证照号码信息，请检查");
    }
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
    let sql3 = "select * from	bd.bank.BankVO where id ='" + bankId + "'";
    var res5 = ObjectStore.queryByYonQL(sql3, "ucfbasedoc");
    if (res5 != undefined) {
      BANKZH = ZIFT_MA002_BANK.bankAccount != undefined ? ZIFT_MA002_BANK.bankAccount : undefined; // 银行账号
      KOINH = res5[0].name != undefined ? res5[0].name : undefined; // 银行名称
      BANKL = ZIFT_MA002_BANK.jointLineNo != undefined ? ZIFT_MA002_BANK.jointLineNo : undefined; // 银行联行号
    } else {
      throw new Error("查询银行详细信息失败，请重试");
    }
    if (BANKZH == undefined) {
      throw new Error("银行账号为空，请检查");
    }
    if (KOINH == undefined) {
      throw new Error("银行名称为空，请检查");
    }
    if (BANKL == undefined) {
      throw new Error("银行联行号为空，请检查");
    }
    let ZDKTYPE;
    let KUKLA;
    if (data.customerClass_Name != undefined) {
      if (data.customerClass_Name == "国内客户") {
        ZDKTYPE = "01";
      } else if (data.customerClass_Name == "国外客户") {
        ZDKTYPE = "02";
      }
    } else {
      throw new Error("客户分类未维护，请检查");
    }
    if (data.merchantAppliedDetailcustomerType_Name != undefined) {
      if (data.merchantAppliedDetailcustomerType_Name == "贸易商") {
        KUKLA = "01";
      } else if (data.merchantAppliedDetailcustomerType_Name == "终端") {
        KUKLA = "02";
      } else if (data.merchantAppliedDetailcustomerType_Name == "运输物流公司") {
        KUKLA = "03";
      }
    } else {
      throw new Error("销售渠道未维护，请检查");
    }
    // 组装body参数
    let body = {
      funName: "ZIF_MA_FUNC_002",
      structure: {
        ZIFT_MA002_HEAD: {
          JOBNO: JOBNO, // 外部流水号 - 客户编码 -
          ZDKTYPE: ZDKTYPE, // 主数据新增类型 - 默认客户：01  - YS的客户分类
          NAME: NAME, // 全称
          SORT1: SORT1, // 简称
          KUKLA: KUKLA, // 客户分类 - 默认值：01 - YS的销售渠道
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