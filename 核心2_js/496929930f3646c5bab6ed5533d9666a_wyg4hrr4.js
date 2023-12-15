var MLFBTDJSModel = viewModel.get("MLFBTDJSList");
var TDMLFBFTBLMXModel = viewModel.get("TDMLFBFTBLMXList");
var TDMLJTFTBLMXModel = viewModel.get("TDMLJTFTBLMXList");
var FPJSMXModel = viewModel.get("FPJSMXList");
var TDBLJSYJModel = viewModel.get("TDBLJSYJList");
var mydatabind = false;
viewModel.on("afterLoadData", function (data) {
  // 月度收入分配统计表详情--页面初始化
  debugger;
  //只有新增时获取
  if (!!!data.id) {
    mydatabind = true;
    //获取所有团队
    var TUANDUI = cb.rest.invokeFunction("GT3217AT5.backDesignerFunction.GETTUANDUI", {}, function (err, res) {}, viewModel, { async: false }).result.res;
    console.log(TUANDUI);
    for (var i = 0; i < TUANDUI.length; i++) {
      var rowdata = { fenbu: TUANDUI[i].zDYR08, fenbu_name: TUANDUI[i].zDYR08name, tuandui: TUANDUI[i].id, tuandui_name: TUANDUI[i].name, sFHM01: "2", canyufenpeishuliang: "0" };
      MLFBTDJSModel.insertRow(i, rowdata);
    }
    var MLFBTDJSRow = MLFBTDJSModel.getRows();
    MLFBTDJSRow.forEach((item) => {
      var count = 0;
      for (var i = 0; i < MLFBTDJSRow.length; i++) {
        if (MLFBTDJSRow[i].sFHM01 == "2" && MLFBTDJSRow[i].fenbu == item.fenbu) {
          count++;
        }
        for (var j = 0; j < MLFBTDJSRow.length; j++) {
          if (MLFBTDJSRow[j].fenbu == item.fenbu) MLFBTDJSModel.setCellValue(j, "canyufenpeishuliang", count, true, true);
        }
      }
    });
    viewModel.get("jituanfenpeishu").setValue(TUANDUI.length);
    mydatabind = false;
  }
});
MLFBTDJSModel.on("afterCellValueChange", function (event) {
  let { rowIndex, cellName, value, oldValue, childrenField } = event;
  if (!!!mydatabind) {
    if (event.cellName == "sFHM01") {
      var count = 0;
      var MLFBTDJSRow = MLFBTDJSModel.getRows();
      for (var i = 0; i < MLFBTDJSRow.length; i++) {
        if (MLFBTDJSRow[i].sFHM01 == "2" && MLFBTDJSRow[i].fenbu == MLFBTDJSRow[rowIndex].fenbu) {
          count++;
        }
      }
      for (var j = 0; j < MLFBTDJSRow.length; j++) {
        if (MLFBTDJSRow[j].fenbu == MLFBTDJSRow[rowIndex].fenbu) MLFBTDJSModel.setCellValue(j, "canyufenpeishuliang", count, true, true);
      }
    }
    if (event.cellName == "jituanhuomian") {
      var count = 0;
      var MLFBTDJSRow = MLFBTDJSModel.getRows();
      for (var i = 0; i < MLFBTDJSRow.length; i++) {
        if (MLFBTDJSRow[i].jituanhuomian == "2") {
          count++;
        }
      }
      viewModel.get("jituanfenpeishu").setValue(count);
    }
  }
});
//重算豁免后比例
TDMLJTFTBLMXModel.on("afterCellValueChange", function (event) {
  let { rowIndex, cellName, value, oldValue, childrenField } = event;
  if (event.cellName == "shifuhuomian") {
    // 是否豁免--值改变
    var KJQJ = viewModel.get("suoshuhuijiqijian_code").getValue();
    console.log(KJQJ);
    console.log(viewModel);
    var TDFTBL = cb.rest.invokeFunction("GT3217AT5.backDesignerFunction.GETYWLZDML", { suoshuhuijiqijian: KJQJ }, function (err, res) {}, viewModel, { async: false }).result.rtnjtbl;
    if (!!TDFTBL) {
      var TDFT = TDMLJTFTBLMXModel.getRows();
      for (var i = 0; i < TDFT.length; i++) {
        for (var j = 0; j < TDFTBL.length; j++) {
          if (TDFT[i].zDYR04 == TDFTBL[j].tuandui) TDFT[i].yuanshibili = Number(TDFTBL[j].tuanduibili);
        }
      }
      var totalshemianbili = 0;
      for (var i = 0; i < TDFT.length; i++) {
        if (TDFT[i].shifuhuomian == "1") {
          totalshemianbili += parseFloat(!!TDFT[i].yuanshibili ? TDFT[i].yuanshibili : 0);
        }
      }
      if (totalshemianbili != 0) {
        TDMLJTFTBLMXModel.deleteAllRows();
        var totalallbili = 0;
        for (var i = 0; i < TDFT.length; i++) {
          if (TDFT[i].shifuhuomian == "1") {
            TDFT[i].tuanduibili = 0;
          } else {
            TDFT[i].tuanduibili = Number(
              parseFloat(!!TDFT[i].yuanshibili ? TDFT[i].yuanshibili : "0") +
                parseFloat(totalshemianbili) * (parseFloat(!!TDFT[i].yuanshibili ? TDFT[i].yuanshibili : "0") / (1 - parseFloat(totalshemianbili))).toFixed(4)
            );
          }
        }
        //冒泡排序金额降序
        for (var i = 0; i < TDFT.length - 1; i++) {
          for (var j = 0; j < TDFT.length - 1 - i; j++) {
            if (TDFT[j].tuanduibili > TDFT[j + 1].tuanduibili) {
              var temp = TDFT[j];
              TDFT[j] = TDFT[j + 1];
              TDFT[j + 1] = temp;
            }
          }
        }
        for (var i = 0; i < TDFT.length - 1; i++) {
          totalallbili += Number(TDFT[i].tuanduibili.toFixed(4));
        }
        TDFT[TDFT.length - 1].tuanduibili = 1 - totalallbili;
        if (totalshemianbili == 1) {
          for (var i = 0; i < TDFT.length; i++) {
            var rowdata = { zDYR04: TDFT[i].zDYR04, zDYR04_name: TDFT[i].zDYR04_name, jituanfudongbili: 0.0, shifuhuomian: TDFT[i].shifuhuomian };
            console.log(TDFT[i]);
            TDMLJTFTBLMXModel.insertRow(i, rowdata);
          }
        } else {
          for (var i = 0; i < TDFT.length; i++) {
            var rowdata = { zDYR04: TDFT[i].zDYR04, zDYR04_name: TDFT[i].zDYR04_name, jituanfudongbili: parseFloat(TDFT[i].tuanduibili).toFixed(4), shifuhuomian: TDFT[i].shifuhuomian };
            console.log(TDFT[i]);
            TDMLJTFTBLMXModel.insertRow(i, rowdata);
          }
        }
      } else {
        TDMLJTFTBLMXModel.deleteAllRows();
        for (var i = 0; i < TDFT.length; i++) {
          var rowdata = { zDYR04: TDFT[i].zDYR04, zDYR04_name: TDFT[i].zDYR04_name, jituanfudongbili: parseFloat(TDFT[i].yuanshibili).toFixed(4), shifuhuomian: TDFT[i].shifuhuomian };
          TDMLJTFTBLMXModel.insertRow(i, rowdata);
        }
      }
    }
  }
});
TDMLFBFTBLMXModel.on("afterCellValueChange", function (event) {
  let { rowIndex, cellName, value, oldValue, childrenField } = event;
  if (event.cellName == "shifuhuomian") {
    // 是否豁免--值改变
    var KJQJ = viewModel.get("suoshuhuijiqijian_code").getValue();
    var FBFTBL = cb.rest.invokeFunction("GT3217AT5.backDesignerFunction.GETYWLZDML", { suoshuhuijiqijian: KJQJ }, function (err, res) {}, viewModel, { async: false }).result.rtnfbbl;
    if (!!FBFTBL) {
      var FBFT = TDMLFBFTBLMXModel.getRows();
      console.log(FBFTBL);
      for (var FBFTi = 0; FBFTi < FBFT.length; FBFTi++) {
        for (var FBFTj = 0; FBFTj < FBFTBL.length; FBFTj++) {
          if (FBFT[FBFTi].tuandui == FBFTBL[FBFTj].tuandui && FBFT[FBFTi].fenbu == FBFTBL[FBFTj].fenbu) FBFT[FBFTi].yuanshibili = Number(FBFTBL[FBFTj].bili);
        }
      }
      var rowdata = FBFT[rowIndex];
      var newFBFT = [];
      var changeFBFT = [];
      for (var FBFTj = 0; FBFTj < FBFT.length; FBFTj++) {
        if (FBFT[FBFTj].fenbu_name != rowdata.fenbu_name) {
          newFBFT.push(FBFT[FBFTj]);
        } else {
          changeFBFT.push(FBFT[FBFTj]);
        }
      }
      var totalshemianbili = 0;
      for (var FBFTk = 0; FBFTk < changeFBFT.length; FBFTk++) {
        if (changeFBFT[FBFTk].shifuhuomian == "1") {
          totalshemianbili += parseFloat(!!changeFBFT[FBFTk].yuanshibili ? changeFBFT[FBFTk].yuanshibili : 0);
        }
      }
      if (totalshemianbili != 0) {
        TDMLFBFTBLMXModel.deleteAllRows();
        var totalallbili = 0;
        for (var FBFTl = 0; FBFTl < changeFBFT.length; FBFTl++) {
          if (changeFBFT[FBFTl].shifuhuomian == "1") {
            changeFBFT[FBFTl].fenbufudongbili = 0;
          } else {
            changeFBFT[FBFTl].fenbufudongbili = Number(
              parseFloat(!!changeFBFT[FBFTl].yuanshibili ? changeFBFT[FBFTl].yuanshibili : "0") +
                parseFloat(totalshemianbili) * (parseFloat(!!changeFBFT[FBFTl].yuanshibili ? changeFBFT[FBFTl].yuanshibili : "0") / (1 - parseFloat(totalshemianbili))).toFixed(4)
            );
            console.log(changeFBFT[FBFTl].fenbufudongbili);
          }
        }
        //冒泡排序金额降序
        for (var FBFTm = 0; FBFTm < changeFBFT.length - 1; FBFTm++) {
          for (var FBFTn = 0; FBFTn < changeFBFT.length - 1 - FBFTm; FBFTn++) {
            if (changeFBFT[FBFTn].fenbufudongbili > changeFBFT[FBFTn + 1].fenbufudongbili) {
              var temp = changeFBFT[FBFTn];
              changeFBFT[FBFTn] = changeFBFT[FBFTn + 1];
              changeFBFT[FBFTn + 1] = temp;
            }
          }
        }
        for (var FBFTo = 0; FBFTo < changeFBFT.length - 1; FBFTo++) {
          totalallbili += Number(changeFBFT[FBFTo].fenbufudongbili.toFixed(4));
        }
        changeFBFT[changeFBFT.length - 1].fenbufudongbili = 1 - totalallbili;
        if (totalshemianbili == 1) {
          for (var FBFTp = 0; FBFTp < changeFBFT.length; FBFTp++) {
            var rowdata = {
              tuandui: changeFBFT[FBFTp].tuandui,
              tuandui_name: changeFBFT[FBFTp].tuandui_name,
              fenbu: changeFBFT[FBFTp].fenbu,
              fenbu_name: changeFBFT[FBFTp].fenbu_name,
              fenbufudongbili: 0.0,
              shifuhuomian: changeFBFT[FBFTp].shifuhuomian
            };
            console.log(changeFBFT[FBFTp]);
            TDMLFBFTBLMXModel.insertRow(FBFTp, rowdata);
          }
        } else {
          for (var FBFTq = 0; FBFTq < changeFBFT.length; FBFTq++) {
            var rowdata = {
              tuandui: changeFBFT[FBFTq].tuandui,
              tuandui_name: changeFBFT[FBFTq].tuandui_name,
              fenbu: changeFBFT[FBFTq].fenbu,
              fenbu_name: changeFBFT[FBFTq].fenbu_name,
              fenbufudongbili: parseFloat(changeFBFT[FBFTq].fenbufudongbili).toFixed(4),
              shifuhuomian: changeFBFT[FBFTq].shifuhuomian
            };
            console.log(changeFBFT[FBFTq]);
            TDMLFBFTBLMXModel.insertRow(FBFTq, rowdata);
          }
        }
      } else {
        console.log("totals=0");
        TDMLFBFTBLMXModel.deleteAllRows();
        for (var FBFTr = 0; FBFTr < changeFBFT.length; FBFTr++) {
          var rowdata = {
            tuandui: changeFBFT[FBFTr].tuandui,
            tuandui_name: changeFBFT[FBFTr].tuandui_name,
            fenbu: changeFBFT[FBFTr].fenbu,
            fenbu_name: changeFBFT[FBFTr].fenbu_name,
            fenbufudongbili: parseFloat(changeFBFT[FBFTr].yuanshibili).toFixed(4),
            shifuhuomian: changeFBFT[FBFTr].shifuhuomian
          };
          TDMLFBFTBLMXModel.insertRow(FBFTr, rowdata);
        }
      }
      for (var FBFTs = 0; FBFTs < newFBFT.length; FBFTs++) {
        var rowdata = {
          tuandui: newFBFT[FBFTs].tuandui,
          tuandui_name: newFBFT[FBFTs].tuandui_name,
          fenbu: newFBFT[FBFTs].fenbu,
          fenbu_name: newFBFT[FBFTs].fenbu_name,
          fenbufudongbili: parseFloat(newFBFT[FBFTs].fenbufudongbili).toFixed(4),
          shifuhuomian: newFBFT[FBFTs].shifuhuomian
        };
        TDMLFBFTBLMXModel.insertRow(FBFTs, rowdata);
      }
    }
  }
});
viewModel.get("btnChangeHistory") &&
  viewModel.get("btnChangeHistory").on("click", function (data) {
    // 自动获取--单击
  });
viewModel.get("suoshuhuijiqijian_code").on("afterValueChange", function (data) {
  // 所属会计期间--值改变后
  //清空现有表格内信息
  var TDFTRows = TDMLJTFTBLMXModel.getRows();
  var FBFTRows = TDMLFBFTBLMXModel.getRows();
  var TDFPRows = FPJSMXModel.getRows();
  var TDBLRows = TDBLJSYJModel.getRows();
  if (TDFTRows.length > 0) {
    TDMLJTFTBLMXModel.deleteAllRows();
  }
  if (FBFTRows.length > 0) {
    TDMLFBFTBLMXModel.deleteAllRows();
  }
  if (TDFPRows.length > 0) {
    FPJSMXModel.deleteAllRows();
  }
  if (TDBLRows.length > 0) {
    TDBLJSYJModel.deleteAllRows();
  }
  //获取账期内收付款单
  //获取账期内应收应付
  //获取账期内团队分摊收款信息
  var TUANDUISHOURU = cb.rest.invokeFunction("GT3217AT5.backDesignerFunction.GETYWLZDML", { suoshuhuijiqijian: data.value.code }, function (err, res) {}, viewModel, { async: false }).result;
  console.log(TUANDUISHOURU);
  if (!!TUANDUISHOURU.rtnlist) {
    for (var i = 0; i < TUANDUISHOURU.rtnlist.length; i++) {
      var rowdata = {
        yewudalei: TUANDUISHOURU.rtnlist[i].yewudalei,
        yewudalei_name: TUANDUISHOURU.rtnlist[i].yewudaleiname,
        yWLX001: TUANDUISHOURU.rtnlist[i].t_yewuleixing,
        yWLX001_name: TUANDUISHOURU.rtnlist[i].yewuleixingname,
        zDYR08: TUANDUISHOURU.rtnlist[i].t_zDYR08,
        zDYR08_name: TUANDUISHOURU.rtnlist[i].fenbuname,
        tuandui: TUANDUISHOURU.rtnlist[i].tuandui,
        tuandui_name: TUANDUISHOURU.rtnlist[i].tuanduiname,
        dQDA001: TUANDUISHOURU.rtnlist[i].t_dQDA001,
        dQDA001_name: TUANDUISHOURU.rtnlist[i].diquname,
        jine: TUANDUISHOURU.rtnlist[i].t_zuizhongshouyi.toFixed(2)
      };
      FPJSMXModel.insertRow(i, rowdata);
    }
  }
  console.log(TUANDUISHOURU.rtngroup);
  if (!!TUANDUISHOURU.rtngroup) {
    for (var i = 0; i < TUANDUISHOURU.rtngroup.length; i++) {
      var rowdata = {
        fenbu: TUANDUISHOURU.rtngroup[i].fenbu,
        fenbu_name: TUANDUISHOURU.rtngroup[i].fenbuname,
        tuandui: TUANDUISHOURU.rtngroup[i].id,
        tuandui_name: TUANDUISHOURU.rtngroup[i].name,
        shouruzongjine: TUANDUISHOURU.rtngroup[i].summoney.toFixed(2)
      };
      TDBLJSYJModel.insertRow(i, rowdata);
    }
  }
  console.log(TUANDUISHOURU.rtnjtbl);
  if (!!TUANDUISHOURU.rtnjtbl) {
    for (var i = 0; i < TUANDUISHOURU.rtnjtbl.length; i++) {
      var rowdata = { zDYR04: TUANDUISHOURU.rtnjtbl[i].tuandui, zDYR04_name: TUANDUISHOURU.rtnjtbl[i].tuanduiname, jituanfudongbili: TUANDUISHOURU.rtnjtbl[i].tuanduibili };
      TDMLJTFTBLMXModel.insertRow(i, rowdata);
    }
  }
  if (!!TUANDUISHOURU.rtnfbbl) {
    for (var i = 0; i < TUANDUISHOURU.rtnfbbl.length; i++) {
      var rowdata = {
        tuandui: TUANDUISHOURU.rtnfbbl[i].tuandui,
        tuandui_name: TUANDUISHOURU.rtnfbbl[i].tuanduiname,
        fenbu: TUANDUISHOURU.rtnfbbl[i].fenbu,
        fenbu_name: TUANDUISHOURU.rtnfbbl[i].fenbuname,
        fenbufudongbili: TUANDUISHOURU.rtnfbbl[i].bili.toFixed(4)
      };
      TDMLFBFTBLMXModel.insertRow(i, rowdata);
    }
  }
  if (!!TUANDUISHOURU.rtnzsr) {
    viewModel.get("YDMLZSR").setValue(TUANDUISHOURU.rtnzsr.toFixed(2));
  }
});