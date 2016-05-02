// linkify tests

Tinytest.add("linkify", function (test) {
  var link = function(x) { return '<a target="_blank" href="' + x + '">' + x + '</a>' }
  test.equal(true, true)

  var x = GitSync.linkify("x")
  test.equal(x, "x")

  var site = "http://y.com"
  var y = GitSync.linkify(site)
  test.equal(y, link(site))

  var site1 = "this is a big string with a link inside "
  var site2 = "http://hi.net"
  var z = GitSync.linkify(site1 + site2)
  test.equal(z, site1 + link(site2))
});

