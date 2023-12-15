let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //工序委外
    var zid = request.data.id;
    //获取组织的code
    var orgId = request.data.organizationId;
    var orgRes = ObjectStore.queryByYonQL("select * from org.func.BaseOrg where id = '" + orgId + "'", "orgcenter");
    if (orgRes.length == 0) {
      throw new Error("查询组织数据为空");
    }
    var orgCode = orgRes[0].code;
    //获取供应商code
    var vendorId = request.data.supplierId;
    var vendorRes = ObjectStore.queryByYonQL("select * from aa.vendor.Vendor where id = '" + vendorId + "'", "yssupplier");
    var vendorCode = vendorRes[0].code;
    // 采购入库单请求参数
    var body = {};
    //主表
    //更新时间
    var timezone = 8; //目标时区时间，东八区
    var offset_GMT = new Date().getTimezoneOffset(); //本地时间和格林威治的时间差，单位为分钟
    var nowDate = new Date().getTime(); //本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
    var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
    var format = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var date1 = date.getDate();
    var strdate = year + format + (month < 10 ? "0" + month : month) + format + (date1 < 10 ? "0" + date1 : date1);
    var uuida = uuid();
    var uuidx = replace(uuida, "-", "");
    var data1 = {
      resubmitCheckKey: uuidx, //uuid
      bustype_code: "WWFU01", //交易类型编码
      currency_code: "CNY", //币种简称
      exchRate: "1", //汇率
      exchRateType: "01", //汇率类型id 或 汇率类型code
      invoiceVendor_code: vendorCode, //开票供应商编码
      natCurrency_code: "CNY", //本币
      org_code: orgCode, //组织编码      orgId
      _status: "Insert", //操作标识, Insert:新增、Update:更新
      bizFlow: "cc4e8582-9178-11ed-9896-6c92bf477043",
      vendor_code: vendorCode, //供货供应商编码
      vouchdate: strdate //单据日期
    };
    var headFreeIte = {
      define2: request.data.testItemCode,
      define3: request.data.chanpinxian
    };
    data1.headFreeItem = headFreeIte;
    //获取项目的code
    var xmId = request.data.testItemCode;
    var xmRes = ObjectStore.queryByYonQL("select code from bd.project.ProjectVO where id = '" + xmId + "'", "ucfbasedoc");
    var xmCode = xmRes[0].code;
    var processNum = request.data.subTableNum.length; //数量
    var natMoneyz = request.data.wushuijine; // 本币无税金额
    natMoneyz = Number(natMoneyz).toFixed(2);
    var natSumz = request.data.hanshuijine; // 本币含税金额
    natSumz = Number(natSumz).toFixed(2);
    var natTaxz = natSumz - natMoneyz; // 本币税额
    natTaxz = natTaxz.toFixed(2);
    var oriMoneyz = natSumz - natTaxz;
    var oriTaxnatSumz = natSumz / processNum; //   含税单价
    oriTaxnatSumz = oriTaxnatSumz.toFixed(2);
    var oriUnitNatMoneyz = natMoneyz / processNum; //   无税单价
    oriUnitNatMoneyz = oriUnitNatMoneyz.toFixed(2);
    //查询物料;
    var queryProduct = "select * from pc.product.Product where code='GXWW000001'";
    var productRes = ObjectStore.queryByYonQL(queryProduct, "productcenter");
    if (productRes.length == 0) {
      throw new Error("未查询到物料编码【GXWW000001】对应的物料档案信息！");
    }
    var unit = productRes[0].unit; //物料主计量单位
    //查询单位;
    var unitsql = "select * from aa.product.ProductUnit where id='" + unit + "'";
    var unitsqlRes = ObjectStore.queryByYonQL(unitsql, "productcenter");
    if (unitsqlRes.length == 0) {
      throw new Error("未查询到物料编码【GXWW000001】对应的单位信息！");
    }
    var unitCode = unitsqlRes[0].code;
    //子表
    var chaseOrder = {
      inInvoiceOrg_code: orgCode, // 收票组织编码    orgId
      inOrg_code: orgCode, // 收货组织编码
      invExchRate: "1", // 采购换算率
      natMoney: natMoneyz, // 本币无税金额
      natSum: natSumz, // 本币含税金额
      natTax: natTaxz, // 	本币税额
      natTaxUnitPrice: oriTaxnatSumz, // 本币含税单价
      natUnitPrice: oriUnitNatMoneyz, // 本币无税单价
      oriMoney: natMoneyz, // 无税金额
      oriSum: natSumz, // 含税金额
      oriTax: natTaxz, // 税额
      oriTaxUnitPrice: oriTaxnatSumz, // 含税单价
      oriUnitPrice: oriUnitNatMoneyz, // 无税单价
      taxitems_code: request.data.shuie, // 税目税率编码
      priceQty: processNum, // 计价数量
      product_cCode: "GXWW000001", // 	物料编码
      productsku: productRes[0].defaultSKUId, //物料默认SKU
      priceUOM_Code: unitCode, // 计价单位编码
      purUOM_Code: unitCode, // 采购单位编码
      qty: processNum, // 	数量
      subQty: processNum, // 	采购数量
      unitExchangeTypePrice: "0", // 	计价单位转换率的换算方式：0固定换算；1浮动换算
      unitExchangeType: "0", // 	采购单位转换率的换算方式：0固定换算；1浮动换算
      invPriceExchRate: "1", // 	计价换算率
      unit_code: unitCode, // 	主计量编码
      project_code: xmCode,
      _status: "Insert" // 	操作标识, Insert:新增、Update:更新    示例：Insert
    };
    data1.purchaseOrders = chaseOrder;
    body.data = data1;
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "AT15F164F008080007", JSON.stringify(body));
    var apiResJs = JSON.parse(apiResponse);
    var apiCode = apiResJs.code;
    if (apiCode != 200) {
      throw new Error("工序" + request.data.gxCode + "生成失败，原因：【" + apiResJs.message + "】");
    }
    var code = apiResJs.data.code;
    return { code };
  }
}
exports({ entryPoint: MyAPIHandler });