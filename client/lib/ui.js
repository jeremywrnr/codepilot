// small ui helpers, loaded before the rest of the client

import toastr from "toastr";
import "toastr/build/toastr.min.css";

window.toastr = toastr;

// bootstrap 3 collapse, without bootstrap's js plugins
$(document).on("click", '[data-toggle="collapse"]', function (e) {
  e.preventDefault();
  $($(this).attr("href") || $(this).data("target")).toggleClass("in");
});
