let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var date = "2023-04";
    var DailyInventorySql = "select * from AT17604A341D580008.AT17604A341D580008.batchColumn where tongjiriqi like '" + date + "' and dr =0";
    var DailyInventoryRes = ObjectStore.queryByYonQL(DailyInventorySql, "developplatform");
    if (DailyInventoryRes.length == 0) {
      throw new Error("本月数据查询为空,生成出入库失败");
    }
    var setValues = new Array();
    //每条数据查询过滤出来
    for (var a = 0; a < DailyInventoryRes.length; a++) {
      //猪只类型
      var PigTypes = DailyInventoryRes[a].zhuzhileixing;
      //批次号
      var picihaos = DailyInventoryRes[a].picihao;
      var setSql =
        "select * from AT17604A341D580008.AT17604A341D580008.batchColumn where tongjiriqi like '" +
        date +
        "' and dr =0 and zhuzhileixing = '" +
        PigTypes +
        "' and picihao ='" +
        picihaos +
        "' Order By tongjiriqi DESC limit 1";
      var setRes = ObjectStore.queryByYonQL(setSql, "developplatform");
      if (setRes.length != 0) {
        var setResh = setRes[0];
      } else {
        continue;
      }
      setValues.push(setResh);
    }
    if (setValues.length == 0) {
      throw new Error("本月数据查询为空,生成出入库失败");
    }
    //组装纬度  相同批次号  相同猪只类型
    var newArray = new Array();
    for (var f = 0; f < setValues.length; f++) {
      var e = setValues[f];
      var rq = e.tongjiriqi;
      var a = setValues[f].picihao;
      var B = setValues[f].zhuzhileixing;
      var ab = a + "-" + B;
      var zmap = {
        key: ab,
        date: rq,
        value: e
      };
      newArray.push(zmap);
    }
    //调用方法去重
    unique(newArray);
    for (var i = 0; i < newArray.length; i++) {
      var summary = newArray[i].value;
      //业务日期
      var YwDate = summary.tongjiriqi;
      var DateSql = "select * from AT17604A341D580008.AT17604A341D580008.batchColumn where tongjiriqi = '" + YwDate + "' and dr=0";
      var DateRes = ObjectStore.queryByYonQL(DateSql, "developplatform");
      if (DateRes.length == 0) {
        throw new Error("本天数据查询为空,生成出入库失败");
      }
      let soninTables = [];
      let soninTable = {};
      for (var l = 0; l < DateRes.length; l++) {
        var selDataByDate = DateRes[l];
        //猪只类型
        var PigType = selDataByDate.zhuzhileixing;
        var newPigTpes = getPigType(PigType);
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
        var endingQuantity = selDataByDate.qimocunlan;
        //批次号
        var picihaos = selDataByDate.picihao;
        //查询本月分摊金额
        soninTable = {
          //转入
          product: productCode, //物料，传入id或code
          productsku: productCode, //物料SKU，传入id或code
          batchno: picihaos, //批次号，批次商品必填
          qty: endingQuantity, //数量
          unit: productunit, //主计量单位，传入id或code
          subQty: endingQuantity, //件数
          invExchRate: 1, //库存换算率
          stockUnitId: productunit, //库存单位，传入id或code
          unitExchangeType: 0, //库存换算率换算方式，0固定换算，1浮动换算    示例：1
          isBatchManage: true, //是否批次管理，true:是；false:否    示例：false
          _status: "Insert" //操作标识, Insert:新增、Update:更新
        };
        soninTables.push(soninTable);
      }
      var UUID = uuid();
      var UUIDres = replace(UUID, "-", "");
      //会计主体 组织
      var orgid = summary.org_id;
      //其他入库单
      let inbodys = {
        resubmitCheckKey: UUIDres, //保证请求的幂等性
        org: orgid, //库存组织，传入id或code
        accountOrg: orgid, //会计主体，传入id或code
        vouchdate: YwDate, //单据日期,时间戳
        bustype: "A08001", //交易类型，传入id或code
        warehouse: "000001", //仓库，传入id或code
        _status: "Insert", //操作标识, Insert:新增、Update:更新
        othInRecords: soninTables //其他入库单子表
      };
      var sonInTable = {
        data: inbodys
      };
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
      var url1 = "https://www.example.com/"; //转入
      var url2 = "https://www.example.com/"; //转出
      var returnIn = warehousing(sonInTable, url1);
      var returnOut = warehousing(sonOutTable, url2);
    }
    var JSONValueIn = JSON.parse(returnIn);
    var JSONValueOut = JSON.parse(returnOut);
    return {
      Inwarehouse: JSONValueIn,
      Outwarehouse: JSONValueOut
    };
    //其他出入库单个保存
    function warehousing(body, url) {
      let apiResponse = openLinker("POST", url, "AT17604A341D580008", JSON.stringify(body));
      return apiResponse;
    }
    //猪只类型
    function getPigType(PigType) {
      var newPigTpe = "";
      //匹配类型名称
      if (PigType === "1") {
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
    //去重
    function unique(arr) {
      // 第一层for循环控制第一个数
      for (let i1 = 0; i1 < arr.length; i1++) {
        // 第二层循环控制第二个数
        for (let j1 = i1 + 1; j1 < arr.length; j1++) {
          // 判断前后是否相等
          if (arr[i1].key === arr[j1].key) {
            arr.splice(j1, 1); //j：下标 1：删除个数
            // 后面的往前移一位
            j1--;
          }
        }
      }
      // 第一层for循环控制第一个数
      for (let i2 = 0; i2 < arr.length; i2++) {
        // 第二层循环控制第二个数
        for (let j2 = i2 + 1; j2 < arr.length; j2++) {
          // 判断前后是否相等
          if (arr[i2].date === arr[j2].date) {
            arr.splice(j2, 1); //j：下标 1：删除个数
            // 后面的往前移一位
            j2--;
          }
        }
      }
    }
    return { DailyInventoryRes };
  }
}
exports({ entryPoint: MyAPIHandler });