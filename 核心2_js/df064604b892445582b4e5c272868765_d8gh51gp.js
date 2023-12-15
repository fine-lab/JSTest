let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var idnumber = param.data[0].id;
    //查询主表
    var sqzhu = "select * from AT15F164F008080007.AT15F164F008080007.ApplicantEntity where id = '" + idnumber + "'";
    var valuesw = ObjectStore.queryByYonQL(sqzhu, "developplatform");
    if (valuesw.length == "0") {
      throw new Error("查询主表数据为空");
    }
    var values = valuesw[0];
    //自动编码推送到采购单单号
    var getZcodes = values.code;
    //请购部门
    var bumendept = values.qinggoubumen;
    //请购人
    var goupeo = values.qinggouren;
    //交易类型id
    var transaction = values.bustype;
    //查询交易类型编码
    var sqlTransNew = "select * from bd.bill.TransType where id = '" + transaction + "'";
    var transactionSql = ObjectStore.queryByYonQL(sqlTransNew, "transtype");
    if (transactionSql.length != "0") {
      var transactionCodes = transactionSql[0].code;
    } else {
      throw new Error("交易类型编码查询为空");
    }
    var getdates = values.danjuriqi;
    var id = values.id;
    var orgid = values.org_id;
    //查询申请请购单子表
    var sqlone = "select * from AT15F164F008080007.AT15F164F008080007.ApplicationEntitySubForm where ApplicantEntity_id ='" + id + "' and dr=0 ";
    var subtableone = ObjectStore.queryByYonQL(sqlone, "developplatform");
    if (subtableone.length == "0") {
      throw new Error(" -- 编码为" + getZcodes + "的申请请购单子表查询数据为空 -- ");
    }
    //查询组织code
    var sqltwo = "select code from org.func.PurchaseOrg where id = '" + orgid + "'";
    var purchasetable = ObjectStore.queryByYonQL(sqltwo, "orgcenter");
    if (purchasetable.length != "0") {
      var codes = purchasetable[0].code;
    } else {
      throw new Error(" -- 编码为" + getZcodes + "查询组织编码为空");
    }
    var applyOrders = new Array();
    var body = "";
    for (var i = 0; i < subtableone.length; i++) {
      //子表中的值
      var SubtableResult = subtableone[i];
      //需求日期
      var xuqiuDate = SubtableResult.ziduan23;
      //物料编码
      var wuliaonumber = SubtableResult.wuliaobianma;
      var sqlfive = "select * from 	pc.product.Product where id = '" + wuliaonumber + "'";
      var materialtables = ObjectStore.queryByYonQL(sqlfive, "productcenter");
      if (materialtables.length != "0") {
        var materialtableCodes = materialtables[0].code;
      } else {
        throw new Error("查询物料编码为空");
      }
      var brandName = null;
      //查询品牌名称
      if (materialtables[0].brand != null) {
        var querybrand = "select name from 	pc.brand.Brand where id = '" + materialtables[0].brand + "'";
        var brandRes = ObjectStore.queryByYonQL(querybrand, "productcenter");
        if (brandRes.length == 0) {
          throw new Error("查询物料编码【" + materialtables[0].code + "】对应品牌信息为空！");
        }
        brandName = brandRes[0].name;
      }
      //主计量编码
      var zhujiliang = SubtableResult.masterUnit;
      //采购单位
      //查询数据库计量单位编码
      var sqlfour = "select * from pc.unit.Unit where id = '" + zhujiliang + "'";
      var Companytables = ObjectStore.queryByYonQL(sqlfour, "productcenter");
      if (Companytables.length != "0") {
        var CompanytableCode = Companytables[0].code;
      } else {
        throw new Error("查询计量单位编码为空");
      }
      //数量
      var shul = SubtableResult.shuliang;
      //收货人
      var shouhuoren = SubtableResult.shouhuoren;
      //收货人电话
      var shouhuorendianhua = SubtableResult.shouhuorendianhua;
      //收货人地址
      var shouhuodizhi = SubtableResult.shouhuodizhi;
      //无税单价
      var wushuidanjia = SubtableResult.wushuidanjia;
      //税率
      var shuilvs = SubtableResult.shuilv;
      var sqlshuil = "select * from bd.taxrate.TaxRateVO where id = '" + shuilvs + "'";
      var shuilvsAll = ObjectStore.queryByYonQL(sqlshuil, "ucfbasedoc");
      if (shuilvsAll.length != "0") {
        var shuilvsAllCodes = shuilvsAll[0].ntaxRate;
      } else {
        throw new Error("查税率编码为空");
      }
      //含税单价
      var hanshuidanjia = SubtableResult.hanshuidanjia;
      //含税金额
      var hanshuijine = SubtableResult.hanshuijine;
      //无税金额
      var wushuijine = SubtableResult.wushuijine;
      //技术要求
      var jishuyaoqiu = SubtableResult.jishuyaoqiu;
      //品牌货号
      var pinpaihuohao = SubtableResult.pinpaihuohao;
      //预放位置
      var ziduan26 = SubtableResult.ziduan26;
      //到货日期
      var qiwangdaohuo = SubtableResult.qiwangdaohuo;
      //是否定制
      var shifudingzhi = SubtableResult.shifudingzhi;
      //税额
      var shuie = SubtableResult.shuie;
      //仓库id
      var warehouseid = SubtableResult.cangku;
      //供应商联系电话
      var lianxifangshis = SubtableResult.lianxifangshi;
      var uuids = uuid();
      var getuuids = replace(uuids, "-", "");
      var s1 = {
        "bodyFreeItem!define8": brandName, //物料品牌
        "bodyFreeItem!define7": lianxifangshis, //建议品牌供应商联系方式
        agentId_name: shouhuoren,
        warehouseId: warehouseid,
        receiveOrg: orgid,
        product_cCode: materialtableCodes, //物料编码
        subQty: shul, //采购数量    示例：11
        purUOM_Code: CompanytableCode, //采购单位编码
        unit_code: CompanytableCode, //主计量编码
        priceUOM_Code: CompanytableCode, //计价单位编码
        qty: shul, //数量
        requirementDate: xuqiuDate, //需求日期
        purchaseOrg_code: codes, //采购组织编码
        invPriceExchRate: "1", //计价换算率
        priceQty: shul, //计价数量
        invExchRate: "1", //采购换算率
        oriUnitPrice: wushuidanjia, //无税单价
        taxRate: shuilvsAllCodes, //税率
        oriTaxUnitPrice: hanshuidanjia, //含税单价
        oriSum: hanshuijine, //含税金额
        oriMoney: wushuijine, //无税金额
        oriTax: shuie, //税额
        receiver: shouhuoren, //收货人
        receiveTelePhone: shouhuorendianhua, //收货人电话
        receiveAddress: shouhuodizhi, //收货人地址
        "bodyFreeItem!define2": jishuyaoqiu, //技术要求
        "bodyFreeItem!define3": pinpaihuohao, //品牌货号
        "bodyFreeItem!define4": ziduan26, //预放位置
        "bodyFreeItem!define5": qiwangdaohuo, //到货日期
        "bodyFreeItem!define6": shifudingzhi, //是否定制
        _status: "Insert" //操作标识, Insert:新增、Update:更新
      };
      applyOrders.push(s1);
    }
    //调用请购单个保存
    var data = {
      warehouseId: warehouseid, //仓库
      purchaseOrg: orgid, //组织
      receiveOrg: orgid,
      "headFreeItem!define2": goupeo, //请购人
      "headFreeItem!define3": bumendept, //请购部门
      "headFreeItem!define1": getZcodes, //申请单号
      "headFreeItem!define4": values.projectVO, //请购项目名称
      "headFreeItem!define5": values.projectVO, //请购项目编码
      resubmitCheckKey: getuuids, //保证请求的幂等性
      bustype: transactionCodes, //交易类型code或交易类型id     transactionCodes
      org_code: codes, //需求组织编码
      vouchdate: getdates, //单据日期
      operator: goupeo, //请购人id或请购人name    示例：460502202102260001 / wjl001
      memo: values.beizhu, //备注
      //请购单子表
      applyOrders,
      _status: "Insert"
    };
    body = {
      data: data
    };
    let func = extrequire("AT15F164F008080007.utils.getWayUrl");
    let funcres = func.execute(null);
    var gatewayUrl = funcres.gatewayUrl;
    let url = gatewayUrl + "/yonbip/scm/applyorder/singleSave_v1";
    let apiResponse = openLinker("POST", url, "AT15F164F008080007", JSON.stringify(body));
    var clAll = JSON.parse(apiResponse);
    var codess = clAll.code != undefined ? clAll.code : undefined;
    var message = clAll.message != undefined ? clAll.message : "";
    if (codess == "200") {
      var upid = clAll.data.id;
      var datas = new Array();
      let bodytwo = {
        id: upid
      };
      datas.push(bodytwo);
      var bresult = {
        data: datas
      };
      let toexamineurl = gatewayUrl + "/yonbip/scm/applyorder/batchaudit";
      let apiyy = openLinker("POST", toexamineurl, "AT15F164F008080007", JSON.stringify(bresult));
    } else {
      throw new Error("推送失败出现异常!," + message);
    }
    return { clAll };
  }
}
exports({ entryPoint: MyTrigger });