const d = document,
  $feed = d.querySelector(".feedTweets"),
  $title = d.querySelector(".title"),
  $form = d.querySelector(".commentsForm"),
  $tweetTemplate = d.getElementById("tweetStructure").content,
  $fragment = d.createDocumentFragment();

const getTweets = async () => {
  try {
    let res = await fetch("http://localhost:3000/tweets"),
      json = await res.json();

    if (!res.ok) throw { status: res.status, statusText: res.statusText };
    //console.log(json);
    json.forEach((el) => {
      $tweetTemplate.querySelector(".tweet__wrapper__avatar").src = el.image;
      $tweetTemplate.querySelector(".tweet__wrapper__user").textContent =
        el.user;
      $tweetTemplate.querySelector(".tweet__comment").textContent = el.tweet;
      $tweetTemplate.querySelector(".tweet__editButton").dataset.id = el.id;
      $tweetTemplate.querySelector(".tweet__editButton").dataset.user = el.user;
      $tweetTemplate.querySelector(".tweet__editButton").dataset.tweet =
        el.tweet;
      $tweetTemplate.querySelector(".tweet__deleteButton").dataset.id = el.id;
      let $clone = d.importNode($tweetTemplate, true);
      $fragment.appendChild($clone);
    });
    //console.log($fragment);

    $feed.appendChild($fragment);
  } catch (err) {
    let message = err.statusText || "Ocurrió un error";
    $feed.insertAdjacentHTML(
      "afterend",
      `<p class="errorMsg"><strong>Error ${err.status}: ${message}</strong></p>`
    );
  }
};

d.addEventListener("DOMContentLoad", getTweets());

d.addEventListener("submit", async (e) => {
  if (e.target === $form) {
    e.preventDefault();

    if (!e.target.id.value) {
      //create POST
      try {
        let options = {
            method: "POST",
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify({
              user: e.target.user.value,
              tweet: e.target.comment.value,
              image: "https://i.pravatar.cc/80",
            }),
          },
          res = await fetch("http://localhost:3000/tweets", options),
          json = await res.json();
        console.log(json);

        if (!res.ok) throw { status: res.status, statusText: res.statusText };

        location.reload();
      } catch (err) {
        let message = err.statusText || "Ocurrió un error";
        $form.insertAdjacentHTML(
          "afterend",
          `<p class="errorMsg"><strong>Error ${err.status}: ${message}</strong></p>`
        );
      }
    } else {
      //update PUT
      try {
        let options = {
            method: "PUT",
            headers: { "Content-Type": "application/json;charset=UTF-8" },

            body: JSON.stringify({
              user: e.target.user.value,
              tweet: e.target.comment.value,
              image: "https://i.pravatar.cc/80",
            }),
          },
          res = await fetch(
            `http://localhost:3000/tweets/${e.target.id.value}`,
            options
          ),
          json = await res.json();

        if (!res.ok) throw { status: res.status, statusText: res.statusText };

        location.reload();
      } catch (err) {
        let message = err.statusText || "Ocurrió un error";
        $form.insertAdjacentHTML(
          "afterend",
          `<p class="errorMsg"><strong>Error ${err.status}: ${message}</strong></p>`
        );
      }
    }
  }
});

d.addEventListener("click", async (e) => {
  if (e.target.matches(".tweet__editButton")) {
    console.log("hice click");
    $title.textContent = "Editar comentario";
    $form.user.value = e.target.dataset.user;
    $form.comment.value = e.target.dataset.tweet;
    $form.id.value = e.target.dataset.id;
  }

  if (e.target.matches(".tweet__deleteButton")) {
    let isDelete = confirm(
      `¿Estás seguro de eliminar el comentario número ${e.target.dataset.id}?`
    );

    if (isDelete)
      //Delete DELETE
      try {
        let options = {
            method: "DELETE",
            headers: { "Content-Type": "application/json;charset=UTF-8" },
          },
          res = await fetch(
            `http://localhost:3000/tweets/${e.target.dataset.id}`,
            options
          ),
          json = await res.json();

        if (!res.ok) throw { status: res.status, statusText: res.statusText };

        location.reload();
      } catch (err) {
        let message = err.statusText || "Ocurrió un error";
        alert(`Error ${err.status}: ${message}`);
      }
  }
});
