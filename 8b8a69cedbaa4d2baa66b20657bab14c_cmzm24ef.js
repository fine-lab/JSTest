rootStore.designerScripts = {
  referinput32onBeforeChange: function () {
    // 单选引用——值改变前
    alert("值改变前");
  },
  referinput32onAfterChange: function () {
    // 单选引用——值改变后
    alert("值改变后");
  },
  referinput32onOpen: function () {
    // 单选引用——打开参照弹窗
    alert("打开参照弹窗");
  },
  referinput32getReferData: function () {
    // 单选引用——参照数据加载前
    alert("参照数据加载前");
  },
  referinput32onChangeSelect: function () {
    // 单选引用——修改参照选项时
    alert("修改参照选项时");
  },
  referinput32onOk: function () {
    // 单选引用——参照确定
    alert("参照确定");
  },
  referinput32onClear: function () {
    // 单选引用——参照清空
    alert("参照清空");
  },
  referinput32onClose: function () {
    // 单选引用——关闭参照弹窗
    alert("关闭参照弹窗");
  },
  referinput32onChangePageIndex: function () {
    // 单选引用——表参照切换页码时
    alert("表参照切换页码时");
  },
  referinput32onSearchTableRef: function () {
    // 单选引用——表参照查询时
    alert("表参照查询时");
  }
}; // disabled-row-code [designerScripts-end]