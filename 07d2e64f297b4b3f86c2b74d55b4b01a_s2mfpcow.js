rootStore.designerScripts = {
  input9onBeforeChange: function (rootStore, alias, event, rowStore) {
    // 字段1——值改变前
    ArcUI.Toast.show({ content: "字段1——值改变前", duration: 3 });
  },
  input9onAfterChange: function (rootStore, alias, event, rowStore) {
    // 字段1——值改变后
    setTimeout(function () {
      ArcUI.Toast.show({ content: "字段1——值改变后", duration: 3 });
    }, 2000);
  }
}; // disabled-row-code [designerScripts-end]