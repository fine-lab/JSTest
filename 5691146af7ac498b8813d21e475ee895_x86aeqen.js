viewModel.get("button27ii") &&
  viewModel.get("button27ii").on("click", function (data) {
    // 按规则匹配环节--单击
    lobj = viewModel;
    console.log(viewModel.__data);
    cb.rest.invokeFunction("AT17FE7F8616F80008.HDJB.getApproveRule", { GZLX_id: lobj.getData("guizeleixing").guizeleixing }, function (err, res) {
      console.log(res);
      lres = res;
      const rowData = lobj.getGridModel("LZGZHJList");
      let arr = rowData.getDataSourceRows();
      arr = arr.filter((item) => {
        if (!item.yinyonghuanjie) {
          // 执行删除
          return true;
        }
        return false;
      });
      rowData.setDataSource(arr);
      for (var i = 0; i < lres.res.length; i++) {
        rowData.appendRow({
          huanjiebianma: lres.res[i].huanjiebianma,
          huanjiemingchen: lres.res[i].huanjiemingchen,
          zxyq: lres.res[i].zhixingyaoqiu,
          yinyonghuanjie: lres.res[i].id
        });
      }
    });
  });
viewModel.get("button27ii") &&
  viewModel.get("button27ii").on("click", function (data) {
    // 按规则匹配环节--单击
  });