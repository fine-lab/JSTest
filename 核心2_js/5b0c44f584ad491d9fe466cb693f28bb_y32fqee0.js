viewModel.get("button35kj") &&
  viewModel.get("button35kj").on("click", function (data) {
    // 确认--单击
    debugger;
    // 获取主子表所有数据
    var master = viewModel.getAllData();
    // 获取GridModel模型;
    const gridModel = viewModel.getGridModel("IssueDetailsList");
    const indexArr = gridModel.getSelectedRowIndexes();
    // 获取主表的Id
    var masterId = master.id;
    if (indexArr.length > 0) {
      var errArr = [];
      gridModel.getSelectedRowIndexes().forEach((item) => {
        var formData = viewModel.getGridModel().getRowsByIndexes(item)[0];
        if (formData.ConfirmStatus == 1) {
          errArr.push({ productName_product_coding: formData.productName_product_coding, enable: "确认" });
        }
      });
      if (errArr.length > 0) {
        var errMsg = "";
        for (var index = 0; index < errArr.length; index++) {
          errMsg += "产品编码: " + errArr[index].productName_product_coding + "，单据已经属于" + errArr[index].enable + "状态\n";
        }
        cb.utils.confirm(errMsg);
        document.getElementsByClassName("ac-confirm-body-title-keyword")[0].style.whiteSpace = "break-spaces";
        document.getElementsByClassName("ac-confirm-body-title-keyword")[0].style.fontSize = "initial";
        document.getElementsByClassName("ac-confirm-body-title-keyword")[0].style.fontWeight = "400";
        return false;
      }
      for (var i = 0; i < indexArr.length; i++) {
        // 获取某一行数据下标
        var row = indexArr[i];
        // 获取该行号的数据
        var SunData = viewModel.getGridModel().getRowsByIndexes(row);
        // 获取产品编码
        var proCode = SunData[0].productName_product_coding;
        // 获取子表的校验状态
        var checkStatus = SunData[0].checkStatus;
        // 未校验
        if (checkStatus == 1) {
          alert("产品编码为:" + proCode + "单据还未通过校验，请先进行校验！");
          // 跳出本次循环
          continue;
        }
        var termOfValidity = SunData[0].termOfValidity;
        // 转为时间戳
        var term = new Date(termOfValidity).getTime();
        // 当前时间时间戳
        var nowTime = new Date().getTime();
        if (nowTime > term) {
          var roleResult = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.getRole", {}, function (err, res) {}, viewModel, { async: false });
          if (!roleResult.result.hasOwnProperty("resDeatails")) {
            alert("当前日期大于产品有效期确认失败，请联系QA人员确认");
            return;
          }
          // 取角色信息
          // 产生已过期
          // 判断角色类型
          if (roleResult.result.resArr == null) {
            alert("当前日期大于产品有效期确认失败，请联系QA人员确认");
            return;
          }
        }
        // 子表Id
        var detailsDataId = SunData[0].id;
        // 获取子表的确认状态
        var ConfirmStatus = SunData[0].ConfirmStatus;
        var paramsData = {
          masterId: masterId,
          sonId: detailsDataId
        };
        // 调用api函数更新实体
        var result = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.updateIssue", { paramsData }, function (err, res) {}, viewModel, { async: false });
        if (result) {
          alert("产品编码为:" + proCode + "的单据确认成功");
        } else {
          alert("产品编码为:" + proCode + "的单据确认失败:" + result.error.message);
        }
        viewModel.execute("refresh");
      }
    } else {
      alert("未选择表格数据！");
    }
    // 获取子表的数据集合
  });
viewModel.get("button41zh") &&
  viewModel.get("button41zh").on("click", function (data) {
    // 取消确认--单击
    debugger;
    var masterData = viewModel.getAllData();
    // 获取主表的Id
    var masterId = masterData.id;
    // 获取子表模型
    let gridModel = viewModel.getGridModel();
    // 获取选中行数据
    let selectRows = gridModel.getSelectedRows();
    if (selectRows.length == 0) {
      alert("请选中子表数据");
    } else {
      var errArr = [];
      for (var a = 0; a < selectRows.length; a++) {
        var formData = selectRows[a];
        if (formData.ConfirmStatus == 0) {
          errArr.push({ productName_product_coding: formData.productName_product_coding, enable: "取消" });
        }
      }
      if (errArr.length > 0) {
        var errMsg = "";
        for (var index = 0; index < errArr.length; index++) {
          errMsg += "产品编码: " + errArr[index].productName_product_coding + "，单据已经属于" + errArr[index].enable + "状态\n";
        }
        cb.utils.confirm(errMsg);
        document.getElementsByClassName("ac-confirm-body-title-keyword")[0].style.whiteSpace = "break-spaces";
        document.getElementsByClassName("ac-confirm-body-title-keyword")[0].style.fontSize = "initial";
        document.getElementsByClassName("ac-confirm-body-title-keyword")[0].style.fontWeight = "400";
        return false;
      }
      for (var i = 0; i < selectRows.length; i++) {
        var selectOne = selectRows[i];
        // 获取产品编码
        var proCode = selectOne.productName_product_coding;
        // 获取子表的确认状态
        var status = selectOne.ConfirmStatus;
        // 取产品有效期
        var termOfValidity = selectOne.termOfValidity;
        var term = new Date(termOfValidity).getTime();
        if (termOfValidity > term) {
          var roleResult = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.getRole", {}, function (err, res) {}, viewModel, { async: false });
          if (!roleResult.result.hasOwnProperty("resDeatails")) {
            alert("当前日期大于产品有效期取消确认失败，请联系QA人员取消确认");
          }
          // 取角色信息
          var roleType = roleResult.result.resDeatails.userType;
          if (roleType != 1) {
            alert("当前日期大于产品有效期取消确认失败，请联系取消QA人员确认");
            return;
          }
        }
        // 更新子表的确认状态为未确认。
        // 获取选中子表的Id;
        var sonId = selectOne.id;
        var statusRes = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.updateSonStatus", { masterId, sonId }, function (err, res) {}, viewModel, { async: false });
        if (statusRes.error) {
          alert("产品编码为:" + proCode + "的单据取消确认失败：" + statusRes.error.message);
        } else {
          alert("产品编码为:" + proCode + "的单据取消确认成功");
        }
      }
      viewModel.execute("refresh");
    }
  });
viewModel.on("afterLoadData", function (data) {
  // 出库单信息详情--页面初始化
  debugger;
  var pagestate = viewModel.originalParams.mode;
  // 新增态
  if (pagestate == "add") {
    var res = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.getCurrentuser", {}, function (err, res) {}, viewModel, { async: false });
    var makeName = res.result.currentUser.name;
    var addDate = res.result.formatDate;
    viewModel.get("PreparedBy").setValue(makeName);
    viewModel.get("PreparationDate").setValue(addDate);
  }
  //编辑态
  if (pagestate == "edit") {
    var editRes = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.getCurrentuser", {}, function (err, res) {}, viewModel, { async: false });
    var editNewName = editRes.result.currentUser.name;
    var editDate = editRes.result.formatDate;
    viewModel.get("ModifiedBy").setValue(editNewName);
    viewModel.get("ModifiedDate").setValue(editDate);
  }
  // 获取主表的复核状态
  var states = data.enable;
  if (states == "1") {
    viewModel.getGridModel().setReadOnly(true);
  }
});
viewModel.get("IssueDetailsList") &&
  viewModel.get("IssueDetailsList").on("beforeCellValueChange", function (data) {
    // 表格-出库单明细--单元格值改变前
    debugger;
    var gridModelGoods = viewModel.getGridModel("IssueDetailsList");
    var rowIndex = data.rowIndex;
    var cellName = data.cellName;
    if (cellName == "productName_product_coding") {
      gridModelGoods.setCellValue(rowIndex, "productCode", "");
      gridModelGoods.setCellValue(rowIndex, "specification", "");
      gridModelGoods.setCellValue(rowIndex, "productRegisterNo", "");
      gridModelGoods.setCellValue(rowIndex, "batchNumber", "");
      gridModelGoods.setCellValue(rowIndex, "productionDate", "");
      gridModelGoods.setCellValue(rowIndex, "quantity", "");
      gridModelGoods.setCellValue(rowIndex, "ConfirmStatus", "0");
      gridModelGoods.setCellValue(rowIndex, "company", "");
      gridModelGoods.setCellValue(rowIndex, "storageCondition", "");
      gridModelGoods.setCellValue(rowIndex, "remarks", "");
      gridModelGoods.setCellValue(rowIndex, "warehouseLocation", "");
      // 注册人
      gridModelGoods.setCellValue(rowIndex, "registrant_nameRegistrant", "");
      // 有效期
      gridModelGoods.setCellValue(rowIndex, "termOfValidity", "");
      // 生产企业
      gridModelGoods.setCellValue(rowIndex, "productionEnterprise_production_name", "");
    }
  });
// 校验--单击
viewModel.get("button48yh") &&
  viewModel.get("button48yh").on("click", function (data) {
    debugger;
    // 获取子表模型
    let gridModel = viewModel.getGridModel();
    // 获取选中行数据
    let selectRows = gridModel.getSelectedRows();
    // 获取页面所有数据
    let allData = viewModel.getAllData();
    var masterId = allData.id;
    // 获取委托方主键
    // 根据选中行进行校验当前选中行数据校验判断
    if (selectRows.length == 0) {
      alert("请选中子表数据在进行点击校验按钮");
    } else {
      // 循环选中行数据
      for (var i = 0; i < selectRows.length; i++) {
        var selectOne = selectRows[i];
        // 获取选中子表的id;
        var sonId = selectOne.id;
        // 获取选中子表的校验状态
        var checkStatus = selectOne.checkStatus;
        // 产品编码主键
        var code = selectOne.productName;
        // 产品编码
        var number = selectOne.batchNumber;
        // 产品名称
        var productCode = selectOne.productCode;
        param = {
          code: code,
          number: number
        };
        // 调用查询本地数据库接口
        var DBresult = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.selectDB", { param }, function (err, res) {}, viewModel, { async: false });
        if (DBresult.error) {
          alert("查询库存表失败" + DBresult.error.message);
        } else if (DBresult.result) {
          if (DBresult.result.hasOwnProperty("res")) {
            // 从本地数据库查询到数据
            var resultData = DBresult.result.res;
            // 有效期
            var XPIRE_DATE = resultData.xpire_DATE;
            if (XPIRE_DATE == undefined || XPIRE_DATE == null || XPIRE_DATE == "") {
              XPIRE_DATE = null;
            }
            // 生产日期
            var mfg_DATE = resultData.mfg_DATE;
            if (mfg_DATE == undefined || mfg_DATE == null || mfg_DATE == "") {
              mfg_DATE = null;
            }
            // 注册证号
            var po_NBR = resultData.po_NBR;
            // 更新出库单子表的生产日期，有效期
            paramsDate = {
              masterId: masterId,
              sonId: sonId,
              manufactureDate: mfg_DATE,
              validityTerm: XPIRE_DATE,
              registNo: po_NBR
            };
            // 调用函数更新实体
            var updateResult = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.updateInventory", { paramsDate }, function (err, res) {}, viewModel, { async: false });
            // 刷新页面
            viewModel.execute("refresh");
          } else {
            // 查询入库单信息
            var rkResult = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.seletWarehousing", { param }, function (err, res) {}, viewModel, { async: false });
            if (rkResult.error) {
              // 没有查询到数据，在备注上面标注
              // 调用函数更新实体
              var result = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.updateremarks", { masterId, sonId }, function (err, res) {}, viewModel, { async: false });
            } else {
              // 查到数据
              // 入库单的生产日期、有效期填写到出库单明细上
              var dataArr = rkResult.result.result;
              for (var x = 0; x < dataArr.length; x++) {
                var dataDetails = dataArr[x];
                // 获取入库单的生产日期，有效期
                var manufactureDate = dataDetails.date_manufacture;
                var validityTerm = dataDetails.term_validity;
                registration_number = dataDetails.registration_number;
                // 更新出库单子表的生产日期，有效期
                paramsDate = {
                  masterId: masterId,
                  sonId: sonId,
                  // 生产日期
                  manufactureDate: manufactureDate,
                  // 有效期
                  validityTerm: validityTerm,
                  registNo: registration_number
                };
                // 调用函数更新实体
                var result = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.updateDate", { paramsDate }, function (err, res) {}, viewModel, { async: false });
                // 刷新页面
                viewModel.execute("refresh");
              }
            }
            // 根据产品编码id查询产品信息表
            var productResult1 = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.selectProduct", { code }, function (err, res) {}, viewModel, { async: false });
            if (!productResult1.result) {
              //  查询失败
            } else {
              // 查询成功
              var productData = productResult1.result.result;
              for (var y = 0; y < productData.length; y++) {
                var proData = productData[y];
                // 产品信息主表id
                var productMasterId = proData.id;
                // 获取产品的单位、入库存储区货位号;
                var unit = proData.unit;
                var positionNumber = proData.warehouse_storage_area_position_number_by_default;
                proDataArr = {
                  masterId: masterId,
                  sonId: sonId,
                  unit: unit,
                  positionNumber: positionNumber
                };
                // 更新出库单明细的单位和库位
                var productResult2 = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.updateUnit", { proDataArr }, function (err, res) {}, viewModel, { async: false });
                // 根据产品主表id查询产品信息子表产品注册证信息
                var productResult3 = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.selByProMasterId", { productMasterId }, function (err, res) {}, viewModel, { async: false });
                if (!productResult3.result) {
                } else {
                  // 取产品注册证信息的注册证号，生产企业，储运条件回写到出库单明细
                  var prodataStr = productResult3.result.result;
                  for (var b = 0; b < prodataStr.length; b++) {
                    var dataTr = prodataStr[b];
                    var registration_number = dataTr.product_registration_number;
                    var enterprise_name = dataTr.production_enterprise_name;
                    var transportation_conditions = dataTr.storage_conditions;
                    dataParam = {
                      masterId: masterId,
                      sonId: sonId,
                      // 产品注册证
                      registration_number: dataTr.product_umber,
                      // 生产企业
                      enterprise_name: dataTr.production_enterprise_code,
                      // 储运条件
                      transportation_conditions: dataTr.storage_conditions
                    };
                    // 更新出库单明细注册证号，生产企业，储运条件
                    var productResult4 = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.updateDetails", { dataParam }, function (err, res) {}, viewModel, { async: false });
                    if (!productResult4.result) {
                      // 失败
                    } else {
                      // 成功
                    }
                  }
                }
              }
            }
          }
        }
        // 已校验
        // 校验委托方信息
        // 获取委托方编码
        var clientCode = allData.ClientCode_clientCode;
        // 查询委托方信息
        var clientRes = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.selectClientById", { clientCode }, function (err, res) {}, viewModel, { async: false });
        // 判断返回结果
        if (clientRes.error) {
          alert("校验失败:" + clientRes.error.message);
          continue;
        }
        // 校验购货者信息
        // 获取购货者Id
        var buyerCode = allData.BuyerCode;
        // 获取购货者名称
        var buyerName = allData.BuyerName;
        // 查询购货者信息
        var buyerRes = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.checkBuyer", { buyerCode, buyerName }, function (err, res) {}, viewModel, { async: false });
        // 判断购货者返回结果
        if (buyerRes.error) {
          alert("校验失败:" + buyerRes.error.message);
          continue;
        }
        // 产品合法性校验
        // 出库订单中产品的合法性校验
        // 传入出库单子表Id，根据子表Id去查询出库单明细数据
        var productRes = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.selectPro", { sonId }, function (err, res) {}, viewModel, { async: false });
        if (productRes.error) {
          alert("校验失败:" + productRes.error.message);
        } else {
          // 更新出库单子表的校验状态
          var checkRes = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.updateCheckSta", { masterId, sonId }, function (err, res) {}, viewModel, { async: false });
          // 校验成功
          alert("产品名称为:" + productCode + "的单据校验成功");
          // 刷新页面
          viewModel.execute("refresh");
        }
      }
    }
  });
viewModel.get("button52yj") &&
  viewModel.get("button52yj").on("click", function (data) {
    // 按钮--单击
  });
viewModel.get("IssueDetailsList") &&
  viewModel.get("IssueDetailsList").getEditRowModel() &&
  viewModel.get("IssueDetailsList").getEditRowModel().get("productName.product_coding") &&
  viewModel
    .get("IssueDetailsList")
    .getEditRowModel()
    .get("productName.product_coding")
    .on("valueChange", function (data) {
      // 产品编码--值改变
      debugger;
    });