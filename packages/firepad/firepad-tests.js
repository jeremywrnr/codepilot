Tinytest.add("smoke", function (test) {
  console.log("starting firepad smoke")
  test.equal(true, true) // starting up
  var cb = function() {};
  FirepadAPI.setup(true);
  FirepadAPI.userfiles();
  FirepadAPI.setText(0);
  FirepadAPI.setAllText();
  FirepadAPI.getText(0, cb);
  FirepadAPI.getAllText([0, 1]);
});
