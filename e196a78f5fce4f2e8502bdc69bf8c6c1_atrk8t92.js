// 批量通过
viewModel.get("button4ki").on("click", () => {
  getList("1");
});
// 批量不通过
viewModel.get("button10vi").on("click", () => {
  getList("2");
});
function batchUpdate(arr) {
  cb.rest.invokeFunction(
    "AT15C31CE017B00008.backend.batchUpdateData",
    {
      url: "AT15C31CE017B00008.AT15C31CE017B00008.psmx",
      object: arr,
      billNo: viewModel.getParams().billNo
    },
    function (err, res) {
      if (err) {
        cb.utils.alert(err, "error");
        return false;
      }
      if (res && res.data) {
        cb.utils.alert("操作成功", "success");
        viewModel.execute("refresh");
      }
    }
  );
}
function getList(val) {
  const grid = viewModel.getGridModel();
  const rows = grid.getSelectedRows();
  if (rows.length != 1) {
    cb.utils.alert("请选择数据");
    return false;
  }
  let _rows = rows.map((rowItem) => {
    return rowItem.id;
  });
  cb.rest.invokeFunction(
    "AT15C31CE017B00008.backend.getList",
    {
      url: "AT15C31CE017B00008.AT15C31CE017B00008.psmx",
      object: {
        ids: _rows,
        compositions: [
          {
            name: "pwpingshenList",
            compositions: []
          }
        ]
      },
      billNo: viewModel.getParams().billNo
    },
    function (err, res) {
      if (err) {
        cb.utils.alert(err, "error");
        return false;
      }
      if (res && res.data) {
        let arr = res.data,
          list = [];
        arr.forEach((item) => {
          let pw = {
            id: item.id,
            jieguostatus: val,
            pwpingshenList: []
          };
          if (Array.isArray(item.pwpingshenList)) {
            item.pwpingshenList.forEach((pwItem) => {
              let i = {
                id: pwItem.id,
                pshenjieguo: val,
                _status: "Update"
              };
              pw.pwpingshenList.push(i);
            });
          }
          list.push(pw);
        });
        batchUpdate(list);
      }
    }
  );
}