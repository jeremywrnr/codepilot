// linkify tests

Tinytest.add('linkify', function (test) {
  var link = function(x) { '<a target="_blank" href="' + x + '">' + x + '</a>' }
  test.equal(true, true)

  var x = Codepilot.linkify('x')
  test.equal(x, ['x'])

  var y = Codepilot.linkify('y.com')
  test.equal(y, [link('y.com')])

  var z = Codepilot.linkify('1', 'hi.net')
  test.equal(z, ['1', link('hi.net')])
});

