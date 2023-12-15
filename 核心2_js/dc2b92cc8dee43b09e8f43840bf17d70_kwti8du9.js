let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var Data = param.data[0];
    var requestData = param.requestData[0];
    var _status = requestData._status;
    //线上渠道
    var platformType = Data.platformType;
    var platform = "";
    if (platformType == "1") {
      platform = "淘宝";
    } else if (platformType == "2") {
      platform = "京东";
    } else if (platformType == "3") {
      platform = "苏宁";
    } else if (platformType == "6") {
      platform = "小红书";
    } else if (platformType == "7") {
      platform = "有赞";
    } else if (platformType == "8") {
      platform = "1688";
    } else if (platformType == "9") {
      platform = "拼多多";
    } else if (platformType == "11") {
      platform = "淘宝供销平台";
    } else if (platformType == "16") {
      platform = "驿氪";
    } else if (platformType == "18") {
      platform = "爱库存";
    } else if (platformType == "120") {
      platform = "京东厂直";
    } else if (platformType == "22") {
      platform = "会员中心";
    } else if (platformType == "23") {
      platform = "唯品会MP";
    } else if (platformType == "24") {
      platform = "唯品会JITX省仓";
    } else if (platformType == "27") {
      platform = "快手";
    } else if (platformType == "41") {
      platform = "美团外卖";
    } else if (platformType == "42") {
      platform = "饿了么零售";
    } else if (platformType == "44") {
      platform = "微盟微商城";
    } else if (platformType == "45") {
      platform = "抖音";
    } else if (platformType == "46") {
      platform = "考拉pop";
    } else if (platformType == "168") {
      platform = "云集代销";
    } else if (platformType == "25") {
      platform = "京东到家";
    } else if (platformType == "99") {
      platform = "其他";
    } else if (platformType == "4") {
      platform = "自建商城";
    } else if (platformType == "12") {
      platform = "门店";
    }
    // 组织id
    var org = Data.org;
    // 组织名称
    var org_Name = Data.org_name;
    var id = Data.id;
    // 店铺名称
    var nameList = Data.name;
    var name = nameList.zh_CN;
    // 店铺编码
    var code = Data.codebianma;
    // 终端类型
    var terminalType = Data.terminalType;
    // 部门id
    var dept = Data.dept;
    // 部门名称
    var dept_name = Data.dept_name;
    // 客户名称
    var cust_name = Data.cust_name;
    // 客户id
    var cust = Data.cust;
    // 电商业务数据
    var electronicCommerce = Data.electronicCommerce;
    // 平台类型
    var platType = electronicCommerce[0].platType;
    // 店铺编码
    var shopCode = electronicCommerce[0].shopCode;
    // 店铺名称
    var shopName = electronicCommerce[0].shopName;
    // 默认发货模式
    var invoiceType = electronicCommerce[0].invoiceType;
    // 订单交易类型id
    var trade_transtype = electronicCommerce[0].trade_transtype;
    // 订单交易类型名称
    var trade_transtype_name = electronicCommerce[0].trade_transtype_name;
    // 交易类型id
    var ys_currency = electronicCommerce[0].ys_currency;
    // 交易类型名称
    var ys_currency_name = electronicCommerce[0].ys_currency_name;
    // 退换货单交易类型id
    var refund_transtype = electronicCommerce[0].refund_transtype;
    // 退换货单交易类型名称
    var refund_transtype_name = electronicCommerce[0].refund_transtype_name;
    var electronicCommerceId = electronicCommerce[0].id;
    // 仓库数组
    var warehouses = Data.warehouses;
    if (_status == "Insert") {
      let ArrList = new Array();
      let warehousesData = {};
      let electronicCommerceData = {};
      let CommerceData = {};
      let CommerceList = new Array();
      let ArrayList = new Array();
      let extendPropsList = new Array();
      let extendPropsData = {
        customerCode: cust_name,
        cust: cust
      };
      if (warehouses != undefined) {
        for (let i = 0; i < warehouses.length; i++) {
          // 仓库id
          let warehouse = warehouses[i].warehouse;
          // 仓库名称
          let warehouse_name = warehouses[i].warehouse_name;
          let id = warehouses[i].id;
          warehousesData = {
            id: id,
            warehouse: warehouse,
            warehouse_name: warehouse_name
          };
          ArrList.push(warehousesData);
        }
        electronicCommerceData = {
          platType: platType,
          shopCode: shopCode,
          shopName: shopName,
          invoiceType: invoiceType,
          trade_transtype: trade_transtype,
          trade_transtype_name: trade_transtype_name,
          ys_currency: ys_currency,
          ys_currency_name: ys_currency_name,
          refund_transtype: refund_transtype,
          refund_transtype_name: refund_transtype_name,
          id: electronicCommerceId
        };
        ArrayList.push(electronicCommerceData);
        let jsonBody = {
          shopCode: code,
          shopName: name,
          platformType: platform,
          id: id,
          orgId: org,
          orgIdName: org_Name,
          terminalType: terminalType,
          warehouses: ArrList,
          electronicCommerce: ArrayList,
          businessType: platformType,
          dept: dept,
          dept_name: dept_name,
          extendProps: extendPropsData,
          _status: "Insert"
        };
        let body = {
          appCode: "beiwei-base-data",
          appApiCode: "standard.shop.sync",
          schemeCode: "beiwei_bd",
          jsonBody: jsonBody
        };
        let header = { key: "yourkeyHere" };
        let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
        let str = JSON.parse(strResponse);
        if (str.success != true) {
          throw new Error(strResponse);
        }
      } else {
        CommerceData = {
          platType: platType,
          shopCode: shopCode,
          shopName: shopName,
          invoiceType: invoiceType,
          trade_transtype: trade_transtype,
          trade_transtype_name: trade_transtype_name,
          ys_currency: ys_currency,
          ys_currency_name: ys_currency_name,
          refund_transtype: refund_transtype,
          refund_transtype_name: refund_transtype_name,
          id: electronicCommerceId
        };
        CommerceList.push(CommerceData);
        let jsonBody = {
          shopCode: code,
          shopName: name,
          platformType: platform,
          id: id,
          orgId: org,
          orgIdName: org_Name,
          terminalType: terminalType,
          electronicCommerce: CommerceList,
          businessType: platformType,
          dept: dept,
          dept_name: dept_name,
          extendProps: extendPropsData,
          _status: "Insert"
        };
        let body = {
          appCode: "beiwei-base-data",
          appApiCode: "standard.shop.sync",
          schemeCode: "beiwei_bd",
          jsonBody: jsonBody
        };
        let header = { key: "yourkeyHere" };
        let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
        let str = JSON.parse(strResponse);
        if (str.success != true) {
          throw new Error(strResponse);
        }
      }
    } else {
      let ArrList = new Array();
      let warehousesData = {};
      let electronicCommerceData = {};
      let CommerceData = {};
      let CommerceList = new Array();
      let ArrayList = new Array();
      let extendPropsList = new Array();
      let extendPropsData = {
        customerCode: cust_name,
        cust: cust
      };
      if (warehouses != undefined) {
        for (let i = 0; i < warehouses.length; i++) {
          // 仓库id
          let warehouse = warehouses[i].warehouse;
          // 仓库名称
          let warehouse_name = warehouses[i].warehouse_name;
          let id = warehouses[i].id;
          warehousesData = {
            id: id,
            warehouse: warehouse,
            warehouse_name: warehouse_name
          };
          ArrList.push(warehousesData);
        }
        electronicCommerceData = {
          platType: platType,
          shopCode: shopCode,
          shopName: shopName,
          invoiceType: invoiceType,
          trade_transtype: trade_transtype,
          trade_transtype_name: trade_transtype_name,
          ys_currency: ys_currency,
          ys_currency_name: ys_currency_name,
          refund_transtype: refund_transtype,
          refund_transtype_name: refund_transtype_name,
          id: electronicCommerceId
        };
        ArrayList.push(electronicCommerceData);
        let jsonBody = {
          shopCode: code,
          shopName: name,
          id: id,
          orgId: org,
          platformType: platform,
          orgIdName: org_Name,
          terminalType: terminalType,
          warehouses: ArrList,
          electronicCommerce: ArrayList,
          businessType: platformType,
          dept: dept,
          dept_name: dept_name,
          extendProps: extendPropsData,
          _status: "Update"
        };
        let body = {
          appCode: "beiwei-base-data",
          appApiCode: "standard.shop.sync",
          schemeCode: "beiwei_bd",
          jsonBody: jsonBody
        };
        let header = { key: "yourkeyHere" };
        let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
        let str = JSON.parse(strResponse);
        if (str.success != true) {
          throw new Error(strResponse);
        }
      } else {
        CommerceData = {
          platType: platType,
          shopCode: shopCode,
          shopName: shopName,
          invoiceType: invoiceType,
          trade_transtype: trade_transtype,
          trade_transtype_name: trade_transtype_name,
          ys_currency: ys_currency,
          ys_currency_name: ys_currency_name,
          refund_transtype: refund_transtype,
          refund_transtype_name: refund_transtype_name,
          id: electronicCommerceId
        };
        CommerceList.push(CommerceData);
        let jsonBody = {
          shopCode: code,
          shopName: name,
          id: id,
          orgId: org,
          platformType: platform,
          orgIdName: org_Name,
          terminalType: terminalType,
          electronicCommerce: CommerceList,
          dept: dept,
          dept_name: dept_name,
          businessType: platformType,
          extendProps: extendPropsData,
          _status: "Update"
        };
        let body = {
          appCode: "beiwei-base-data",
          appApiCode: "standard.shop.sync",
          schemeCode: "beiwei_bd",
          jsonBody: jsonBody
        };
        let header = { key: "yourkeyHere" };
        let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
        let str = JSON.parse(strResponse);
        if (str.success != true) {
          throw new Error(strResponse);
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });