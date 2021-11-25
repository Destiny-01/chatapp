window.addEventListener(
  "load",
  function () {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName("needs-validation");
    // Loop over them and prevent submission
    Array.prototype.filter.call(forms, function (form) {
      form.addEventListener(
        "submit",
        function (event) {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add("was-validated");
        },
        false
      );
    });
  },
  false
);

function submitSearch() {
  if ($("#search").val() == 0) {
    return;
  }
  $("#search-results").show();
  $("#public-rooms").hide();
  $.post(
    `/rooms/search?query=${$("#search").val()}`,
    (data) => {
      console.log(data);
      $.each(data.rooms, (i, room) => {
        $("#search-results").append(`
            <div class="room-link">
              <div class="card no-outline mb-2 mt-2 room-card">
                <div class="card-body">
                  <div class="title">
                    <h6 class="name">${room.name} </h6>
                    <button
                      onclick="joinRoom(${room.room_id})"
                      class="btn btn-primary btn-sm"
                    >
                    Join
                    </button>
                  </div>
                  <div class="member-count text-muted">${room.users.length}  Members</div>
  
                  <p class="description">
                    ${room.description}
                  </p>
                </div>
              </div>
            </div>
            <hr />
          `);
      });
    },
    "json"
  );
  // document.getElementById("public-rooms").style.display = "none";
  // document.getElementById("search-results").style.display = "block";
}
function openSidebar() {
  document.getElementById("rooms").style.display = "none";
  document.getElementById("sidebar").style.flex = "0 0 100%";
  document.getElementById("sidebar").style.maxWidth = "100%";
  document.getElementById("sidebar").style.display = "block";
}
function closeSidebar() {
  document.getElementById("rooms").style.display = "block";
  document.getElementById("sidebar").style.display = "none";
}
function deleteUser() {
  swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this User!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      swal({
        title: "Are you sure?",
        text: "This is a last check. Are you very sure?!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          swal("User deleted Successfully", {
            icon: "success",
          });
        }
      });
    }
  });
}

const joinRoom = (room_id) => {
  window.location.href = `/rooms/${room_id}`;
  $.post(`/rooms/join?room_id=${room_id}`, (data) => {
    console.log(data);
  });
};

// $(function () {
//   $("#search").keypress(() => {
//     if ($(this).val() == 0) {
//       $("#search-results").hide();
//       $("#public-rooms").show();
//       return;
//     }
//     $.post(
//       `/rooms/search?query=${$("#search").val()}`,
//       (data) => {
//         $.each(data.rooms, (i, room) => {
//           console.log(data);
//           $("#search-results").append(`
//             <div class="room-link">
//               <div class="card no-outline mb-2 mt-2 room-card">
//                 <div class="card-body">
//                   <div class="title">
//                     <h6 class="name">${room.name} </h6>
//                     <button
//                       onclick="joinRoom(${room.room_id})"
//                       class="btn btn-primary btn-sm"
//                     >
//                     Join
//                     </button>
//                   </div>
//                   <div class="member-count text-muted">${room.users.length}  Members</div>

//                   <p class="description">
//                     ${room.description}
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <hr />
//           `);
//         });
//       },
//       "json"
//     );
//   });
// });

// $(function () {
//   $.get(
//     "/rooms/all",
//     (data) => {
//       $.each(data.rooms, (i, room) => {
//         console.log(data);
//         $("#public-rooms").append(`
//           <div class="room-link">
//             <div class="card no-outline mb-2 mt-2 room-card">
//               <div class="card-body">
//                 <div class="title">
//                   <h6 class="name">${room.name} </h6>
//                   <button
//                     onclick="joinRoom(${room.room_id})"
//                     class="btn btn-primary btn-sm"
//                   >
//                   Join
//                   </button>
//                 </div>
//                 <div class="member-count text-muted">${room.users.length}  Members</div>

//                 <p class="description">
//                   ${room.description}
//                 </p>
//               </div>
//             </div>
//           </div>
//           <hr />
//         `);
//       });
//     },
//     "json"
//   );
// });

$(".col-3 form").submit(() => {
  let room_id = $(".col-3 form input").val();
  $(this).attr("action", `/rooms/join?room_id=${room_id}`);
});
