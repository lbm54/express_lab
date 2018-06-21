let chirps;
let renderChirps = () => {
  if (chirps) {
    let nextId = chirps.nextid;
    for (let i = 0; i < nextId; i++) {
      if (chirps[i]) {
        renderChirp(chirps[i], i);
      }
    }
  }
};

let renderChirp = (chirp, i) => {
  $("#cardRow").append(`
        <div class="card m-2 chirpCard" style="width: 18rem;" id="${i}">
            <div class="card-header">
                <h5 class="card-title">
                    ${chirp.name}
                    <span class="badge badge-light removeBtn" style="float: right; cursor: pointer">
                        x
                    </span>
                </h5>
            </div>
            <div class="card-body">
                <p class="card-text p-1">${chirp.body}</p>
            </div>
            <div class="card-footer">
                <button class="btn btn-primary editButton" id="btn_${i}">Edit</button>
            </div>
        </div>
    `);
};

let ajaxCall = (type, url, data, contentType) => {
  let ajaxObject = {
    type: type,
    url: url
  };
  if (data) ajaxObject["data"] = data;
  if (contentType) ajaxObject["contentType"] = contentType;
  $.ajax(ajaxObject);
};

$(document).ready(function() {
  let getChirps = () => {
    $.get("/api/chirps", function(response) {
      chirps = response;
      renderChirps();

      $(".editButton").click(function(event) {
        let id = event.target.id.split("_")[1];
        $("body").append(`
            <div class="modal fade" tabindex="-1" id="modal${id}" role="dialog" aria-labelledby="basicModal" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title" id="myModalLabel">Edit Your Chirp</h4>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="form-group">
                                <label for="name">Name</label>
                                <input type="text" id="edit_name_${id}" class="form-control" placeholder="${chirps[id].name}">
                            </div>
                            <div class="form-group">
                                <label for="body">Body</label>
                                <input type="text" id="edit_body_${id}" class="form-control" placeholder="${chirps[id].body}">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary btnEdit" id="edit_btn_${id}" data-dismiss="modal">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        `);
        $(`#modal${id}`).modal("show");
      });
    });
  };
  getChirps();

  let clearChirps = () => {
    $("#cardRow").empty();
    chirps = {};
  };

  $(document).on("click", ".removeBtn", event => {
    let id = event.target.parentNode.parentNode.parentNode.id;
    event.target.parentNode.parentNode.parentNode.remove();
    ajaxCall("DELETE", `/api/chirps/${id}`);
    delete chirps[id];
  });

  $(document).on("click", ".btnEdit", event => {
    let id = event.target.id.split("_")[2];
    let chirp = {
      name: $(`#edit_name_${id}`).val(),
      body: $(`#edit_body_${id}`).val()
    };
    ajaxCall(
      "PUT",
      `/api/chirps/${id}`,
      JSON.stringify(chirp),
      "application/json"
    );
    clearChirps();
    getChirps();
  });

  $("#btnSubmit").click(function() {
    let chirp = {
      name: $("#name").val(),
      body: $("#body").val()
    };
    ajaxCall("POST", "/api/chirps/", JSON.stringify(chirp), "application/json");
    renderChirp(chirp, chirps.nextid);
    chirps[chirps.nextid++] = chirp;
  });
});
