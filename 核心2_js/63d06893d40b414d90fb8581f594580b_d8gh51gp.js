let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var Materialcode = request.BOM["BOM编码*"] + "";
    Materialcode = Materialcode.replace(/[, ]/g, "");
    var importGroupName = request.BOM["导入小组*"] + "";
    importGroupName = importGroupName.replace(/[, ]/g, "");
    var sampleCode = request.BOM["样本编号*"] + "";
    sampleCode = sampleCode.replace(/[, ]/g, "");
    //表头  当前月日期 会计期间日期
    var strdates = request.BOM.strdates;
    //主表查询前一月的日期
    var strdateSql = request.BOM.strdateSql;
    //查询收样单
    var sampleSql = "select * from AT15F164F008080007.AT15F164F008080007.recDetils1 where yangbenbianhao='" + sampleCode + "'";
    var sampleRes = ObjectStore.queryByYonQL(sampleSql, "developplatform");
    if (sampleRes.length == 0) {
      throw new Error("收样单【" + sampleCode + "】没有这条数据");
    }
    var insStyle = sampleRes[0].inspectionStyle;
    if (insStyle == "02") {
      throw new Error("这个【" + sampleCode + "】是委外不能导入");
    }
    var strdate = sampleRes[0].shouyangriqi;
    //查询检测订单是否有样本编码的数据 如果有业务日期用业务日期查询当前月的
    var testingSql = "select * from AT15F164F008080007.AT15F164F008080007.DetectOrder where sampleCode='" + sampleCode + "' and importData='" + strdates + "'";
    var testingRes = ObjectStore.queryByYonQL(testingSql, "developplatform");
    if (testingRes.length != 0) {
      // 导入子表;
      //判断是什么类型。只有自检才能导入
      var insType = testingRes[0].InspectionForm;
      if (insType == "02") {
        throw new Error("【" + sampleCode + "委外单据不能进行导入】");
      }
      //只有是检测中的时候才可导入
      var checkType = testingRes[0].checkStatus;
      if (checkType != "10") {
        throw new Error("【" + sampleCode + ",表头不是检测中，不能导入】");
      }
      //已经生成报告的不能在导入
      var GenerateType = testingRes[0].Generate;
      if (GenerateType != "false") {
        throw new Error("【" + sampleCode + ",已经生成报告的不能在导入，不能导入】");
      }
      //查询自定义档案维护
      var importGroupSql = "select * from bd.basedocdef.CustomerDocVO where name='" + importGroupName + "'";
      var importGroupRes = ObjectStore.queryByYonQL(importGroupSql, "ucfbasedoc");
      if (importGroupRes.length == 0) {
        throw new Error("没有" + importGroupName + "小组");
      }
      //导入小组名称，id
      var groupName = importGroupRes[0].name;
      var groupId = importGroupRes[0].id;
      //查询BOM物料清单维护
      var Materialsql = "select * from AT15F164F008080007.AT15F164F008080007.BillOfMaterial where bombianma='" + Materialcode + "'";
      var materialsqlResponse = ObjectStore.queryByYonQL(Materialsql, "developplatform");
      if (materialsqlResponse.length == 0) {
        throw new Error("没有这个【" + Materialcode + "】BOM的数据");
      }
      var bomEquipmentStatus = materialsqlResponse[0].equipmentStatus;
      if (bomEquipmentStatus != "1") {
        throw new Error("这个【" + Materialcode + "】BOM,是未启用状态。");
      }
      //委外增加金额
      var bomAmountExcludingTax = "";
      var bomAmountIncludingTax = "";
      var bomTaxAmount = "";
      var bomSupplier = "";
      var gxwwf = 0.0;
      var isgxwwf = testingRes[0].hasOwnProperty("gongxuweiwaifei");
      if (isgxwwf == true) {
        gxwwf = Number(testingRes[0].gongxuweiwaifei);
      }
      var bominspectType = materialsqlResponse[0].inspectType;
      if (bominspectType == "02") {
        bomAmountExcludingTax = materialsqlResponse[0].wushuijine; //无税金额
        gxwwf = Number(gxwwf + materialsqlResponse[0].wushuijine).toFixed(2);
        bomAmountIncludingTax = materialsqlResponse[0].hanshuijine; //含税金额
        bomTaxAmount = materialsqlResponse[0].shuilv; //税率
        bomSupplier = materialsqlResponse[0].gongyingshang; //供应商
      }
      var bomid = materialsqlResponse[0].id;
      var bomcode = materialsqlResponse[0].bombianma;
      var bomName = materialsqlResponse[0].bommingchen;
      var bomType = materialsqlResponse[0].inspectType;
      //查询工序BOM维护子表
      var billOfMaterial = materialsqlResponse[0].id;
      var workingzbsql = "select * from AT15F164F008080007.AT15F164F008080007.processBOMSon where billOfMaterial='" + billOfMaterial + "'";
      var workingzbsqlResponse = ObjectStore.queryByYonQL(workingzbsql, "developplatform");
      if (workingzbsqlResponse.length == 0) {
        throw new Error("这个" + Materialcode + "BOM还没有工序");
      }
      //查询工序BOM维护主表
      var workingZhubId = workingzbsqlResponse[0].processBOM_id;
      var workingsql = "select * from AT15F164F008080007.AT15F164F008080007.processBOM where id='" + workingZhubId + "'";
      var workingsqlResponse = ObjectStore.queryByYonQL(workingsql, "developplatform");
      if (workingsqlResponse.length == 0) {
        throw new Error("这个" + Materialcode + "BOM还没有工序");
      }
      var workEquipmentStatus = workingsqlResponse[0].equipmentStatus;
      if (workEquipmentStatus != "1") {
        throw new Error("这个【" + Materialcode + "】BOM工序,是未启用状态。");
      }
      var workingId = workingZhubId;
      var workingCode = workingsqlResponse[0].gongxubianma;
      var workingName = workingsqlResponse[0].gongxumingchen;
      //查询BOM导入子表
      var bomImportsql = "select * from AT15F164F008080007.AT15F164F008080007.BOMImport where billOfMaterial='" + bomid + "'";
      var bomImportRes = ObjectStore.queryByYonQL(bomImportsql, "developplatform");
      //插入实体
      var insertBomSql = {
        id: testingRes[0].id,
        gongxuweiwaifei: gxwwf,
        BOMImportList: [
          {
            ImportTeam: groupId,
            ImportTeam_name: groupName,
            billOfMaterial: bomid,
            billOfMaterial_bombianma: bomcode,
            billOfMaterial_bommingchen: bomName,
            bomType: bomType,
            processBOM: workingId,
            processBOM_gongxubianma: workingCode,
            processBOM_gongxumingchen: workingName,
            EntryPeriod: strdates,
            gongyingshang: bomSupplier, // 供应商
            hanshuijine: bomAmountIncludingTax, //含税金额
            wushuijine: bomAmountExcludingTax, //无税金额
            shuie: bomTaxAmount, //税率
            _status: "Insert"
          }
        ]
      };
      var insertBomRes = ObjectStore.updateById("AT15F164F008080007.AT15F164F008080007.DetectOrder", insertBomSql, "71a4dca4");
      return { insertBomRes };
    } else {
      // 新增
      //当前月没有，查询检测订单前一月有没有。   checkStatus
      var fronttestingSql = "select * from AT15F164F008080007.AT15F164F008080007.DetectOrder where sampleCode='" + sampleCode + "' and importData='" + strdateSql + "'";
      var fronttestingRes = ObjectStore.queryByYonQL(fronttestingSql, "developplatform");
      if (fronttestingRes.length != 0) {
        //只有是检测中的时候才可导入  已完成只是上个月的完成，这个月还生成新的检测订单。
        var frontcheckType = fronttestingRes[0].checkStatus;
        if (frontcheckType != "10" && frontcheckType != "20") {
          throw new Error("【" + sampleCode + "】,收样编码检测订单，不是检测中/已完成，不能导入");
        }
        //已经生成报告的不能在导入
        var frontGenerateType = fronttestingRes[0].Generate;
        if (frontGenerateType != "false") {
          throw new Error("【" + sampleCode + ",已经生成报告的不能在导入，不能导入】");
        }
      }
      //获取收单单的检测状态
      var checkStatusType = sampleRes[0].checkStatus;
      if (checkStatusType != "05") {
        throw new Error("这条【" + sampleCode + "】收样单的检测单状态不是【启动检测】,不能导入到【检测订单】");
      }
      var sampleVorgId = sampleRes[0].vorgId; //收样组织id
      var sampleId = sampleRes[0].id; //收样主键id
      var sampleCodes = sampleRes[0].code; //收样单据编码
      var sampleMet = sampleRes[0].adminOrgVO; //收样单据部门
      //插入实体 主表
      var insertBomSql = {
        Upstreamcoding: sampleCodes,
        Upstreamid: sampleId,
        organizationId: sampleVorgId,
        department: sampleMet,
        sampleCode: sampleRes[0].yangbenbianhao,
        testItemCode: sampleRes[0].insItems,
        InspectionForm: sampleRes[0].inspectionStyle,
        SubmittingUnit: sampleRes[0].songjiandanwei,
        section: sampleRes[0].songjiankeshi, //科室
        PatientName: sampleRes[0].xingming,
        SampleUnitType: sampleRes[0].shouyangdanleixing,
        IDNumber: sampleRes[0].idCard,
        SampleReceiver: sampleRes[0].staffNew,
        Generate: "false", //Generate  是否生成报告
        importData: strdates,
        syData: strdate,
        jiesuandanwei: sampleRes[0].merchant, //结算单位
        taxRateVO: sampleRes[0].taxRate, //税目税率
        jcprojecthanshuidanjia: sampleRes[0].qujiabiaohanshuijine, //检测项目含税单价
        jcprojectwushuidanjia: sampleRes[0].qujiabiaowushuijine, //检测项目无税单价
        jcprojectshuie: sampleRes[0].qujiabiaoshuie, //检测项目税额
        chanpinxian: sampleRes[0].chanpinxian, //产品线
        checkStatus: "10"
      };
      var insertBomRes = ObjectStore.insert("AT15F164F008080007.AT15F164F008080007.DetectOrder", insertBomSql, "71a4dca4");
      //回写收样单的状态
      var updateIsce = { id: sampleId, checkStatus: "10" }; //检测中
      var updateIsceResz = ObjectStore.updateById("AT15F164F008080007.AT15F164F008080007.recDetils1", updateIsce, "63fb1ae5");
      //查询自定义档案维护
      var importGroupSql = "select * from bd.basedocdef.CustomerDocVO where name='" + importGroupName + "'";
      var importGroupRes = ObjectStore.queryByYonQL(importGroupSql, "ucfbasedoc");
      if (importGroupRes.length == 0) {
        throw new Error("没有" + importGroupName + "小组");
      }
      //导入小组名称，id
      var groupName = importGroupRes[0].name;
      var groupId = importGroupRes[0].id;
      //查询BOM物料清单维护
      var Materialsql = "select * from AT15F164F008080007.AT15F164F008080007.BillOfMaterial where bombianma='" + Materialcode + "'";
      var materialsqlResponse = ObjectStore.queryByYonQL(Materialsql, "developplatform");
      if (materialsqlResponse.length == 0) {
        throw new Error("没有这个【" + Materialcode + "】BOM的数据");
      }
      //未启用不能被导入，是委外也不能导入
      var bomEquipmentStatus = materialsqlResponse[0].equipmentStatus;
      if (bomEquipmentStatus != "1") {
        throw new Error("这个【" + Materialcode + "】BOM,是未启用状态。");
      }
      //委外增加金额
      var bomAmountExcludingTax = "";
      var bomAmountIncludingTax = "";
      var bomTaxAmount = "";
      var bomSupplier = "";
      var gongxuwwf = 0.0;
      var bominspectType = materialsqlResponse[0].inspectType;
      if (bominspectType == "02") {
        bomAmountExcludingTax = materialsqlResponse[0].wushuijine; //无税金额
        gongxuwwf = bomAmountExcludingTax.toFixed(2);
        bomAmountIncludingTax = materialsqlResponse[0].hanshuijine; //含税金额
        bomTaxAmount = materialsqlResponse[0].shuilv; //税率
        bomSupplier = materialsqlResponse[0].gongyingshang; //供应商
      }
      var bomid = materialsqlResponse[0].id;
      var bomcode = materialsqlResponse[0].bombianma;
      var bomName = materialsqlResponse[0].bommingchen;
      var bomType = materialsqlResponse[0].inspectType;
      //查询工序BOM维护子表
      var billOfMaterial = materialsqlResponse[0].id;
      var workingzbsql = "select * from AT15F164F008080007.AT15F164F008080007.processBOMSon where billOfMaterial='" + billOfMaterial + "'";
      var workingzbsqlResponse = ObjectStore.queryByYonQL(workingzbsql, "developplatform");
      if (workingzbsqlResponse.length == 0) {
        throw new Error("这个" + Materialcode + "BOM还没有工序");
      }
      //查询工序BOM维护主表
      var workingZhubId = workingzbsqlResponse[0].processBOM_id;
      var workingsql = "select * from AT15F164F008080007.AT15F164F008080007.processBOM where id='" + workingZhubId + "'";
      var workingsqlResponse = ObjectStore.queryByYonQL(workingsql, "developplatform");
      if (workingsqlResponse.length == 0) {
        throw new Error("这个" + Materialcode + "BOM还没有工序");
      }
      var workEquipmentStatus = workingsqlResponse[0].equipmentStatus;
      if (workEquipmentStatus != "1") {
        throw new Error("这个【" + Materialcode + "】BOM工序,是未启用状态。");
      }
      var workingId = workingZhubId;
      var workingCode = workingsqlResponse[0].gongxubianma;
      var workingName = workingsqlResponse[0].gongxumingchen;
      var id = insertBomRes.id;
      //插入实体子表
      var insertBomSqlz = {
        id: id,
        gongxuweiwaifei: gongxuwwf,
        BOMImportList: [
          {
            ImportTeam: groupId,
            ImportTeam_name: groupName,
            billOfMaterial: bomid,
            billOfMaterial_bombianma: bomcode,
            billOfMaterial_bommingchen: bomName,
            bomType: bomType,
            processBOM: workingId,
            processBOM_gongxubianma: workingCode,
            processBOM_gongxumingchen: workingName,
            EntryPeriod: strdates,
            gongyingshang: bomSupplier, // 供应商
            hanshuijine: bomAmountIncludingTax, //含税金额
            wushuijine: bomAmountExcludingTax, //无税金额
            shuie: bomTaxAmount, //税率
            _status: "Insert"
          }
        ]
      };
      var insertBomResz = ObjectStore.updateById("AT15F164F008080007.AT15F164F008080007.DetectOrder", insertBomSqlz, "71a4dca4");
      return { insertBomResz };
    }
  }
}
exports({ entryPoint: MyAPIHandler });