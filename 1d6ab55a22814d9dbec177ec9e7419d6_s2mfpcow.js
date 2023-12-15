rootStore.designerScripts = {
  input24onBeforeChange: function (rootStore, alias, event, rowStore) {
    // 字段1——值改变前
    TinperNext.Message.info({
      content: "字段1——值改变前",
      duration: 0,
      onClose: () => {
        console.log("close");
      }
    });
  },
  input24onAfterChange: function (rootStore, alias, event, rowStore) {
    // 字段1——值改变后
    TinperNext.Message.info({
      content: "字段1——值改变后",
      duration: 0,
      onClose: () => {
        console.log("close");
      }
    });
  }
}; // disabled-row-code [designerScripts-end]