let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var currentUser = JSON.parse(AppContext()).currentUser; //通过上下文获取当前的用户信息
    let tenantIds = currentUser.tenantId; //获取企业信息id(租户id)
    let param1 = { tenantId: tenantIds };
    let getYmUrl = extrequire("AT17604A341D580008.hd03.getUrl");
    let ymUrl = getYmUrl.execute(param1);
    var gatewayUrl = ymUrl.domainName.gatewayUrl;
    var AllData = param.key != undefined ? param.key : null;
    if (AllData != null) {
      a: for (var g = 0; g < AllData.length; g++) {
        var alData = AllData[g];
        var ywlx = alData.yewuleixing;
        //猪只类型
        var PigType = alData.zhuzhileixing;
        //业务日期
        var YwDate = alData.yewuriqi;
        let soninTables = [];
        var PigTypes = PigType + "";
        var newPigTpes = getPigType(PigTypes);
        var productSql = "select * from pc.product.Product where name = '" + newPigTpes + "'";
        var productRes = ObjectStore.queryByYonQL(productSql, "productcenter");
        if (productRes.length != 0) {
          //猪物料编码
          var productCode = productRes[0].code;
          //猪物料单位
          var productunit = productRes[0].unit;
        } else {
          throw new Error("猪只类型该物料不存在,需要维护");
        }
        //期末存栏(件数数量)
        var endingQuantity = alData.biandongtoushu;
        //批次号
        var picihaos = alData.picihao;
        var UUID = uuid();
        var UUIDres = replace(UUID, "-", "");
        //会计主体 组织
        var orgid = alData.org_id;
        if (ywlx != "3" && ywlx != "6" && ywlx != "9" && ywlx != "12" && ywlx != "15" && ywlx != "17" && ywlx != "7" && ywlx != "13" && ywlx != "19") {
          continue;
        }
        if (ywlx == "3" && PigType == "6") {
          var scjl = alData.shengchanjilu; //生产记录
          var inWareSql = "select * from AT17604A341D580008.AT17604A341D580008.batchChangeTable where shengchanjilu = '" + scjl + "' and dr=0";
          var inWareRes = ObjectStore.queryByYonQL(inWareSql, "developplatform");
          if (inWareRes.length === 0 || inWareRes.length != 3) {
            continue a;
          }
          let soninTable = {
            //转入
            product: productCode, //物料，传入id或code
            productsku: productCode, //物料SKU，传入id或code
            batchno: picihaos, //批次号，批次商品必填
            qty: endingQuantity, //数量
            unit: productunit, //主计量单位，传入id或code
            subQty: endingQuantity, //件数
            invExchRate: 1, //库存换算率
            stockUnitId: productunit, //库存单位，传入id或code
            natMoney: 0, //金额
            natUnitPrice: 0, //单价
            unitExchangeType: 0, //库存换算率换算方式，0固定换算，1浮动换算    示例：1
            isBatchManage: true, //是否批次管理，true:是；false:否    示例：false
            _status: "Insert", //操作标识, Insert:新增、Update:更新
            autoCalcCost: false
          };
          soninTables.push(soninTable);
          //其他入库单
          let outbodys = {
            resubmitCheckKey: UUIDres, //保证请求的幂等性
            org: orgid, //库存组织，传入id或code
            accountOrg: orgid, //会计主体，传入id或code
            vouchdate: YwDate, //单据日期,时间戳
            bustype: "A08001", //交易类型，传入id或code
            warehouse: "000001", //仓库，传入id或code
            _status: "Insert", //操作标识, Insert:新增、Update:更新
            othInRecords: soninTables //其他出库单子表
          };
          var sonOutTable = {
            data: outbodys
          };
          var url = gatewayUrl + "/yonbip/scm/othinrecord/single/save"; //入库单 https://dbox.diwork.com/iuap-api-gateway
          var returnOut = warehousing(sonOutTable, url);
        } else if (ywlx === "6" || ywlx === "9" || ywlx === "12" || ywlx === "15" || ywlx === "17") {
          let soninTable = {
            //转入
            product: productCode, //物料，传入id或code
            productsku: productCode, //物料SKU，传入id或code
            batchno: picihaos, //批次号，批次商品必填
            qty: endingQuantity, //数量
            unit: productunit, //主计量单位，传入id或code
            subQty: endingQuantity, //件数
            invExchRate: 1, //库存换算率
            stockUnitId: productunit, //库存单位，传入id或code
            natMoney: 0, //金额
            unitExchangeType: 0, //库存换算率换算方式，0固定换算，1浮动换算    示例：1
            isBatchManage: true, //是否批次管理，true:是；false:否    示例：false
            _status: "Insert", //操作标识, Insert:新增、Update:更新
            autoCalcCost: false
          };
          soninTables.push(soninTable);
          //其他出库单
          let outbodys = {
            resubmitCheckKey: UUIDres, //保证请求的幂等性
            org: orgid, //库存组织，传入id或code
            accountOrg: orgid, //会计主体，传入id或code
            vouchdate: YwDate, //单据日期,时间戳
            bustype: "A10001", //交易类型，传入id或code
            warehouse: "000001", //仓库，传入id或code
            _status: "Insert", //操作标识, Insert:新增、Update:更新
            othOutRecords: soninTables //其他出库单子表
          };
          var sonOutTable = {
            data: outbodys
          };
          var url2 = gatewayUrl + "/yonbip/scm/othoutrecord/single/save"; //转出
          var returnOut = warehousing(sonOutTable, url2);
        } else if (ywlx === "7" || ywlx === "13" || ywlx === "19") {
          let soninTable = {
            //转入
            product: productCode, //物料，传入id或code
            productsku: productCode, //物料SKU，传入id或code
            batchno: picihaos, //批次号，批次商品必填
            qty: endingQuantity, //数量
            unit: productunit, //主计量单位，传入id或code
            subQty: endingQuantity, //件数
            invExchRate: 1, //库存换算率
            stockUnitId: productunit, //库存单位，传入id或code
            natMoney: 0, //金额
            natUnitPrice: 0, //单价
            unitExchangeType: 0, //库存换算率换算方式，0固定换算，1浮动换算    示例：1
            isBatchManage: true, //是否批次管理，true:是；false:否    示例：false
            _status: "Insert", //操作标识, Insert:新增、Update:更新
            autoCalcCost: false
          };
          soninTables.push(soninTable);
          //其他入库单
          let outbodys = {
            resubmitCheckKey: UUIDres, //保证请求的幂等性
            org: orgid, //库存组织，传入id或code
            accountOrg: orgid, //会计主体，传入id或code
            vouchdate: YwDate, //单据日期,时间戳
            bustype: "A08001", //交易类型，传入id或code
            warehouse: "000001", //仓库，传入id或code
            _status: "Insert", //操作标识, Insert:新增、Update:更新
            othInRecords: soninTables //其他出库单子表
          };
          var sonOutTable = {
            data: outbodys
          };
          var url = gatewayUrl + "/yonbip/scm/othinrecord/single/save"; //入库单  https://dbox.diwork.com/iuap-api-gateway
          var returnOut = warehousing(sonOutTable, url);
        } else {
          continue a;
        }
      }
    }
    //其他出入库单个保存
    function warehousing(body, url) {
      let apiResponse = openLinker("POST", url, "AT17604A341D580008", JSON.stringify(body));
      return apiResponse;
    }
    //猪只类型
    function getPigType(PigType) {
      var newPigTpe = "";
      //匹配类型名称
      if (PigType == "1") {
        newPigTpe = "后备公猪";
      } else if (PigType === "2") {
        newPigTpe = "后备母猪";
      } else if (PigType === "3") {
        newPigTpe = "种公猪";
      } else if (PigType === "4") {
        newPigTpe = "待配母猪";
      } else if (PigType === "5") {
        newPigTpe = "怀孕母猪";
      } else if (PigType === "6") {
        newPigTpe = "哺乳母猪";
      } else if (PigType === "7") {
        newPigTpe = "哺乳仔猪";
      } else if (PigType === "8") {
        newPigTpe = "保育猪";
      } else if (PigType === "9") {
        newPigTpe = "育肥猪";
      }
      return newPigTpe;
    }
  }
}
exports({ entryPoint: MyTrigger });