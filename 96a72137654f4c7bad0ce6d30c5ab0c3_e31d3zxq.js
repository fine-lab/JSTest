viewModel.on("customInit", function (data) {
  const gridModel = viewModel.getGridModel();
  let deliveryIdArray = [-1];
  let getDeliveryIds = () => {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction("GT22176AT10.gspofsales.getIdsToCheck", {}, function (err, res) {
        if (err) {
          cb.utils.alert(err.message, "error");
          return false;
        } else {
          deliveryIdArray = res.deliveryIdArray;
          resolve(deliveryIdArray);
        }
      });
    });
  };
  viewModel.on("afterMount", function () {
    document.getElementsByClassName("wui-button m-l-8")[1].style.backgroundColor = "#EE2233";
    document.getElementsByClassName("wui-button m-l-8")[1].style.color = "#FFFFFF";
    gridModel.setColumnState("statusCode", "formatter", function (rowInfo, rowData) {
      if (rowData.statusCode) {
        //自定义展示列
        return {
          //是否重写  true：是 false:否
          override: true,
          //自定义展示的内容
          html: "发货已审"
        };
      }
    });
  });
  // 销售发货--页面初始化
  viewModel.on("beforeSearch", function (args) {
    args.isExtend = true;
    args.params.condition.isExtend = true;
    args.params.condition.simpleVOs = [];
    args.params.condition.simpleVOs.push(
      {
        field: "extendGspType",
        op: "eq",
        value1: 1
      },
      {
        field: "statusCode",
        op: "eq",
        value1: "DELIVERING"
      },
      {
        field: "extendReviewStatus",
        op: "eq",
        value1: 2
      }
    );
  });
  viewModel.on("beforeBatchpush", function (args) {
    if (args.args.cCaption.indexOf("生单") > -1) {
      var selectData = gridModel.getSelectedRows();
      if (selectData.length < 1) {
        cb.utils.alert("请选择数据", "warning");
        return false;
      }
      let errorMsg = "";
      let handerMessage = (n) => (errorMsg += n);
      let promiseArray = [];
      for (let i = 0; i < selectData.length; i++) {
        let id = selectData[i].id;
        let code = selectData[i].code;
        let extendGspType = selectData[i].extendGspType;
        //判断状态是否符合
        if (selectData[i].statusCode != "DELIVERING") {
          cb.utils.alert("没有符合条件可生单的单据。");
          return false;
        }
        if (extendGspType !== true && extendGspType != "true" && extendGspType != "1" && extendGspType != 1) {
          cb.utils.alert("发货单" + code + "非GSP类型，不允许下推出库复核", "error");
          return false;
        }
        //下游出库复核单据未审核，不允许下推
        let data = { id: selectData[i].id, uri: "GT22176AT10.GT22176AT10.sy01_saleoutstofhv6" };
      }
      let promiseRes = new cb.promise();
      Promise.all(promiseArray).then(() => {
        if (errorMsg.length > 0) {
          cb.utils.alert(errorMsg, "error");
          promiseRes.reject();
        } else {
          promiseRes.resolve();
        }
      });
      return promiseRes;
    }
  });
  let invokeFunction1 = function (id, data, callback, viewModel, options) {
    var proxy = cb.rest.DynamicProxy.create({
      doProxy: {
        url: "/web/function/invoke/" + id,
        method: "POST",
        options: options
      }
    });
    if (options.async == false) {
      return proxy.doProxy(data, callback);
    } else {
      proxy.doProxy(data, callback);
    }
  };
});