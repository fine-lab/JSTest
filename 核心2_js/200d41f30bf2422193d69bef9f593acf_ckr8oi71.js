let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var data = request.data;
    if (data.length != 0) {
      for (var i = 0; i < data.length; i++) {
        //主表id
        var mainId = data[i].id;
        //业务流水码
        var PipeliningCode = data[i].yewuliushuima;
        //查询数据库
        var aSql = "select * from AT17604A341D580008.AT17604A341D580008.batchChangeTable where id = '" + mainId + "' and dr = 0";
        var aRes = ObjectStore.queryByYonQL(aSql, "developplatform");
        if (aRes.length != 0) {
          var setValue = aRes[0];
        } else {
          continue;
        }
        var UUID = uuid();
        var UUIDres = replace(UUID, "-", "");
        //变动类型
        var ywlx = setValue.biandongleixing;
        //变动头数
        var variableHead = setValue.biandongtoushu;
        //批次号
        var picihaos = setValue.picihao;
        //业务日期
        var YwDate = setValue.yewuriqi;
        //会计主体 组织
        var orgid = setValue.org_id;
        //猪只类型
        var PigType = setValue.zhuzhileixing;
        var newPigTpes = getPigType(PigType);
        var productSql = "select * from pc.product.Product where name = '" + newPigTpes + "'";
        var productRes = ObjectStore.queryByYonQL(productSql, "productcenter");
        if (productRes.length != 0) {
          var productCode = productRes[0].code;
          var productunit = productRes[0].unit;
        } else {
          throw new Error("猪只类型该物料不存在,需要维护");
        }
        let sonTables = {};
        if (ywlx === "1") {
          //转入
          sonTables = {
            groupNumber: "1", //组号，同一个转换，转换前和转换后组号相同
            lineType: "2", //行类型，1表示转换前，2表示转换后，3表示套件，4表示散件
            warehouse: "000001", //仓库id或code
            batchno: picihaos, //批次号，批次商品必填
            product: productCode, //物料，传入id或code
            productsku: productCode, //物料SKU，传入id或code
            mainUnitId: productunit, //主计量id,或者code
            stockUnitId: productunit, //库存单位id或者编码
            invExchRate: 1, //库存换算率
            qty: variableHead, //数量
            subQty: variableHead //件数
          };
        } else if (ywlx === "2") {
          //转出
          sonTables = {
            //转入
            groupNumber: "1", //组号，同一个转换，转换前和转换后组号相同
            lineType: "1", //行类型，1表示转换前，2表示转换后，3表示套件，4表示散件
            warehouse: "000001", //仓库id或code
            batchno: picihaos, //批次号，批次商品必填
            product: productCode, //物料，传入id或code
            productsku: productCode, //物料SKU，传入id或code
            mainUnitId: productunit, //主计量id,或者code
            stockUnitId: productunit, //库存单位id或者编码
            invExchRate: 1, //库存换算率
            qty: variableHead, //数量
            subQty: variableHead //件数
          };
        }
        let bodys = {
          org: orgid, //库存组织ID或者code
          businesstypeId: "yourIdHere", //业务类型Id或者code，yourIdHere表示物料转换，A70002表示批次号转换，A70003表示组装，A70004表示拆卸    示例：110000000000030
          conversionType: "1", //转换类型，1表示1对1转换，2表示多对1转换，3表示一对多转换
          mcType: "1", //转换纬度，1表示物料转换，2表示序列号转换，3表示组转，4表示拆卸，请和业务类型保持一致
          vouchdate: YwDate, //单据日期,时间戳
          _status: "Insert", //操作标识, Insert:新增、Update:更新
          bustype: "A08001", //交易类型，传入id或code
          warehouse: "000001", //仓库，传入id或code
          morphologyconversiondetail: sonTables //其他入库单子表
        };
        let body = {
          data: bodys
        };
        var url = "https://www.example.com/";
        var returnValue = warehousing(body, url);
        var JSONValue = JSON.parse(returnValue);
        var returnCode = JSONValue.code;
        if (returnCode === "200") {
          continue;
        } else {
          throw new Error("错误原因:" + JSONValue.message);
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
    return { returnCode };
  }
}
exports({ entryPoint: MyAPIHandler });