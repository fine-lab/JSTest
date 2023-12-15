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
    let deviceSupplier = ""; // S传递过来的供应商标识
    if (env.tenantId == "jrpoimu6") {
      // 多多云-YS试用  为测试环境
      X_HW_ID = "yourIDHere";
      X_HW_APPKEY = "yourKEYHere"; // test sit
      CUSTOMER_CODE = "C0156092"; // TODO
      CUSTOMER_NAME = "福建多多云科技有限公司";
      ordersAppId = "yourIdHere";
      ydOrgCode = "notExist"; // 暂无此业务
      vendorCode = "20220316001";
      operatorCode = "'00000001'";
      deptCode = "DDY02";
      serviceCode = "1702323130116079620"; //物流状态的serviceCode
      deviceSupplier = "DDY";
      MODE = "dev";
    } else if (env.tenantId == "qcbzpfxs") {
      // 多多云-YS生产
      X_HW_ID = "yourIDHere";
      X_HW_APPKEY = "yourKEYHere";
      CUSTOMER_CODE = "C0156092";
      CUSTOMER_NAME = "福建多多云科技有限公司";
      ordersAppId = "yourIdHere";
      ydOrgCode = "notExist"; // 暂无此业务
      vendorCode = "20220316001";
      operatorCode = "'001'";
      deptCode = "DDY02";
      serviceCode = "1702323130116079620"; //物流状态的serviceCode
      deviceSupplier = "DDY";
      MODE = "prod";
    } else if (env.tenantId == "gozou9uj") {
      // 翼海云峰-YS生产
      X_HW_ID = "yourIDHere";
      X_HW_APPKEY = "yourKEYHere";
      CUSTOMER_CODE = "C0108218";
      CUSTOMER_NAME = "深圳市翼海云峰科技有限公司";
      ordersAppId = "yourIdHere";
      ydOrgCode = "notExist"; // 暂无此业务
      vendorCode = "SZYHGYS00038";
      operatorCode = "'SZYHYG000004'";
      deptCode = "SZYHBM0001";
      serviceCode = "1702323130116079620"; //物流状态的serviceCode
      deviceSupplier = "YHYF";
      MODE = "prod";
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
        CUSTOMER_NAME: CUSTOMER_NAME,
        deviceSupplier: deviceSupplier
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
        CUSTOMER_NAME: CUSTOMER_NAME,
        deviceSupplier: deviceSupplier
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