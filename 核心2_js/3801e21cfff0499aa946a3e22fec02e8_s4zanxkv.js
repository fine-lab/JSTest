viewModel.get("button2oi") &&
  viewModel.get("button2oi").on("click", function (data) {
    viewModel.communication({ type: "modal", payload: { data: false } });
  });
viewModel.get("button6mb") &&
  viewModel.get("button6mb").on("click", function (data) {
    var params = viewModel.getParams();
    var list = data.id4ActionAuth;
    if (list.length == 0) {
      return;
    }
    var ids = "";
    for (var i = 0; i < list.length; i++) {
      ids += "'" + list[i] + "',";
    }
    ids = ids.slice(0, -1);
    let json = {
      ids: ids
    };
    cb.rest.invokeFunction("AT197D02EA09780007.backOpenApiFunction.GetPackingData", json, function (err, res) {
      if (err) {
        console.log("打包单查询异常");
        console.log(err);
      } else {
        var EncasementEntryList = [];
        var PackingEntryList = [];
        var dbdlist = res.res;
        var TotalNetWeight = 0;
        var TotalGrossWeight = 0;
        for (var i = 0; i < dbdlist.length; i++) {
          TotalNetWeight += dbdlist[i]["NetWeight"];
          TotalGrossWeight += dbdlist[i]["GrossWeight"];
          var model = {
            FurnaceNumber: dbdlist[i]["FurnaceNumber"],
            BundleNumber: dbdlist[i]["BundleNumber"],
            ProductName: dbdlist[i]["Product"],
            CustomerName: dbdlist[i]["Client"],
            Tare: dbdlist[i]["Tare"],
            NumberPackages: dbdlist[i]["NumberPackages"],
            PackingID: dbdlist[i]["id"],
            _status: "Insert"
          };
          EncasementEntryList.push(model);
          var dbdmodel = {
            id: dbdlist[i]["id"],
            SalesOrderNO: params.upcode
          };
          PackingEntryList.push(dbdmodel);
        }
        var zxd = {
          CreateTime: formatCurrentDate(),
          ContainerNumber: params.gh,
          SealNumber: params.fth,
          CabinetType: params.gx,
          TotalNetWeight: TotalNetWeight,
          TotalGrossWeight: TotalGrossWeight,
          PacketNumber: dbdlist.length,
          EncasementEntryList: EncasementEntryList,
          _status: "Insert"
        };
        //反写打包单json
        var dbdjson = {
          data: PackingEntryList
        };
        var result = cb.rest.invokeFunction(
          "AT197D02EA09780007.backOpenApiFunction.AddEncasement",
          zxd,
          function (err1, res1) {
            if (err1) {
              console.log("装箱异常");
              console.log(err1);
            }
          },
          viewModel,
          { async: false }
        );
        if (result) {
          var result1 = cb.rest.invokeFunction(
            "AT197D02EA09780007.backOpenApiFunction.SetPacking",
            dbdjson,
            function (err2, res2) {
              if (err2) {
                console.log("打包单反写异常");
                console.log(err2);
              } else {
                console.log(res2);
              }
            },
            viewModel,
            { async: false }
          );
          console.log(result1);
        }
        cb.utils.alert("装箱完成", "success");
      }
    });
    viewModel.communication({ type: "modal", payload: { data: false } });
  });
function formatCurrentDate() {
  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = padZero(currentDate.getMonth() + 1);
  let day = padZero(currentDate.getDate());
  let hours = padZero(currentDate.getHours());
  let minutes = padZero(currentDate.getMinutes());
  let seconds = padZero(currentDate.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
function padZero(value) {
  return value < 10 ? `0${value}` : value;
}
viewModel.on("customInit", function (data) {
  //打包单选单弹窗--页面初始化
});