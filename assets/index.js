const d = document,
  $feed = d.querySelector(".feedTweets"),
  $addform = d.querySelector(".commentsForm"),
  $tweetTemplate = d.getElementById("tweetStructure").content,
  $editTemplate = d.getElementById("editForm").content,
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
    $addform.insertAdjacentHTML(
      "afterend",
      `<p><strong>Error ${err.status}: ${message}</strong></p>`
    );
  }
};

d.addEventListener("DOMContentLoad", getTweets());
