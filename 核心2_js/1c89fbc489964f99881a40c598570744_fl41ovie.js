viewModel.on("afterMount", function (data) {
  // 专项区域经营情况 --页面加载完成
  var viewModel = this;
  var mb;
  //调用后端函数，获取当前登录用户
  cb.rest.invokeFunction("GT10891AT368.hdhs.getUserId", {}, function (err, res) {
    mb = res.Target[0].ziduan2;
    //为文本设置默认值
    viewModel.get("quyufuzeren").setValue(res.UserName);
    //获取参照模型
    let Target = viewModel.get("nianzhuanxiangyewuzhibiao_ziduan2");
    //为参照赋默认值
    Target.setValue(mb);
    //为参照设置过滤条件
    Target.on("beforeBrowse", function (args) {
      //主要代码
      var condition = {
        isExtend: true,
        simpleVOs: []
      };
      condition.simpleVOs.push({
        field: "ziduan2",
        op: "eq",
        value1: mb
      });
      //设置过滤条件
      this.setFilter(condition);
    });
  });
});