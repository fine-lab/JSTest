let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var productArray = request.productArray;
    var str = "";
    for (var i = 0; i < productArray.length; i++) {
      var updateWrapper = new Wrapper();
      updateWrapper.eq("productionWorkNumber", productArray[i]["生产工号"]);
      var actualAcceptanceDate = undefined;
      var dateOfEntry = undefined;
      if (productArray[i]["实际验收日期"] != undefined) {
        actualAcceptanceDate = loadJsXlsx(productArray[i]["实际验收日期"]);
      }
      if (productArray[i]["进场日期"] != undefined) {
        dateOfEntry = loadJsXlsx(productArray[i]["进场日期"]);
      }
      // 查询分包详情
      let sql = "select * from GT102917AT3.GT102917AT3.subcontractDetails where productionWorkNumber = '" + productArray[i]["生产工号"] + "'";
      var resFB = ObjectStore.queryByYonQL(sql);
      // 查询分包详情
      let sqls = "select subcontract_id.totalAmountOfTheContract from GT102917AT3.GT102917AT3.subcontractDetails where productionWorkNumber = '" + productArray[i]["生产工号"] + "'";
      var resFBs = ObjectStore.queryByYonQL(sqls);
      if (resFB != null) {
        // 主表id
        let Mainid = resFB[0].subcontract_id;
        var mountingCost = 0;
        var hoistCost = 0;
        var boothsFee = 0;
        var five_WayCallCharges = 0;
        var utilities = 0;
        var cooperateWithTheFee = 0;
        var projectExpense = 0;
        var inspectionFee = 0;
        var craftSubsidy = 0;
        var taxAmount = 0;
        var rest = 0;
        var theTotalPackageCombined = 0;
        var num = 0;
        var amountOfJobNo = 0;
        // 附加合计金额
        let additionalAmount = 0;
        // 变更合计金额
        let amountOfChange = 0;
        // 判断是否存在
        if (productArray[i]["安装费"] == undefined) {
          if (resFB[0].hasOwnProperty("mountingCost")) {
            mountingCost = resFB[0].mountingCost;
          }
        } else {
          mountingCost = productArray[i]["安装费"];
        }
        if (productArray[i]["吊装费"] == undefined) {
          if (resFB[0].hasOwnProperty("hoistCost")) {
            hoistCost = resFB[0].hoistCost;
          }
        } else {
          hoistCost = productArray[i]["吊装费"];
        }
        if (productArray[i]["搭棚费"] == undefined) {
          if (resFB[0].hasOwnProperty("boothsFee")) {
            boothsFee = resFB[0].boothsFee;
          }
        } else {
          boothsFee = productArray[i]["搭棚费"];
        }
        if (productArray[i]["五方通话费"] == undefined) {
          if (resFB[0].hasOwnProperty("five_WayCallCharges")) {
            five_WayCallCharges = resFB[0].five_WayCallCharges;
          }
        } else {
          five_WayCallCharges = productArray[i]["五方通话费"];
        }
        if (productArray[i]["水电费"] == undefined) {
          if (resFB[0].hasOwnProperty("utilities")) {
            utilities = resFB[0].utilities;
          }
        } else {
          utilities = productArray[i]["水电费"];
        }
        if (productArray[i]["配合费"] == undefined) {
          if (resFB[0].hasOwnProperty("cooperateWithTheFee")) {
            cooperateWithTheFee = resFB[0].cooperateWithTheFee;
          }
        } else {
          cooperateWithTheFee = productArray[i]["配合费"];
        }
        if (productArray[i]["项目管理费"] == undefined) {
          if (resFB[0].hasOwnProperty("projectExpense")) {
            projectExpense = resFB[0].projectExpense;
          }
        } else {
          projectExpense = productArray[i]["项目管理费"];
        }
        if (productArray[i]["配合验收费"] == undefined) {
          if (resFB[0].hasOwnProperty("inspectionFee")) {
            inspectionFee = resFB[0].inspectionFee;
          }
        } else {
          inspectionFee = productArray[i]["配合验收费"];
        }
        if (productArray[i]["工艺补贴费"] == undefined) {
          if (resFB[0].hasOwnProperty("craftSubsidy")) {
            craftSubsidy = resFB[0].craftSubsidy;
          }
        } else {
          craftSubsidy = productArray[i]["工艺补贴费"];
        }
        if (productArray[i]["税额"] == undefined) {
          if (resFB[0].hasOwnProperty("taxAmount")) {
            taxAmount = resFB[0].taxAmount;
          }
        } else {
          taxAmount = productArray[i]["税额"];
        }
        if (productArray[i]["其他"] == undefined) {
          if (resFB[0].hasOwnProperty("rest")) {
            rest = resFB[0].rest;
          }
        } else {
          rest = productArray[i]["其他"];
        }
        if (productArray[i]["附加合计金额"] == undefined) {
          if (resFB[0].hasOwnProperty("additionalAmount")) {
            // 附加合计金额
            additionalAmount = resFB[0].additionalAmount;
          }
        } else {
          additionalAmount = productArray[i]["附加合计金额"];
        }
        if (productArray[i]["变更合计金额"] == undefined) {
          if (resFB[0].hasOwnProperty("amountOfChange")) {
            // 变更合计金额
            amountOfChange = resFB[0].amountOfChange;
          }
        } else {
          amountOfChange = productArray[i]["变更合计金额"];
        }
        // 合计
        theTotalPackageCombined = mountingCost + hoistCost + boothsFee + five_WayCallCharges + utilities + cooperateWithTheFee + projectExpense + inspectionFee + craftSubsidy + taxAmount + rest;
        // 合计金额
        amountOfJobNo = theTotalPackageCombined + additionalAmount + amountOfChange;
        var toUpdate = {
          fenbaohetonghao: productArray[i]["分包合同号"],
          model: productArray[i]["型号"],
          tier: productArray[i]["层"],
          stand: productArray[i]["站"],
          door: productArray[i]["门"],
          constructionMethod: productArray[i]["工法"],
          shaftHeight: productArray[i]["井道高度"],
          hoistingHeight: productArray[i]["提升高度"],
          mountingCost: productArray[i]["安装费"],
          hoistCost: productArray[i]["吊装费"],
          boothsFee: productArray[i]["搭棚费"],
          five_WayCallCharges: productArray[i]["五方通话费"],
          utilities: productArray[i]["水电费"],
          cooperateWithTheFee: productArray[i]["配合费"],
          projectExpense: productArray[i]["项目管理费"],
          inspectionFee: productArray[i]["配合验收费"],
          craftSubsidy: productArray[i]["工艺补贴费"],
          taxAmount: productArray[i]["税额"],
          rest: productArray[i]["其他"],
          theTotalPackageCombined: theTotalPackageCombined,
          additionalAmount: productArray[i]["附加合计金额"],
          amountOfChange: productArray[i]["变更合计金额"],
          amountOfJobNo: amountOfJobNo,
          anzhuangfeishoukuanbilv: productArray[i]["安装费收款比率"],
          branch: productArray[i]["分科"],
          installationleader: productArray[i]["安装组长"],
          supervisoryStaff: productArray[i]["监理人员"],
          hitachiSupervision: productArray[i]["日立监理"],
          dateOfEntry: dateOfEntry,
          actualAcceptanceDate: actualAcceptanceDate,
          installationSettlementRatio: productArray[i]["安装结算比率"],
          liftingSettlementRatio: productArray[i]["吊装结算比率"],
          shedSettlementRatio: productArray[i]["搭棚结算比率"],
          additionalSettlementRatio: productArray[i]["附加结算比率"],
          hoistingWhether: productArray[i]["吊装结算表是否结算"],
          scaffoldWhether: productArray[i]["搭棚结算表是否结算"],
          installWhether: productArray[i]["安装结算表是否结算"],
          remark: productArray[i]["备注"]
        };
        var res = ObjectStore.update("GT102917AT3.GT102917AT3.subcontractDetails", toUpdate, updateWrapper, "82884516");
        num = resFBs[0].subcontract_id_totalAmountOfTheContract - resFB[0].theTotalPackageCombined + theTotalPackageCombined;
        //更新表头金额
        var object1 = { id: Mainid, totalAmountOfTheContract: num, _status: "Update" };
        var res1 = ObjectStore.updateById("GT102917AT3.GT102917AT3.subcontract", object1, "5ff76a5f");
      } else {
        str = str + productArray[i]["生产工号"];
      }
    }
    return { str: str };
  }
}
exports({ entryPoint: MyAPIHandler });
function loadJsXlsx(s) {
  var hasNumber = typeof s;
  if (hasNumber == "number") {
    var format = "-";
    let time = new Date((s - 25567) * 24 * 3600000 - 5 * 60 * 1000 - 43 * 1000 - 24 * 3600000 - 8 * 3600000);
    let year = time.getFullYear() + "";
    let month = time.getMonth() + 1 + "";
    let date = time.getDate() + "";
    const hours = time.getHours().toLocaleString();
    const minutes = time.getMinutes();
    if (format && format.length === 1) {
      s = year + format + month + format + date + " " + hours + ":" + minutes;
    }
    s = year + format + (month < 10 ? "0" + month : month) + format + (date < 10 ? "0" + date : date);
    return s;
  }
}