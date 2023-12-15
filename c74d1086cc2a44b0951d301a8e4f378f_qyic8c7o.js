viewModel.on("customInit", function (data) {
  // 商机列表--页面初始化
  viewModel.get("newlyAdded")?.setVisible(false);
  viewModel.get("btnaddfixed")?.setVisible(false);
});
viewModel.on("afterInitCommonViewModel", function () {
  const filterViewModel = viewModel.getCache("FilterViewModel");
  filterViewModel.on("afterInit", function () {
    const referModel = filterViewModel.get("dept").getFromModel();
    referModel.on("beforeBrowse", function (args) {
      let condition = {
        isExtend: true,
        simpleVOs: [
          {
            field: "parentorgid",
            op: "in",
            value1: [
              "ab756309feca4c708af760ca14b34a91",
              "f21b4aa6cbe64643a0243383e032bde3",
              "2175235551301880",
              "2316753606463740",
              "3d938f18ec93496a8192c469feb281b8",
              "2176739603960060",
              "adf8381b9493470cb2f759235349f9aa",
              "0314f3a32e7a44dea33fcb24cfa9c504",
              "f327de6563364bdc8da4e58cf3a9d29b",
              "1658429260114690000",
              "437af70258c446fc827b05e5b4b3a474",
              "56ad41dc8c4c4f9e84b1567a2deb8fdb",
              "e0a489c10cdb4f2a8fb15244401bcb79",
              "1518148168470780",
              "d02cd401d6c24299b7ef247b251ad548",
              "57e687aff03347fc8768cd8e0157b6c8",
              "3845c7d071c948f69c99e1e6024d8edc",
              "95ac32053f1941ecbc5d2a0797475714",
              "2235633542091000",
              "6204e915be8a4923949208bd3c4fb49b",
              "896c7bdf8a994bb69d10fc31429c384b",
              "1608771679834360",
              "2336552427835640",
              "316bd217f8934d83be9c548f007a9b63",
              "2720185832362240",
              "678d29a9ce014584b6095023f9034e9d",
              "5af94a06f9ca48c098cbb0aa244ae5fd",
              "404d3c98d31c4a14a1258d696bc4d9f9",
              "0001A210000000003ADC"
            ]
          }
        ]
      };
      referModel.setTreeFilter(condition);
    });
  });
});