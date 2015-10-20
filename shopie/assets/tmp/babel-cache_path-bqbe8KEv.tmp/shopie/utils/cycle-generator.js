var cycleGenerator = regeneratorRuntime.mark(function cycleGenerator(iterable) {
    var saved, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, item, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2;

    return regeneratorRuntime.wrap(function cycleGenerator$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                saved = [];
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                context$1$0.prev = 4;
                _iterator = iterable[Symbol.iterator]();

            case 6:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                    context$1$0.next = 14;
                    break;
                }

                item = _step.value;
                context$1$0.next = 10;
                return item;

            case 10:
                saved.push(item);

            case 11:
                _iteratorNormalCompletion = true;
                context$1$0.next = 6;
                break;

            case 14:
                context$1$0.next = 20;
                break;

            case 16:
                context$1$0.prev = 16;
                context$1$0.t0 = context$1$0["catch"](4);
                _didIteratorError = true;
                _iteratorError = context$1$0.t0;

            case 20:
                context$1$0.prev = 20;
                context$1$0.prev = 21;

                if (!_iteratorNormalCompletion && _iterator["return"]) {
                    _iterator["return"]();
                }

            case 23:
                context$1$0.prev = 23;

                if (!_didIteratorError) {
                    context$1$0.next = 26;
                    break;
                }

                throw _iteratorError;

            case 26:
                return context$1$0.finish(23);

            case 27:
                return context$1$0.finish(20);

            case 28:
                if (!(saved.length > 0)) {
                    context$1$0.next = 57;
                    break;
                }

                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                context$1$0.prev = 32;
                _iterator2 = saved[Symbol.iterator]();

            case 34:
                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                    context$1$0.next = 41;
                    break;
                }

                item = _step2.value;
                context$1$0.next = 38;
                return item;

            case 38:
                _iteratorNormalCompletion2 = true;
                context$1$0.next = 34;
                break;

            case 41:
                context$1$0.next = 47;
                break;

            case 43:
                context$1$0.prev = 43;
                context$1$0.t1 = context$1$0["catch"](32);
                _didIteratorError2 = true;
                _iteratorError2 = context$1$0.t1;

            case 47:
                context$1$0.prev = 47;
                context$1$0.prev = 48;

                if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                    _iterator2["return"]();
                }

            case 50:
                context$1$0.prev = 50;

                if (!_didIteratorError2) {
                    context$1$0.next = 53;
                    break;
                }

                throw _iteratorError2;

            case 53:
                return context$1$0.finish(50);

            case 54:
                return context$1$0.finish(47);

            case 55:
                context$1$0.next = 28;
                break;

            case 57:
            case "end":
                return context$1$0.stop();
        }
    }, cycleGenerator, this, [[4, 16, 20, 28], [21,, 23, 27], [32, 43, 47, 55], [48,, 50, 54]]);
});

export default cycleGenerator;