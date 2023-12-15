let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let MODE;
    let env = ObjectStore.env();
    let ordersAppId = ""; // 采购订单的appId
    let ydOrgCode = ""; // 移动组织编码
    let vendorCode = ""; // 供应商编码
    let operatorCode = ""; // 采购员编码
    let deptCode = ""; // 采购部门编码
    let serviceCode = ""; //物流状态的serviceCode
    let CUSTOMER_CODE = ""; // 推送给海棠、立讯传递的客户编码
    let CUSTOMER_NAME = ""; // 推送给海棠、立讯传递的客户名称
    let X_HW_ID = ""; // S的授权信息
    let X_HW_APPKEY = ""; // S的授权信息
    if (env.tenantId == "d50c9jnj") {
      // 生产-贵州中融信通科技有限公司
      ordersAppId = "yourIdHere";
      ydOrgCode = "ZR001";
      vendorCode = "0001000024";
      operatorCode = "'S00000011'";
      deptCode = "Z007";
      serviceCode = "1710397136044032004"; //物流状态的serviceCode
      CUSTOMER_CODE = "ZR001";
      CUSTOMER_NAME = "贵州中融信通科技有限公司";
      X_HW_ID = "yourIDHere";
      X_HW_APPKEY = "yourKEYHere";
      MODE = "prod";
    } else if (env.tenantId == "gx6eogib") {
      // 贵州数算互联科技有限公司
      ordersAppId = "yourIdHere";
      ydOrgCode = "006";
      vendorCode = "10001";
      operatorCode = "'00000002','00000013'";
      deptCode = "S001";
      serviceCode = "1710388597649047553"; //物流状态的serviceCode
      CUSTOMER_CODE = "C0016999";
      CUSTOMER_NAME = "贵州数算互联科技有限公司";
      X_HW_ID = "yourIDHere";
      X_HW_APPKEY = "yourKEYHere";
      MODE = "prod";
    } else if (env.tenantId == "rz296oih") {
      // 测试-贵州中融信通科技有限公司
      ordersAppId = "yourIdHere";
      ydOrgCode = "006";
      vendorCode = "0001000024";
      operatorCode = "'00000003','00000067'";
      deptCode = "S001";
      serviceCode = "1702323130116079620"; //物流状态的serviceCode
      CUSTOMER_CODE = "C0016999";
      CUSTOMER_NAME = "贵州数算互联科技有限公司";
      X_HW_ID = "yourIDHere";
      X_HW_APPKEY = "yourKEYHere"; // test sit
      MODE = "dev";
    }
    const BASE_DATA = {
      dev: {
        //认证id
        X_HW_ID: X_HW_ID,
        //认证appkey
        X_HW_APPKEY: X_HW_APPKEY,
        //接口地址头
        URL: "https://apigw-scs-beta.huawei.com",
        // 采购订单appId
        ordersAppId: ordersAppId,
        ydOrgCode: ydOrgCode,
        vendorCode: vendorCode,
        operatorCode: operatorCode,
        deptCode: deptCode,
        serviceCode: serviceCode,
        CUSTOMER_CODE: CUSTOMER_CODE,
        CUSTOMER_NAME: CUSTOMER_NAME
      },
      prod: {
        //认证id
        X_HW_ID: X_HW_ID,
        //认证appkey
        X_HW_APPKEY: X_HW_APPKEY,
        //接口地址头
        URL: "https://apigw-scs.huawei.com",
        // 采购订单appId
        ordersAppId: ordersAppId,
        ydOrgCode: ydOrgCode,
        vendorCode: vendorCode,
        operatorCode: operatorCode,
        deptCode: deptCode,
        serviceCode: serviceCode,
        CUSTOMER_CODE: CUSTOMER_CODE,
        CUSTOMER_NAME: CUSTOMER_NAME
      }
    };
    const API_URL = {
      //回写HT要货指令
      uploadReportForEms: "/api/service/esupplier/reportForEmsUpload/1.0.0"
    };
    return { BASE: BASE_DATA[MODE], API_URL: API_URL };
  }
}
exports({ entryPoint: MyTrigger });