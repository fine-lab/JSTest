viewModel.on("customInit", function (data) {
  // 药品敏感特征设置详情--页面初始化
  let gridModel = viewModel.getGridModel("sy01_freeFeatureList");
  gridModel.setState("mergeCells", true);
  //某个列是否开启列合并的功能通过设置bMergeCol 属性来控制，true开启，false为关闭。通过扩展脚本可以动态设置
  gridModel.setColumnState("featureGroupName", "bMergeCol", true);
  gridModel.setColumnState("featureGroupId", "bMergeCol", true);
  let getTemplateInfo = function (templateId) {
    return new Promise(function (resolve, reject) {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.getTempFeature", { templateId: templateId }, function (err, res) {
        if (typeof res !== "undefined") {
          resolve(res.info);
        } else if (err !== null) {
          reject(err.message);
        }
      });
    });
  };
  let validateUnique = function (uri, id, template) {
    return new Promise(function (resolve, reject) {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.fieldsUnique", { id: id, tableUri: uri, fields: { template: { value: template } } }, function (err, res) {
        if (typeof res !== "undefined") {
          if (res.repeat == true) {
            reject("此模板已有相关配置");
          } else {
            resolve();
          }
        } else if (err !== null) {
          reject(err.message);
        }
      });
    });
  };
  viewModel.get("template_name").on("afterValueChange", function (data) {
    if (data.value == null) {
      gridModel.deleteAllRows();
    } else if (data.oldValue == null || data.value.id != data.oldValue.id) {
      gridModel.deleteAllRows();
      getTemplateInfo(data.value.id).then(
        (res) => {
          let obj = [];
          for (let i = 0; i < res.length; i++) {
            obj.push({
              _status: "Insert",
              featureGroupId: res[i].characteristics,
              featureGroupName: res[i].characteristicsName,
              featureId: res[i].character,
              featureName: res[i].characterName,
              featureCode: res[i].characterCode,
              gspControl: 0,
              gmpControl: 0
            });
            gridModel.setDataSource(obj);
          }
        },
        (err) => {
          cb.utils.alert(err, "error");
        }
      );
    }
  });
  viewModel.on("beforeSave", function (data) {
    //判重
    let id = viewModel.get("id").getValue();
    let template = viewModel.get("template").getValue();
    //至少有一个需要设置为是
    let gsp = false;
    let gmp = false;
    let rows = gridModel.getRows();
    for (let i = 0; i < rows.length; i++) {
      if (gsp == false && (rows[i].gspControl == 1 || rows[i].gspControl == "1")) {
        gsp = true;
      }
      if (gmp == false && (rows[i].gmpControl == 1 || rows[i].gmpControl == "1")) {
        gmp = true;
      }
      if (gsp == true && gmp == true) {
        break;
      }
    }
    if (gsp == false) {
      cb.utils.alert("GSP敏感至少要有一项", "error");
      return false;
    }
    if (gmp == false) {
      cb.utils.alert("GMP敏感至少要有一项", "error");
      return false;
    }
    let returnPromise = new cb.promise();
    validateUnique("GT22176AT10.GT22176AT10.drugFeatrueConfig", id, template).then(
      (res) => {
        returnPromise.resolve();
      },
      (err) => {
        cb.utils.alert(err, "error");
        returnPromise.reject();
      }
    );
    return returnPromise;
  });
});