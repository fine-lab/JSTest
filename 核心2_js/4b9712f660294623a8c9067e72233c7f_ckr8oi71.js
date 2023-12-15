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
      var setTable = new Map();
      var arrayTable = [];
      for (var g = 0; g < AllData.length; g++) {
        var alData = AllData[g];
        var productionRecord = AllData[g].shengchanjilu;
        setTable = { productionRecord, alData };
        arrayTable.push(setTable);
      }
      unique(arrayTable);
    }
    a: for (var e = 0; e < arrayTable.length; e++) {
      //生产记录
      var productionRecord = arrayTable[e].productionRecord;
      //值
      var typeBusiness = arrayTable[e].alData;
      //业务类型
      var typePig = typeBusiness.yewuleixing;
      var inWareSql = "select * from AT17604A341D580008.AT17604A341D580008.batchChangeTable where shengchanjilu = '" + productionRecord + "' and dr=0";
      var inWareRes = ObjectStore.queryByYonQL(inWareSql, "developplatform");
      var zhuanRu = []; //转入  //哺乳母猪
      var zhuanChu = []; //转出  //怀孕母猪
      var puru = []; //哺乳仔猪(省略)
      if (typePig === "3") {
        //判断是否三条   母猪分娩
        if (inWareRes.length != 0 && inWareRes.length === 3) {
          for (var d = 0; d < inWareRes.length; d++) {
            var svalue = inWareRes[d];
            var zzlx = svalue.zhuzhileixing; //猪只类型
            var bdlx = svalue.biandongleixing; //变动类型 1.转入 2.转出
            if (zzlx === "5" && bdlx === "2") {
              //怀孕母猪且转出
              zhuanRu.push(svalue);
            } else if (zzlx === "7" && bdlx === "1") {
              //哺乳仔猪且转入
              puru.push(svalue);
            }
          }
        } else {
          continue;
        }
        if (zhuanRu.length == 0 || puru.length == 0) {
          continue a;
        }
        //转出数据处理
        var data = zhuanRu[0];
        //业务流水码
        var PipeliningCode = data.yewuliushuima;
        //变动类型
        var ywlx = data.biandongleixing;
        //变动头数
        var variableHead = data.biandongtoushu;
        //批次号
        var picihaos = data.picihao;
        //业务日期
        var YwDate = data.yewuriqi;
        //会计主体 组织
        var orgid = data.org_id;
        //猪只类型
        var PigTypes = data.zhuzhileixing;
        var newPigTpes1 = getPigType(PigTypes);
        var returnVal1 = selCode(newPigTpes1);
        var value1 = returnVal1.productRes;
        var productCode1 = value1[0].code;
        var productunit1 = value1[0].unit;
        //转出   怀孕母猪
        let insonTables = {
          groupNumber: "1", //组号，同一个转换，转换前和转换后组号相同
          lineType: "1", //行类型，1表示转换前，2表示转换后，3表示套件，4表示散件
          warehouse: "000001", //仓库id或code
          batchno: picihaos, //批次号，批次商品必填
          product: productCode1, //物料，传入id或code
          productsku: productCode1, //物料SKU，传入id或code
          mainUnitId: productunit1, //主计量id,或者code
          stockUnitId: productunit1, //库存单位id或者编码
          invExchRate: 1, //库存换算率
          proratadistribution: "",
          qty: variableHead, //数量
          subQty: variableHead //件数
        };
        //转入数据处理
        var datasPuru = puru[0];
        var picihaos11 = datasPuru.picihao;
        //变动头数
        var variableHead11 = datasPuru.biandongtoushu;
        //猪只类型
        var PigType = datasPuru.zhuzhileixing;
        var newPigTpesP = getPigType(PigType);
        var returnVal22 = selCode(newPigTpesP);
        var value22 = returnVal22.productRes;
        var productCode22 = value22[0].code;
        var productunit22 = value22[0].unit;
        //转入   哺乳仔猪
        let puRuTables = {
          groupNumber: "1", //组号，同一个转换，转换前和转换后组号相同
          lineType: "2", //行类型，1表示转换前，2表示转换后，3表示套件，4表示散件
          warehouse: "000001", //仓库id或code
          batchno: picihaos11, //批次号，批次商品必填
          product: productCode22, //物料，传入id或code
          productsku: productCode22, //物料SKU，传入id或code
          mainUnitId: productunit22, //主计量id,或者code
          stockUnitId: productunit22, //库存单位id或者编码
          invExchRate: 1, //库存换算率
          proratadistribution: "100",
          qty: variableHead11, //数量
          subQty: variableHead11 //件数
        };
        let sonTabless = [];
        sonTabless.push(insonTables); //怀孕母猪
        sonTabless.push(puRuTables); //哺乳仔猪
        let bodys = {
          org: orgid, //库存组织ID或者code
          businesstypeId: "yourIdHere", //业务类型Id或者code，yourIdHere表示物料转换，A70002表示批次号转换，A70003表示组装，A70004表示拆卸    示例：110000000000030
          conversionType: "1", //转换类型，1表示1对1转换，2表示多对1转换，3表示一对多转换
          mcType: "1", //转换纬度，1表示物料转换，2表示序列号转换，3表示组转，4表示拆卸，请和业务类型保持一致
          vouchdate: YwDate, //单据日期,时间戳
          _status: "Insert", //操作标识, Insert:新增、Update:更新
          bustype: "A08001", //交易类型，传入id或code
          warehouse: "000001", //仓库，传入id或code
          morphologyconversiondetail: sonTabless //其他入库单子表
        };
        let body = {
          data: bodys
        };
        var url = gatewayUrl + "/yonbip/scm/morphologyconversion/save";
        var returnValue = warehousing(body, url);
        var JSONValue = JSON.parse(returnValue);
        var returnCode = JSONValue.code;
        if (returnCode === "200") {
          var dataVals = JSONValue.data;
          var info = dataVals.infos;
          if (info.length != 0) {
            var gid = info[0].id;
            var xtUrl = gatewayUrl + "/yonbip/scm/morphologyconversion/batchaudit"; //https://dbox.diwork.com/iuap-api-gateway
            let conversion = {
              id: gid
            };
            var a = [];
            a.push(conversion);
            let conversionBody = {
              data: a
            };
            let apiResponses = openLinker("POST", xtUrl, "AT17604A341D580008", JSON.stringify(conversionBody));
            var JSONValues = JSON.parse(apiResponses);
            var zhcode = JSONValues.code;
            if (zhcode === "200") {
              continue;
            } else {
              continue;
            }
          } else {
            continue;
          }
        } else {
          throw new Error("错误原因:" + JSONValue.message);
        }
      } else {
        if (inWareRes.length != 0 && inWareRes.length == 2) {
          for (var d = 0; d < inWareRes.length; d++) {
            var svalue = inWareRes[d];
            var bdlx = svalue.biandongleixing; //变动类型 1.转入 2.转出
            if (bdlx === "1") {
              zhuanRu.push(svalue);
            } else if (bdlx === "2") {
              zhuanChu.push(svalue);
            }
          }
        } else {
          continue;
        }
        if (zhuanRu.length == 0 || zhuanChu.length == 0) {
          continue;
        }
        //转入数据处理
        var data = zhuanRu[0];
        //业务流水码
        var PipeliningCode = data.yewuliushuima;
        //变动类型
        var ywlx = data.biandongleixing;
        //变动头数
        var variableHead = data.biandongtoushu;
        //批次号
        var picihaos = data.picihao;
        //业务日期
        var YwDate = data.yewuriqi;
        //会计主体 组织
        var orgid = data.org_id;
        //猪只类型
        var PigType = data.zhuzhileixing;
        var newPigTpes = getPigType(PigType);
        var returnVal1 = selCode(newPigTpes);
        var value1 = returnVal1.productRes;
        var productCode1 = value1[0].code;
        var productunit1 = value1[0].unit;
        //转入
        let insonTables = {
          groupNumber: "1", //组号，同一个转换，转换前和转换后组号相同
          lineType: "2", //行类型，1表示转换前，2表示转换后，3表示套件，4表示散件
          warehouse: "000001", //仓库id或code
          batchno: picihaos, //批次号，批次商品必填
          product: productCode1, //物料，传入id或code
          productsku: productCode1, //物料SKU，传入id或code
          mainUnitId: productunit1, //主计量id,或者code
          stockUnitId: productunit1, //库存单位id或者编码
          invExchRate: 1, //库存换算率
          qty: variableHead, //数量
          subQty: variableHead //件数
        };
        //转入数据处理
        var datas = zhuanChu[0];
        var picihaos1 = datas.picihao;
        //变动头数
        var variableHead1 = datas.biandongtoushu;
        //猪只类型
        var PigType = datas.zhuzhileixing;
        var newPigTpes = getPigType(PigType);
        var returnVal2 = selCode(newPigTpes);
        var value2 = returnVal2.productRes;
        var productCode2 = value2[0].code;
        var productunit2 = value2[0].unit;
        //转出
        let outSonTables = {
          groupNumber: "1", //组号，同一个转换，转换前和转换后组号相同
          lineType: "1", //行类型，1表示转换前，2表示转换后，3表示套件，4表示散件
          warehouse: "000001", //仓库id或code
          batchno: picihaos1, //批次号，批次商品必填
          product: productCode2, //物料，传入id或code
          productsku: productCode2, //物料SKU，传入id或code
          mainUnitId: productunit2, //主计量id,或者code
          stockUnitId: productunit2, //库存单位id或者编码
          invExchRate: 1, //库存换算率
          qty: variableHead1, //数量
          subQty: variableHead1 //件数
        };
        let sonTabless = [];
        sonTabless.push(insonTables);
        sonTabless.push(outSonTables);
        let bodys = {
          org: orgid, //库存组织ID或者code
          businesstypeId: "yourIdHere", //业务类型Id或者code，yourIdHere表示物料转换，A70002表示批次号转换，A70003表示组装，A70004表示拆卸    示例：110000000000030
          conversionType: "1", //转换类型，1表示1对1转换，2表示多对1转换，3表示一对多转换
          mcType: "1", //转换纬度，1表示物料转换，2表示序列号转换，3表示组转，4表示拆卸，请和业务类型保持一致
          vouchdate: YwDate, //单据日期,时间戳
          _status: "Insert", //操作标识, Insert:新增、Update:更新
          bustype: "A08001", //交易类型，传入id或code
          warehouse: "000001", //仓库，传入id或code
          morphologyconversiondetail: sonTabless //其他入库单子表
        };
        let body = {
          data: bodys
        };
        var url = gatewayUrl + "/yonbip/scm/morphologyconversion/save";
        var returnValue = warehousing(body, url);
        var JSONValue = JSON.parse(returnValue);
        var returnCode = JSONValue.code;
        if (returnCode === "200") {
          var dataVals = JSONValue.data;
          var info = dataVals.infos;
          if (info.length != 0) {
            var gid = info[0].id;
            var xtUrl = gatewayUrl + "/yonbip/scm/morphologyconversion/batchaudit";
            let conversion = {
              id: gid
            };
            var a = [];
            a.push(conversion);
            let conversionBody = {
              data: a
            };
            let apiResponses = openLinker("POST", xtUrl, "AT17604A341D580008", JSON.stringify(conversionBody));
            var JSONValues = JSON.parse(apiResponses);
            var zhcode = JSONValues.code;
            if (zhcode === "200") {
              continue;
            } else {
              continue;
            }
          } else {
            continue;
          }
        } else {
          throw new Error("错误原因:" + JSONValue.message);
        }
      }
    }
    //数据库编码
    function selCode(value) {
      var productSql = "select * from pc.product.Product where name = '" + value + "'";
      var productRes = ObjectStore.queryByYonQL(productSql, "productcenter");
      if (productRes.length != 0) {
        return { productRes };
      } else {
        throw new Error("【形态转换】猪只类型该物料不存在,需要维护");
      }
    }
    //形态转换单个保存
    function warehousing(body, url) {
      let apiResponse = openLinker("POST", url, "AT17604A341D580008", JSON.stringify(body));
      return apiResponse;
    }
    function unique(arr) {
      // 第一层for循环控制第一个数
      for (let i1 = 0; i1 < arr.length; i1++) {
        // 第二层循环控制第二个数
        for (let j1 = i1 + 1; j1 < arr.length; j1++) {
          // 判断前后是否相等
          if (arr[i1].productionRecord === arr[j1].productionRecord) {
            arr.splice(j1, 1); //j：下标 1：删除个数
            // 后面的往前移一位
            j1--;
          }
        }
      }
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
  }
}
exports({ entryPoint: MyTrigger });