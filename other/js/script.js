// Навигация
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
    nav.classList.toggle('nav-active');
    burger.classList.toggle('toggle');
});

// Проверка клавиши ENTER
function redirectToPage(event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
      // проверка enter.html
      if (window.location.pathname !== '/enter.html') {
        window.location.href = 'enter.html'; // на enter.html
      } 
      else{
        var previousPage = document.referrer;  // получение предыдущего url
        window.location.href = previousPage; // перенаправление на предыдущей url
        }
      }
    }
  
  document.addEventListener('keydown', redirectToPage);

var accordions = document.getElementsByClassName("accordion");
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
  
function applyChanges() {
    const styleContent = document.getElementById('style').value;
    const scriptContent = document.getElementById('script').value;

    // Применение стилей
    let styleElement = document.getElementById('dynamicStyle');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'dynamicStyle';
        document.head.appendChild(styleElement);
    }
    styleElement.innerHTML = styleContent;

    // Применение скриптов
    let scriptElement = document.getElementById('dynamicScript');
    if (scriptElement) {
        scriptElement.remove();
    }
    scriptElement = document.createElement('script');
    scriptElement.id = 'dynamicScript';
    scriptElement.innerHTML = scriptContent;
    document.body.appendChild(scriptElement);
}


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
  'background-image': ['url(...)'],
  'margin': ['0', '5px', '10px', '15px', '20px'],
  'padding': ['0', '5px', '10px', '15px', '20px'],
  'animation': ['none', 'flash 1s linear 2s infinite alternate'],
  'transform': ['none', 'rotate(45deg)', 'scale(1.5)'],
  'visibility': ['visible', 'hidden'],
  'opacity': ['0', '0.5', '1']
};

let container = document.querySelector('.container-box');
let box = document.querySelector('#box');
let input = document.querySelector('#styleInput');
let suggestionBox = document.querySelector('#suggestionBox');

// Функция для позиционирования suggestionBox
function positionSuggestionBox() {
  suggestionBox.style.top = `${input.offsetTop + input.offsetHeight}px`;
  suggestionBox.style.left = `${input.offsetLeft}px`;
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
              suggestionBox.style.display = 'none';
          });
          suggestionBox.appendChild(suggestionItem);
      });
      suggestionBox.style.display = 'block';
  }
}

function handleComplexProperties(prop) {
  input.setAttribute('data-selected-property', prop);
  input.setAttribute('placeholder', `Enter value for ${prop}`);
  suggestionBox.style.display = 'none';
  if (properties[prop]) {
      showSuggestions(prop);
  }
}

function applyStyle(property, value) {
  if (property === 'background-image') {
      box.style.backgroundImage = `url(${value})`;
  } else {
      box.style[property] = value;
  }
  console.log(`Applied ${property}: ${value} to the box`);
}

Object.keys(properties).forEach(function(prop) {
  let element = document.querySelector(`#${prop}`);
  if (element) {
      let distance = getElementDistance(element);
      window.addEventListener('scroll', function() {
          let containerMiddlePos = getElementMiddleY(container);
          if (containerMiddlePos > distance.top && containerMiddlePos < distance.bottom) {
              if (properties[prop].length > 1) {
                  handleComplexProperties(prop);
              } else {
                  input.setAttribute('data-selected-property', prop);
                  input.setAttribute('placeholder', `Enter value for ${prop}`);
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
                      box.style[prop] = ''; // Remove the style
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
            if (containerMiddlePos > distance.top && containerMiddlePos < distance.bottom) {
                if (properties[prop].length > 1) {
                    handleComplexProperties(prop);
                } else {
                    input.setAttribute('data-selected-property', prop);
                    input.setAttribute('placeholder', `Enter value for ${prop}`);
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
                        box.style[prop] = ''; // Remove the style
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
                  box.style[prop] = ''; // Remove the style
              }
              console.log(`Removed ${prop} from the box due to empty input`);
          }
      });
  }
});

