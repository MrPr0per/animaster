addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });
    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().resetFadeIn(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
        });
    document.getElementById('fadeOutReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().resetFadeOut(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {x: 100, y: 10});
        });
    document.getElementById('moveReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().resetMoveAndScale(block);
        });


    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });
    document.getElementById('scaleReset')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().resetMoveAndScale(block);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 1000);
        });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().resetMoveAndScale(block);
            animaster().fadeIn(block, 0);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 1000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            block.stopObj = animaster().heartBeating(block);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            if (block.stopObj) {
                block.stopObj.stop();
            }
        });
}

function animaster() {
    const animationObject = {
        _steps: [], // массив шагов анимации

        fadeIn,
        resetFadeIn,
        fadeOut,
        resetFadeOut,
        move,
        scale,
        resetMoveAndScale,
        moveAndHide,
        showAndHide,
        heartBeating,
    }
    animationObject.addMove = addMove.bind(animationObject)
    animationObject.addScale = addScale.bind(animationObject)
    animationObject.play = play.bind(animationObject)
    animationObject.addFadeIn = addFadeIn.bind(animationObject)
    animationObject.addFadeOut = addFadeOut.bind(animationObject)
    return animationObject;

    /**
     * Блок плавно появляется из прозрачного.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    function fadeIn(element, duration) {
        this.addFadeIn(duration).play(element);
    }

    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    /**
     * Блок плавно появляется из прозрачного.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    function fadeOut(element, duration) {
        this.addFadeOut(duration).play(element);
    }

    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    /**
     * Функция, передвигающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param translation — объект с полями x и y, обозначающими смещение блока
     */
    function move(element, duration, translation) {
        this.addMove(duration, translation).play(element);
    }

    /**
     * Функция, увеличивающая/уменьшающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
     */
    function scale(element, duration, ratio) {
        this.addScale(duration, ratio).play(element);
    }

    function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = getTransform(null, null);
    }

    /**
     * moveAndHide — блок должен одновременно сдвигаться на 100 пикселей вправо и на 20 вниз, а потом исчезать.
     * Метод на вход должен принимать продолжительность анимации.
     * При этом 2/5 времени блок двигается, 3/5 — исчезает.
     */
    function moveAndHide(element, duration) {
        move(element, duration * 2 / 5, {x: 100, y: 20});
        setTimeout(() => fadeOut(element, duration * 3 / 5), duration * 2 / 5);
    }

    /**
     *showAndHide — блок должен появиться, подождать и исчезнуть.
     * Каждый шаг анимации длится 1/3 от времени, переданного аргументом в функцию.
     */
    function showAndHide(element, duration) {
        fadeIn(element, duration / 3);
        setTimeout(() => fadeOut(element, duration / 3), duration / 3);
    }

    /**
     * heartBeating — имитация сердцебиения.
     * Сначала элемент должен увеличиться в 1,4 раза, потом обратно к 1.
     * Каждый шаг анимации занимает 0,5 секунды.
     * Анимация должна повторяться бесконечно.
     */
    function heartBeating(element) {
        let id = setInterval(() => {
            scale(element, 500, 1.4)
            setTimeout(() => scale(element, 500, 1), 500);
        }, 1000);
        return {
            stop() {
                clearTimeout(id);
            }
        }
    }

    function addFadeIn(duration) {
        this._steps.push({
            name: 'fadeIn',
            duration,
            action: (element) => {
                element.style.transitionDuration = `${duration}ms`;
                element.classList.remove('hide');
                element.classList.add('show');
            }
        });
        return this;
    }

    function addFadeOut(duration) {
        this._steps.push({
            name: 'fadeOut',
            duration,
            action: (element) => {
                element.style.transitionDuration = `${duration}ms`;
                element.classList.remove('show');
                element.classList.add('hide');
            }
        });
        return this;
    }

    function addMove(duration, translation) {
        this._steps.push({
            name: 'move',
            duration,
            action: (element) => {
                element.style.transitionDuration = `${duration}ms`;
                element.style.transform = getTransform(translation, null);
            }
        });
        return this;
    }

    function addScale(duration, ratio) {
        this._steps.push({
            name: 'scale',
            duration,
            action: (element) => {
                element.style.transitionDuration = `${duration}ms`;
                element.style.transform = getTransform(null, ratio);
            }
        });
        return this;
    }

    function play(element) {
        let actionObject = this._steps.shift();
        actionObject.action(element);
        setTimeout(() => {
            if (this._steps.length > 0) {
                this.play(element)
            }
        }, actionObject.duration)
    }
}

function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}
