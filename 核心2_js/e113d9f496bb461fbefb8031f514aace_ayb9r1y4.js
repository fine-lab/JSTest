let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 获取全部数据
    let data = param.return;
    // 获取主表id
    let id = param.return.id;
    let shifujisuananquanchubeijin = param.return.shifujisuananquanchubeijin;
    // 字段赋初始化为零
    let amountAdvanced = 0;
    let settlementAmount = 0;
    let amountInTotal = 0;
    let totalAdvanceAmount = 0;
    let advanceAggregate = 0;
    let pid = "";
    var contractCharacter = "";
    var ContractCode = "";
    var address = "";
    var entrustingParty = "";
    var door = "";
    var supervisoryStaff = "";
    var stand = "";
    var tier = "";
    var type = "";
    var branch = "";
    // 获取子表集合
    //根据id查询子表
    var sql1 = "select * from GT102917AT3.GT102917AT3.additionalStatementDetails where additionalStatement_id = '" + id + "'";
    var List = ObjectStore.queryByYonQL(sql1);
    if (List.length != 0) {
      // 遍历子表集合
      for (var i = 0; i < List.length; i++) {
        //获取生产工号
        var SCNO = List[i].productionWorkNumber;
        //获取安装合同号
        var HTNumber = param.return.contractNumber;
        //查询附加预支
        //设置预支类型为附加
        var advanceType = 4;
        // 查询预支信息主表
        var sql = "select id from GT102917AT3.GT102917AT3.advanceInformationSheet where contractNumber = '" + HTNumber + "' and advanceType = '" + advanceType + "'";
        var res1 = ObjectStore.queryByYonQL(sql);
        var res = 0;
        // 循环累加
        for (var a = 0; a < res1.length; a++) {
          //根据查出来的id和生产工号查出数据，预支子表
          var sql1 =
            "select amountOfAdvanceThisTime from GT102917AT3.GT102917AT3.advanceInformationSheetDetail where productionWorkNumber = '" +
            SCNO +
            "' and advanceInformationSheet_id = '" +
            res1[a].id +
            "'";
          var ss = ObjectStore.queryByYonQL(sql1);
          for (var j = 0; j < ss.length; j++) {
            res = res + ss[j].amountOfAdvanceThisTime;
          }
        }
        //赋值
        amountAdvanced = res;
        // 计算出合计金额
        amountInTotal = amountInTotal + List[i].settlementAmount;
        //计算已预支合计金额
        advanceAggregate = advanceAggregate + amountAdvanced;
        // 计算本次结算金额
        let settlementAmountThisTime = List[i].settlementAmount - amountAdvanced;
        //根据生产工号查询分包合同子表
        var sql2 = "select * from GT102917AT3.GT102917AT3.subcontractDetails where subcontract_id = '" + HTNumber + "' and id = '" + SCNO + "'";
        var res2 = ObjectStore.queryByYonQL(sql2);
        if (res2.length > 0) {
          door = res2[0].door;
          supervisoryStaff = res2[0].supervisoryStaff;
          stand = res2[0].stand;
          tier = res2[0].tier;
          type = res2[0].model;
          branch = res2[0].branch;
        }
        // 获取子表id
        pid = List[i].id;
        // 更新子表条件
        var updateWrapper1 = new Wrapper();
        updateWrapper1.eq("id", pid);
        // 待更新字段内容
        var toUpdate1 = {
          branch: branch,
          settlementAmountThisTime: settlementAmountThisTime,
          amountAdvanced: amountAdvanced,
          door: door,
          supervisoryStaff: supervisoryStaff,
          stand: stand,
          tier: tier,
          type: type
        };
        // 执行更新
        var res1 = ObjectStore.update("GT102917AT3.GT102917AT3.additionalStatementDetails", toUpdate1, updateWrapper1, "ef9bbecc");
      }
      if (shifujisuananquanchubeijin == "Y") {
        // 计算安全储备金
        var safeReserve = amountInTotal * 0.01;
      }
      // 计算最终结算金额
      let finalSettlementAmount = amountInTotal - safeReserve - advanceAggregate;
      //查询分包合同主表
      var sql3 = "select * from GT102917AT3.GT102917AT3.subcontract where id = '" + HTNumber + "'";
      var res3 = ObjectStore.queryByYonQL(sql3);
      if (res3.length > 0) {
        contractCharacter = res3[0].natureOfContract; //contractNumber  subcontractNo  installationContractNumber
        ContractCode = res3[0].installationContractNumber;
        address = res3[0].address;
        entrustingParty = res3[0].delegateUnit;
      }
      // 更新主表条件
      var updateWrapper = new Wrapper();
      updateWrapper.eq("id", id);
      // 待更新字段内容
      var toUpdate = {
        entrustingParty: entrustingParty,
        address: address,
        ContractCode: ContractCode,
        contractCharacter: contractCharacter,
        amountInTotal: amountInTotal,
        safeReserve: safeReserve,
        finalSettlementAmount: finalSettlementAmount,
        advanceAggregate: advanceAggregate
      };
      // 执行更新
      var res = ObjectStore.update("GT102917AT3.GT102917AT3.additionalStatement", toUpdate, updateWrapper, "a8d3fa5b");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });