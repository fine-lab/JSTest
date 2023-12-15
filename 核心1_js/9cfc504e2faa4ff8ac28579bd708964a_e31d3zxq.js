viewModel.on("customInit", function (data) {
  let referenceField = "value";
  let yourIdHere = "yourIdHere";
  let yhtj_gridModel = viewModel.get("SY01_filterconditList");
  //过滤条件修改时
  yhtj_gridModel.on("afterCellValueChange", function (data) {
    //字段切换时
    if (data.cellName == "SY01_filtercondit_field_id_fieldName") {
      let fieldObj = data.value;
      let cellConfig = {};
      let rowIndex = yhtj_gridModel.getFocusedRowIndex();
      //根据字段类型不同显示不同类型组件
      if (fieldObj.fieldType == 1) {
        //文本
        cellConfig = {
          cControlType: "input"
        };
      } else if (fieldObj.fieldType == 2) {
        //参照
        //设置动态参照返回的字段编码
        yhtj_gridModel.setCellValue(rowIndex, "referenceResultCode", fieldObj.referenceResultCode);
        //将文本转换为从按照
        cellConfig = {
          cControlType: "refer"
        };
        //通过过滤字段配置返回的动态参照编码和名称
        cellConfig["cRefType"] = fieldObj.referenceCode;
        cellConfig["cShowCaption"] = fieldObj.referenceName;
        cellConfig["cRefRetId"] = {
          referenceId: "id"
        };
      } else if (fieldObj.fieldType == 3) {
        //日期
        cellConfig = {
          cControlType: "datepicker"
        };
      } else if (fieldObj.fieldType == 4) {
        //时间
        cellConfig = {
          cControlType: "datetimepicker"
        };
      }
      //把value置空
      yhtj_gridModel.setCellValue(data.rowIndex, "value", "");
      //改变组件类型
      yhtj_gridModel.setCellValue(data.rowIndex, "cellConfig", cellConfig);
    }
  });
  //参照设置完成，点击确定按钮赋值
  yhtj_gridModel
    .getEditRowModel()
    .get(referenceField)
    .on("afterMount", function (model) {
      if (model.modelType == "ReferModel") {
        model.on("afterInitVm", function (args) {
          let rowIndex = yhtj_gridModel.getFocusedRowIndex();
          let referViewModelInfo = args.vm;
          //获取动态的参照需要返回的字段key
          let referenceResultCode = yhtj_gridModel.getCellValue(rowIndex, "referenceResultCode");
          referViewModelInfo.on("afterOkClick", function (okData) {
            yhtj_gridModel.setCellValue(rowIndex, referenceId, okData[0].id);
            yhtj_gridModel.setCellValue(rowIndex, referenceField, okData[0][referenceResultCode]);
            model.clearCache("vm");
          });
        });
        if (model.__data.cRefType == "sy01.RefTable_ba7ea52e34") {
          //参照过滤
          model.on("beforeBrowse", function (args) {
            let orgId = viewModel.get("org_id").getValue();
            //主要代码
            var condition = {
              isExtend: true,
              simpleVOs: []
            };
            condition.simpleVOs.push({
              field: "org_id",
              op: "eq",
              value1: orgId
            });
            //设置过滤条件
            model.setFilter(condition);
          });
        }
      }
    });
  yhtj_gridModel.on("afterSetDataSource", function (data) {
    data.forEach(
      (dataitem, index) => {
        let promises = [];
        let filterFieldCfObj = {};
        promises.push(
          getFilterField(dataitem.SY01_filtercondit_field_id).then((res) => {
            filterFieldCfObj = res;
          })
        );
        Promise.all(promises).then(() => {
          let referenceCode = filterFieldCfObj.referenceCode;
          //获取动态的参照编码、名称以及需要返回的字段key
          let referenceName = filterFieldCfObj.referenceName;
          let cellConfig = {
            cControlType: "refer"
          };
          //根据字段类型不同显示不同类型组件
          if (filterFieldCfObj.fieldType == 1) {
            //文本
            cellConfig = {
              cControlType: "input"
            };
          } else if (filterFieldCfObj.fieldType == 2) {
            //参照
            //将文本转换为从按照
            cellConfig = {
              cControlType: "refer"
            };
            //设置参照编码、参照类型（grid\Tree\TreeList）
            cellConfig["cRefType"] = referenceCode;
            cellConfig["cShowCaption"] = referenceName;
            cellConfig["cRefRetId"] = {
              referenceId: "id"
            };
          } else if (filterFieldCfObj.fieldType == 3) {
            //日期
            cellConfig = {
              cControlType: "datepicker"
            };
          } else if (filterFieldCfObj.fieldType == 4) {
            //时间
            cellConfig = {
              cControlType: "datetimepicker"
            };
          }
          //设置为对应的参照
          yhtj_gridModel.setCellValue(index, "cellConfig", cellConfig);
        });
      },
      (err) => {
        cb.utils.alert(err, "error");
      }
    );
  });
  //设置保存前校验
  viewModel.on("beforeSave", function (args) {
    let rows = yhtj_gridModel.getRows();
    let startBracketsNum = 0;
    let bracketsNum = 0;
    let obj = JSON.parse(args.data.data);
    let updateSonList = obj.SY01_filterconditList;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].startBrackets != null && typeof rows[i].startBrackets != "undefined") {
        startBracketsNum++;
      }
      if (rows[i].brackets != null && typeof rows[i].brackets != "undefined") {
        bracketsNum++;
      }
    }
    for (let i = 0, k = 1; i < updateSonList.length; i++) {
      if (updateSonList[i]._status != "Delete") {
        updateSonList[i].sort = k;
        k++;
      }
    }
    if (startBracketsNum != bracketsNum) {
      cb.utils.alert("过滤条件前后括号数量不相等", "error");
      return false;
    }
    args.data.data = JSON.stringify(obj);
    return true;
  });
  function getFilterField(filterconditFieldId) {
    return new Promise((resolve) => {
      cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.getFilterField", { id: filterconditFieldId }, function (err, res) {
        let data;
        if (typeof res != "undefined") {
          resolve(res.filterFieldCfObj[0]);
        } else if (typeof err != "undefined") {
          reject(err);
        }
      });
    });
  }
});