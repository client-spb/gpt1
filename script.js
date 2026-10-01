(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const movie = $('movie');
  const speech = $('speech');
  const line = $('line');
  const speaker = $('speaker');
  const hero = $('hero');
  const zina = $('zina');
  const cat = $('cat');
  const drone = $('drone');
  const title = $('titleCard');
  const chapter = $('chapter');
  const scenes = ['room', 'shop', 'space'];
  const DURATION = 555;
  let startedAt = 0;
  let elapsed = 0;
  let running = false;
  let muted = false;
  let raf = 0;
  let timers = [];
  let voice = null;

  const story = [
    [0, 'title', '', '', 8],
    [8, 'room', 'Рассказчик', 'В одном очень обычном доме жил Гена. Гена умел три вещи: лежать, ворчать и находить пульт, на котором уже лежал.', 9],
    [18, 'room', 'Гена', 'Ну и программы пошли… Раньше реклама была душевнее. Там хотя бы колбаса летала.', 8],
    [27, 'room', 'Рассказчик', 'Был вторник. Самый коварный день недели: до выходных далеко, а носки уже закончились.', 9],
    [37, 'room', 'Гена', 'Барсик, переключи канал. Ты молодой, у тебя суставы новые.', 7],
    [45, 'room', 'Барсик', 'Мяу.', 4],
    [50, 'room', 'Рассказчик', 'Но Барсик был профсоюзным котом и после шести лапой не работал.', 8],
    [59, 'room', 'Гена', 'Ладно. Сам справлюсь. Я мужчина самостоятельный… с две тысячи шестого года.', 8],
    [68, 'remote', 'Пульт', 'Внимание! Обнаружен хозяин дивана максимального уровня. Доступно одно желание.', 9],
    [78, 'room', 'Гена', 'О! Сделай, чтобы холодильник сам ко мне приезжал!', 7],
    [86, 'shake', 'Рассказчик', 'Пульт мигнул. Дом вздрогнул. Где-то испуганно звякнула одинокая банка огурцов.', 9],
    [96, 'room', 'Гена', 'Это спецэффекты или опять соседи дрель нашли?', 7],
    [104, 'drone', 'Дрон', 'Доставка отменена. Холодильник отказался: говорит, он не так воспитан.', 9],
    [114, 'room', 'Гена', 'Техника нынче с характером. Ладно, пульт, отправь меня туда, где всё включено!', 9],
    [124, 'portal', 'Пульт', 'Маршрут построен: универсам «У тёти Зины». Там свет включён до двадцати трёх.', 10],
    [135, 'shop', '', '', 4],
    [140, 'shop', 'Гена', 'Э-э… Я вообще-то имел в виду курорт.', 6],
    [147, 'shop', 'Зина', 'Курорт за углом. Там батарея горячая. Брать что будете?', 8],
    [156, 'shop', 'Гена', 'Дайте мне приключение. И двести грамм сыра, только тоненько.', 8],
    [165, 'shop', 'Зина', 'Приключения закончились. Есть гречка по акции и ответственность.', 8],
    [174, 'shop', 'Рассказчик', 'Ответственность Гена не взял. Срок годности показался подозрительно долгим.', 9],
    [184, 'shop', 'Гена', 'Пульт, покажи место, где мужчина — царь природы!', 8],
    [193, 'portal', 'Пульт', 'Запрос уточнён. Ищу территорию без жены, начальника и участкового.', 9],
    [203, 'space', '', '', 4],
    [208, 'space', 'Гена', 'Космос?! А вай-фай тут есть?', 6],
    [215, 'space', 'Пульт', 'Есть. Пароль: восемь нулей. Но сначала надо победить межгалактическую скуку.', 9],
    [225, 'space', 'Рассказчик', 'На далёкой планете триста лет никто не смеялся. Они просто не видели, как Гена надевает бахилы.', 10],
    [236, 'space', 'Гена', 'Сейчас я вам расскажу анекдот. Заходит как-то сантехник в бар…', 7],
    [244, 'space', 'Пульт', 'Осторожно. Этот анекдот запрещён Женевской конвенцией и двумя подъездами.', 9],
    [254, 'space', 'Гена', 'Тогда танец! Я его в санатории освоил. Называется «Поясницу вступило».', 9],
    [264, 'dance', 'Рассказчик', 'Гена танцевал так убедительно, что спутники планеты попросили другую орбиту.', 10],
    [275, 'space', 'Пульт', 'Скука побеждена на четыре процента. Требуется усиление.', 7],
    [283, 'catspace', 'Барсик', 'Мяу.', 5],
    [289, 'space', 'Рассказчик', 'Барсик прилетел следом. Он знал: без кота ни одна цивилизация нормально не развивается.', 10],
    [300, 'space', 'Гена', 'Барсик! Ты как сюда попал?', 6],
    [307, 'space', 'Барсик', 'Мяу-у.', 4],
    [312, 'space', 'Пульт', 'Перевожу с кошачьего: «Ты корм не насыпал, кожаный».', 8],
    [321, 'space', 'Гена', 'Вот и встретились две разумные формы жизни. И пульт.', 7],
    [329, 'alert', 'Пульт', 'Внимание! Заряд батареек — один процент. Домой хватит только одному.', 9],
    [339, 'space', 'Гена', 'Барсик полетит. У него дома миска, дела… и ипотека на когтеточку.', 9],
    [349, 'space', 'Рассказчик', 'Впервые Гена встал с дивана не за едой. Вселенная записала дату.', 9],
    [359, 'space', 'Барсик', 'МЯУ!', 5],
    [365, 'space', 'Пульт', 'Кот отказывается. Предлагает выбросить пользователя и лететь на пульте самому.', 9],
    [375, 'space', 'Гена', 'Справедливо. Но у меня идея: вынем батарейки из моей говорящей открывашки!', 9],
    [385, 'droneSpace', 'Дрон', 'Я не открывашка. Я специалист по пенным технологиям!', 8],
    [394, 'space', 'Рассказчик', 'Дрон обиделся, но батарейки отдал. Потому что настоящий специалист сначала спасает экипаж.', 10],
    [405, 'portal', 'Пульт', 'Энергия восстановлена. Домой: к тапочкам и неоплаченным квитанциям!', 9],
    [415, 'room', '', '', 4],
    [420, 'room', 'Гена', 'Фух. Никаких больше желаний. Только тихий вечер и футбол.', 8],
    [429, 'room', 'Телевизор', 'А сейчас документальный фильм: «Ответственность. Путь взрослого человека».', 9],
    [439, 'room', 'Гена', 'Пульт! Переключи!', 6],
    [446, 'room', 'Пульт', 'Батарейки разряжены. Попробуйте встать и нажать кнопку на телевизоре.', 9],
    [456, 'room', 'Рассказчик', 'До телевизора было четыре шага. Гена смотрел в бездну. Бездна показывала документальный фильм.', 10],
    [467, 'room', 'Гена', 'Барсик… Мы же команда?', 6],
    [474, 'room', 'Барсик', 'Мяу.', 4],
    [479, 'catTv', 'Рассказчик', 'Кот подошёл к телевизору — и сел прямо перед экраном. Это была его цена за спасение мира.', 10],
    [490, 'night', 'Гена', 'Знаешь, Барсик… Хорошо дома. Даже когда ничего не включено.', 9],
    [500, 'night', 'Рассказчик', 'С тех пор Гена берёг пульт, кота и последние две батарейки.', 9],
    [510, 'night', 'Дрон', 'А меня кто-нибудь с потолка снимет?', 7],
    [518, 'room', 'Гена', 'Завтра. Сегодня я уже герой.', 7],
    [526, 'finale', 'Рассказчик', 'Так закончился великий вторник. А среда началась с поисков второго тапка.', 10],
    [538, 'credits', '', '', 17]
  ];

  function chooseVoice() {
    const voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    voice = voices.find(v => /^ru/i.test(v.lang)) || voices[0] || null;
  }
  chooseVoice();
  if (window.speechSynthesis) speechSynthesis.onvoiceschanged = chooseVoice;

  function narrate(text, who) {
    if (muted || !text || !window.speechSynthesis) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ru-RU'; u.voice = voice; u.rate = who === 'Рассказчик' ? .92 : 1; u.pitch = who === 'Барсик' ? 1.7 : who === 'Пульт' ? .75 : 1;
    speechSynthesis.speak(u);
  }

  function resetActors() {
    hero.className = 'person gena'; hero.style.left = '24%'; hero.style.opacity = '1';
    zina.style.opacity = '0'; cat.style.left = '60%'; cat.style.opacity = '1'; cat.style.transform = '';
    drone.style.opacity = '0'; drone.style.left = '70%'; drone.style.top = '17%';
    movie.classList.remove('night', 'shake', 'zoom');
  }
  function showSet(name) { scenes.forEach(s => $(s).style.opacity = s === name ? '1' : '0'); }
  function action(type) {
    hero.classList.remove('talk', 'wave', 'bounce');
    if (type === 'title') { title.style.opacity = '1'; setTimeout(() => title.style.opacity = '0', 7200); return; }
    title.style.opacity = '0';
    if (type === 'shop') { showSet('shop'); hero.style.left = '24%'; zina.style.opacity = '1'; cat.style.opacity = '0'; }
    else if (type === 'space' || type === 'dance' || type === 'catspace' || type === 'alert' || type === 'droneSpace') { showSet('space'); zina.style.opacity = '0'; if(type !== 'catspace') cat.style.opacity = type === 'space' && elapsed > 285 ? '1' : '0'; }
    else { showSet('room'); zina.style.opacity = '0'; cat.style.opacity = '1'; }
    if (type === 'remote') { $('remote').classList.add('bounce'); setTimeout(()=>$('remote').classList.remove('bounce'),2500); }
    if (type === 'shake' || type === 'alert') { movie.classList.add('shake'); setTimeout(()=>movie.classList.remove('shake'),1800); }
    if (type === 'portal') { showSet(elapsed < 200 ? 'shop' : elapsed < 414 ? 'space' : 'room'); movie.classList.add('zoom'); setTimeout(()=>movie.classList.remove('zoom'),1800); }
    if (type === 'drone' || type === 'droneSpace') drone.style.opacity = '1';
    if (type === 'dance') hero.classList.add('bounce', 'wave');
    if (type === 'catspace') { cat.style.opacity='1'; cat.style.left='48%'; cat.classList.add('bounce'); }
    if (type === 'catTv') { cat.style.left='77%'; cat.style.transform='scale(1.3)'; }
    if (type === 'night') movie.classList.add('night');
    if (type === 'finale') { movie.classList.add('night'); hero.classList.add('wave'); }
    if (type === 'credits') {
      title.querySelector('.eyebrow').textContent = 'создано на диване';
      title.querySelector('h1').innerHTML = 'ГЕНА & БАРСИК<br><em>вернутся после обеда</em>';
      title.querySelector('p').textContent = 'в ролях: пульт, кот и одна ответственная батарейка';
      title.style.opacity = '1';
    }
  }

  function cue(item) {
    const [, type, who, text, hold] = item;
    action(type);
    chapter.textContent = elapsed < 135 ? 'ГЛАВА I · ДИВАН' : elapsed < 203 ? 'ГЛАВА II · МАГАЗИН' : elapsed < 415 ? 'ГЛАВА III · КОСМОС' : 'ГЛАВА IV · ДОМА';
    chapter.style.opacity = text ? '.8' : '0';
    speaker.textContent = who; line.textContent = text;
    speech.classList.toggle('show', Boolean(text));
    if (who === 'Гена') hero.classList.add('talk');
    if (who === 'Зина') zina.classList.add('talk'); else zina.classList.remove('talk');
    narrate(text, who);
    timers.push(setTimeout(() => speech.classList.remove('show'), Math.min(hold * 1000 - 500, 9000)));
  }

  function tick(now) {
    if (!running) return;
    elapsed = (now - startedAt) / 1000;
    $('progress').firstElementChild.style.width = `${Math.min(100, elapsed / DURATION * 100)}%`;
    if (elapsed >= DURATION) return finish();
    raf = requestAnimationFrame(tick);
  }
  function start() {
    timers.forEach(clearTimeout); timers = []; resetActors(); elapsed = 0; running = true;
    $('start').classList.add('hidden'); $('end').classList.add('hidden'); $('sound').classList.remove('hidden');
    story.forEach(item => timers.push(setTimeout(() => cue(item), item[0] * 1000)));
    startedAt = performance.now(); raf = requestAnimationFrame(tick);
  }
  function finish() {
    if (!running) return; running = false; cancelAnimationFrame(raf); timers.forEach(clearTimeout); timers=[];
    if (window.speechSynthesis) speechSynthesis.cancel(); speech.classList.remove('show'); $('end').classList.remove('hidden');
  }
  $('play').addEventListener('click', start); $('replay').addEventListener('click', start);
  $('sound').addEventListener('click', () => { muted = !muted; $('sound').textContent = muted ? '🔇' : '🔊'; $('sound').setAttribute('aria-label', muted ? 'Включить звук' : 'Выключить звук'); if(muted && window.speechSynthesis) speechSynthesis.cancel(); });
})();
