import { movies } from "../module/db.js";

let ul = document.querySelector(".promo__interactive-list");
let modal = document.querySelector(".modal");
let modal_bg = document.querySelector(".modal_bg");
let search = document.querySelector("#search");

let button = document.querySelector(".bu");

let load = document.querySelector('.load')
let promo = document.querySelector(".promo");
let promo__content = promo.querySelector(".promo__content");
let promo__bg = promo__content.querySelector(".promo__bg");
let genres = document.querySelector(".genres");
let genresArr = ["all"];

search.onkeyup = () => {
  let filtered = movies.filter((item) =>
    item.Title.toLowerCase().includes(search.value.toLowerCase().trim())
  );
  change_menu_janrda(filtered[0])
  reload(filtered);
};

reload(movies);

function reload(arr) {
  ul.innerHTML = "";
  for (let item of arr) {

    genresArr.push(item.genres);
    let li = document.createElement("li");
    let del = document.createElement("div");

    li.classList.add("promo__interactive-item");
    del.classList.add("delete");

    del.onclick = () => {
      li.innerHTML = ""
      closeModal();
    };

    li.innerHTML = movies.indexOf(item) + 1 + "." + item.Title;

    ul.append(li);
    li.append(del);

    li.onclick = () => {
      openModal(item);
    };

  }
}

function openModal(data) {
  setData(data);
  modal.style.display = "flex";
  modal_bg.style.display = "block";

  setTimeout(() => {
    modal.style.opacity = "1";
    modal.style.transform = "translate(-50%, -50%) scale(1)";
    modal_bg.style.opacity = "1";
  }, 300);
}
function closeModal() {
  modal.style.transform = "translate(-50%, -50%) scale(.2)";
  modal.style.opacity = "0";
  modal_bg.style.opacity = "0";

  setTimeout(() => {
    modal.style.display = "none";
    modal_bg.style.display = "none";
  }, 300);
}

function setData(data) {
  let h1 = modal.querySelector("h1");
  let h2 = modal.querySelector("h2");
  let h3 = modal.querySelector("h3");
  let p = modal.querySelector("p");
  let rating = modal.querySelector(".rating");
  let img_star = modal.querySelector(".img_star");
  let img = modal.querySelector("img");

  h1.innerHTML = data.Title;
  h2.innerHTML = data.Year;
  h3.innerHTML = data.Genre;
  p.innerHTML = data.Plot;
  rating.innerHTML = data.imdbRating;
  img.src = data.Poster;
  img_star.src = './icons/iconmonstr-star-3.svg'

  //Запомни Функцию Рейтинг Понадобится Начало
  //rating Не забудь
  let ratings = document.querySelectorAll('.rating_set');

  if (ratings.length > 0) {
    initRatings();
  }
  //Основная функция
  function initRatings() {
    let ratingActive, ratingValue;
    //"Бегаем" по всем рейтингам на странице
    for (let index = 0; index < ratings.length; index++) {
      const rating = ratings[index];
      initRating(rating);
    }
    //Инициализируем кокретный рейтинг 
    function initRating(rating) {
      initRatingVars(rating)

      setRatingActiveWidth()

      if (rating.classList.contains('rating_conf')) {
        setRating(rating)
      }
    }
    //Инициализация переменных
    function initRatingVars(rating) {
      ratingActive = rating.querySelector('.rating_active')
      ratingValue = rating.querySelector('.rating')
    }

    //Изменяем ширину активных звезд
    function setRatingActiveWidth(index = data.imdbRating) {
      let ratingActiveWidth = index / 0.10;
      ratingActive.style.width = `${ratingActiveWidth}%`
    }
    //Возможность указать оценку
    function setRating(rating) {
      let ratingItems = document.querySelectorAll('.rating_item')
      for (let index = 0; index < ratingItems.length; index++) {
        const ratingItem = ratingItems[index];
        ratingItem.addEventListener("mouseenter", function (e) {
          //обновление переменных
          initRatingVars(rating);
          //Обновление активных звезд
          setRatingActiveWidth(ratingItem.value)
        })
        ratingItem.addEventListener("mouseleave", function (e) {
          //Обновление активных звезд
          setRatingActiveWidth()
        })
        ratingItem.addEventListener("click", function (e) {
          //Обновление переменных
          initRatingVars(rating)

          if (rating.dataset.ajax) {
            //"Отправить" на сервер
            setRatingValue(ratingItem.value, rating)
          } else {
            rating.classList.add('rating_sending');
            // window.location.href = './icons/load.svg'

            load.classList.add('load_act');
            //Отобразить указанную оценку
            setTimeout(() => {
              ratingValue.innerHTML = index * 2.5;
              data.imdbRating = index * 2.5;
              setRatingActiveWidth();
              load.classList.remove('load_act');
              setTimeout(() => {
                rating.classList.remove('rating_sending');
              }, 800);
            }, 1200)

          }
        })

      }
    }
  }
  // //Синхронизация с сервером обновление данных
  // async function setRatingValue(value, rating) {
  //   if (!rating.classList.contains('rating_sending')) {
  //     rating.classList.add('rating_sending');

  //     //отправка данных (value) на сервер
  //     let response = await fetch('rating.json', {
  //       method: 'GET',

  //       //body: JSON.stringify({
  //       // userRating: value
  //       // })
  //       //headers: {
  //       //'content-type': 'application/json'
  //       //}
  //     })
  //     if (response.ok) {
  //       let result = await response.json();

  //       //Получаем новый рейтинг
  //       let newRating = result.newRating;

  //       //Вывод нового среднего результата
  //       ratingValue.innerHTML = newRating;

  //       //Обновление активных звезд
  //       setRatingActiveWidth();

  //       rating.classList.remove('rating_sending')
  //     }else{
  //       alert('Ошибка')

  //       rating.classList.remove('rating_sending')
  //     }

  //   }
  // }

  // }

  //Конец Функции

}

document.onkeydown = function (evt) {
  evt = evt || window.event;
  if (evt.keyCode == 27) {
    closeModal();
  }
};

button.onclick = () => {
  closeModal();
};
genresArr = [...new Set(genresArr)];

for (let item of genresArr) {
  let li = document.createElement("li");
  let a = document.createElement("a");

  if (genresArr.indexOf(item) == 0) {
    a.classList.add("promo__menu-item_active");
  }
  a.setAttribute("id", item.Id);
  a.classList.add("promo__menu-item");
  a.innerHTML = item;
  a.style.textTransform = "capitalize";

  li.append(a);
  genres.append(li);
}

let a_genre = document.querySelectorAll(".promo__menu-item");

a_genre.forEach((element) => {
  element.onclick = () => {
    a_genre.forEach((item) => item.classList.remove("promo__menu-item_active"));
    element.classList.add("promo__menu-item_active");
    searchByGenre(element.innerHTML);
  };
});

let searchByGenre = (genre) => {
  let filtered = movies.filter(item => item.genres.toLowerCase() === genre.toLowerCase().trim())
  reload(filtered)
  change_menu_janrda(filtered[0])
};

let promo__genre = document.querySelector('.promo__genre')
let promo__title = document.querySelector('.promo__title')
let promo__descr = document.querySelector('.promo__descr')

let imdb = document.querySelector('.imdb')
let reserch = document.querySelector('.reserch')

let change_menu_janrda = (param) => {
  promo__bg.style.backgroundImage = `url("${param.img}")`

  promo__genre.innerHTML = `${param.genres};`
  promo__title.innerHTML = `${param.Title};`
  imdb.innerHTML = `IMDb: ${param.imdbRating}`
  promo__descr.innerHTML = param.Plot.slice(0, 88)
  reserch.innerHTML = `Кинопоиск: ${param.Metascore}`
}
let body = document.querySelector('body')
let set_reklam = document.querySelectorAll('.set_reklam')

let blc_cont_reklam = document.createElement('div')
blc_cont_reklam.classList.add('blc_cont_reklam')

let title_reklam = document.createElement('h1')
title_reklam.innerHTML = '404 <br> NOT FOUND'

let text_reklam = document.createElement('p')
text_reklam.innerHTML = 'Ошиблись Адресом'

title_reklam.classList.add('title_reklam')
text_reklam.classList.add('text_reklam')

body.append(blc_cont_reklam)
blc_cont_reklam.append(title_reklam, text_reklam)

for (let item of set_reklam) {
  item.onclick = () => {
    blc_cont_reklam.classList.add('act_rek')
  }
}
blc_cont_reklam.onclick = () => {
  blc_cont_reklam.classList.remove('act_rek')
}

