toastr.options = {
  closeButton: true,
  progressBar: false,
  positionClass: "toast-top-full-width",
  preventDuplicates: true,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "5000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};

$(function () {
  $(".btn").click(function () {
    $(".form-signin").toggleClass("form-signin-left");
    $(".form-signup").toggleClass("form-signup-left");
    $(".frame").toggleClass("frame-long");
    $(".signup-inactive").toggleClass("signup-active");
    $(".signin-active").toggleClass("signin-inactive");
    $(".forgot").toggleClass("forgot-left");
    $(this).removeClass("idle").addClass("active");
  });

  $("#signup").submit(function (e) {
    if ($("#password").val() == 0 || $("#username").val() == 0) {
      toastr.error("All fields are required");
      e.preventDefault();
    }
    if ($("#password").val() !== $("#conpassword").val()) {
      e.preventDefault();
      toastr.error("Passwords do not match");
    }
    if ($("#password").val().length < 6) {
      e.preventDefault();
      toastr.error("Password must be at least 6 characters");
    }
  });
  $("#login").submit(function (e) {
    if ($("#pass").val() == 0 || $("#uname").val() == 0) {
      toastr.error("All fields are required");
      e.preventDefault();
    }
  });
});
