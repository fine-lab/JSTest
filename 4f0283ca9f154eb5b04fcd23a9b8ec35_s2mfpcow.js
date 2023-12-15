rootStore.designerScripts = {
  input9onBeforeChange: function (rootStore, alias, event, rowStore) {
    // 字段1——值改变前
    ArcUI.Toast.show({ content: "字段1——值改变前", duration: 3 });
  }
}; // disabled-row-code [designerScripts-end]