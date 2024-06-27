const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navigation = document.querySelector('.navigation')
const sandbox = document.querySelector('.sandbox')
const accordions = document.getElementsByClassName("accordion");

let container = document.querySelector('.container-box');
let box = document.querySelector('#box');
let input = document.querySelector('#styleInput');
let suggestionBox = document.querySelector('#suggestionBox');

let mybutton = document.getElementById("scrollTopBtn");




// Навигация
if(navigation){
  burger.addEventListener('click', () => {
    nav.classList.toggle('nav-active');
    burger.classList.toggle('toggle');
  });
}

if(accordions){
  for (var i = 0; i < accordions.length; i++) {
    accordions[i].onclick = function() {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    };
  }
}

if(input){
  const properties = {
    'color': ['red', 'blue', 'green', 'yellow', 'black', 'white'],
    'font-size': ['12px', '14px', '16px', '18px', '20px', '24px'],
    'font-weight': ['normal', 'bold', 'bolder', 'lighter'],
    'line-height': ['normal', '1', '1.5', '2'],
    'text-decoration': ['none', 'underline', 'overline', 'line-through'],
    'text-align': ['left', 'right', 'center', 'justify'],
    'font-style': ['normal', 'italic', 'oblique'],
    'font-family': ['Arial', 'Verdana', 'Times New Roman', 'Georgia'],
    'filter': ['none', 'blur(5px)', 'brightness(0.5)', 'contrast(200%)'],
    'border-radius': ['0', '5px', '10px', '15px', '50%'],
    'width': ['auto', '100px', '200px', '50%'],
    'height': ['auto', '100px', '200px', '50%'],
    'min-height': ['100px', '200px', '50%'],
    'min-width': ['100px', '200px', '50%'],
    'max-width': ['100px', '200px', '50%'],
    'max-height': ['100px', '200px', '50%'],
    'background-color': ['red', 'blue', 'green', 'yellow', 'black', 'white'],
    'background-image': ['Введите ссылку'],
    'margin': ['0', '5px', '10px', '15px', '20px'],
    'padding': ['0', '5px', '10px', '15px', '20px'],
    'position':['0'],
    'pseudo-classes': ['0'],
    'pseudo-elements':['0'],
    'flexbox': ['flex-direction: row', 'justify-content: center', 'align-items: center'],
    'animation': ['none', 'flash 1s linear 2s infinite alternate'],
    'transform': ['none', 'rotate(45deg)', 'scale(1.5)'],
    'visibility': ['visible', 'hidden'],
    'opacity': ['0', '0.5', '1']
  };

  // Функция для позиционирования suggestionBox
  function positionSuggestionBox() {
    suggestionBox.style.top = `${input.offsetTop + input.offsetHeight}px`;
    suggestionBox.style.right = `${input.offsetRight}px`;
  }

  function getElementDistance(element) {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const elementTop = rect.top + scrollTop;
    const elementBottom = elementTop + rect.height;
    return { top: elementTop, bottom: elementBottom };
  }

  function getElementMiddleY(element) {
    var rect = element.getBoundingClientRect();
    return rect.top + window.pageYOffset + (rect.height / 2);
  }

  function showSuggestions(property) {
    suggestionBox.innerHTML = '';
    if (properties[property]) {
      properties[property].forEach(value => {
        let suggestionItem = document.createElement('div');
        suggestionItem.textContent = value;
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.addEventListener('click', () => {
          input.value = value;
          applyStyle(property, value);
        });
        suggestionBox.appendChild(suggestionItem);
      });
      suggestionBox.style.display = 'block';
    }
  }

  function handleComplexProperties(prop) {
    input.setAttribute('data-selected-property', prop);
    input.setAttribute('placeholder', `Значение ${prop}`);
    if (properties[prop]) {
      showSuggestions(prop);
    }
  }

  function applyStyle(property, value) {
    if (property === 'background-image') {
      box.style.backgroundImage = `url(${value})`;
    } else {
      box.style[property] = value
    }
    console.log(`Applied ${property}: ${value} to the box`);
  }

  Object.keys(properties).forEach(function(prop) {
    let element = document.querySelector(`#${prop}`);
    if (element) {
      let distance = getElementDistance(element);
      window.addEventListener('scroll', function() {
        let containerMiddlePos = getElementMiddleY(container);
        // Проверяем находится ли контейнер посередине flexbox, position, pseudo-classes, pseudo-elements
        if (containerMiddlePos > distance.top && containerMiddlePos < distance.bottom &&
          (prop === 'flexbox' || prop === 'position' || prop === 'pseudo-classes' || prop === 'pseudo-elements')) {
          input.setAttribute('placeholder', 'Выбрано сложное свойство');
          suggestionBox.style.display = 'none';
        } else if (containerMiddlePos > distance.top && containerMiddlePos < distance.bottom) {
          if (properties[prop].length > 1) {
            handleComplexProperties(prop);
          } else {
            input.setAttribute('data-selected-property', prop);
            input.setAttribute('placeholder', `Значение ${prop}`);
            positionSuggestionBox(); // Позиционируем suggestionBox
            showSuggestions(prop);
          }
          let styleValue = input.value;
          let selectedProperty = input.getAttribute('data-selected-property');
          if (Object.keys(properties).includes(selectedProperty) && styleValue) {
            applyStyle(selectedProperty, styleValue);
          }
        } else {
          if (Object.keys(properties).includes(prop)) {
            if (prop === 'background-image') {
              box.style.backgroundImage = '';
            } else {
              box.style[prop] = ''; // Удаляем стиль
            }
            console.log(`Removed ${prop} from the box`);
          }
        }
      });
    }
  });

  // Обновляем позицию suggestionBox при изменении размеров окна
  window.addEventListener('resize', positionSuggestionBox);

  Object.keys(properties).forEach(function(prop) {
      let element = document.querySelector(`#${prop}`);
      if (element) {
        let distance = getElementDistance(element);
        window.addEventListener('input', function() {
          let containerMiddlePos = getElementMiddleY(container);
          // Проверяем находится ли контейнер посередине flexbox, position, pseudo-classes, pseudo-elements
          if (containerMiddlePos > distance.top && containerMiddlePos < distance.bottom &&
            (prop === 'flexbox' || prop === 'position' || prop === 'pseudo-classes' || prop === 'pseudo-elements')) {
            input.setAttribute('placeholder', 'Выбрано сложное свойство');
            suggestionBox.style.display = 'none';
          } else if (containerMiddlePos > distance.top && containerMiddlePos < distance.bottom) {
            if (properties[prop].length > 1) {
              handleComplexProperties(prop);
            } else {
              input.setAttribute('data-selected-property', prop);
              input.setAttribute('placeholder', `Значение ${prop}`);
              positionSuggestionBox(); // Позиционируем suggestionBox
              showSuggestions(prop);
            }
            let styleValue = input.value;
            let selectedProperty = input.getAttribute('data-selected-property');
            if (Object.keys(properties).includes(selectedProperty) && styleValue) {
              applyStyle(selectedProperty, styleValue);
            }
          } else {
            if (Object.keys(properties).includes(prop)) {
              if (prop === 'background-image') {
                box.style.backgroundImage = '';
              } else {
                box.style[prop] = ''; // Удаляем стиль
              }
              console.log(`Removed ${prop} from the box`);
            }
          }
        });
      }
    });

  input.addEventListener("input", () => {
    if (input.value === '') {
      Object.keys(properties).forEach(prop => {
        if (box.style[prop]) {
          if (prop === 'background-image') {
            box.style.backgroundImage = '';
          } else {
            box.style[prop] = ''; // Удаляем стиль
          }
          console.log(`Removed ${prop} from the box due to empty input`);
        }
      });
    }
  });
}
if(sandbox){
  function applyChanges() {
    const styleContent = document.getElementById('style').value;

    // Применение стилей
    let styleElement = document.getElementById('dynamicStyle');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'dynamicStyle';
        document.head.appendChild(styleElement);
    }
    styleElement.innerHTML = styleContent;
  }

    function redirectToPage(event) {
      if (event.key === 'Shift' && event.location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT) {
        var previousPage = document.referrer;  // получение предыдущего url
        window.location.href = previousPage; // перенаправление на предыдущий url
      }
  }

  function applyScript() {
    const scriptContent = document.getElementById('script').value;

    // Удаление предыдущего скрипта, если он существует
    let scriptElement = document.getElementById('dynamicScript');
    if (scriptElement) {
      document.body.removeChild(scriptElement);
    }

    // Создание нового скрипта
    scriptElement = document.createElement('script');
    scriptElement.id = 'dynamicScript';
    scriptElement.innerHTML = scriptContent;
    document.body.appendChild(scriptElement);
  }

  document.addEventListener('keydown', redirectToPage);
}

if(mybutton){
  // Функция показа кнопки при прокрутке вниз
  window.onscroll = function() {
      scrollFunction();
  };

  function scrollFunction() {
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
          mybutton.style.display = "block";
      } else {
          mybutton.style.display = "none";
      }
  }

  // Функция прокрутки наверх
  function topFunction() {
      document.body.scrollTop = 0; // Для Safari
      document.documentElement.scrollTop = 0; // Для Chrome, Firefox, IE и Opera
  }
}