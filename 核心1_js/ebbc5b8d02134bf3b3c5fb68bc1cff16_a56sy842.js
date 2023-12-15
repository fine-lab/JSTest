viewModel.on("afterMount", () => {
  const value = [
    // 二维数组
    [
      { value: 75, name: "累计收款金额" },
      { value: 25, name: "累计付款金额" },
      { value: 25, name: "累计付款金额1" }
    ]
  ];
  viewModel.get("item48lg").setValue(value);
});