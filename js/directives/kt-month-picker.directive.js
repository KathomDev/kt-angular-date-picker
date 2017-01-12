(function () {
  'use strict';

  angular.module('kt.datePicker')

    .directive('ktMonthPicker', ['ktDateBoundsService', function (ktDateBounds) {
      var months;

      function getMonths() {
        if (!months) {
          months = [];
          for (var i = 0; i < 12; i++) {
            months.push(i);
          }
        }

        return months;
      }

      function getDateWithinBounds(date, minDate, maxDate) {
        var dateWithinBounds = ktDateBounds.getDateWithinBounds(date, minDate, maxDate, 'day', '[]');
      }

      return {
        restrict   : 'E',
        scope      : {
          date   : '=',
          minDate: '=',
          maxDate: '='
        },
        templateUrl: 'html/kt-month-picker.html',
        link       : function (scope) {
          scope.monthPicker = {
            year  : scope.date ? scope.date.year : moment().clone().year(),
            months: getMonths()
          };

          scope.date = ktDateBounds.getDateWithinBounds(scope.date, scope.minDate, scope.maxDate, 'month', '[]');

          scope.$watch('date', function (date) {
            scope.monthPicker.year = date.year();
          }, true);

          scope.isSelected = function (month) {
            return scope.date.year() === scope.monthPicker.year && scope.date.month() === month;
          };

          scope.isInMinMaxRange = function (month) {
            var date = moment().clone().year(scope.monthPicker.year).month(month);
            return ktDateBounds.isDateWithinBounds(date, scope.minDate, scope.maxDate, 'month', '[]');
          };

          scope.selectMonth = function (month) {
            var date = ktDateBounds.getDateWithinBounds(
              scope.date.clone().year(scope.monthPicker.year).month(month), scope.minDate, scope.maxDate, 'day', [], 'month'
            );

            scope.date.year(date.year()).month(date.month()).date(date.date());

            var parentElement = scope.$parent.element ? scope.$parent.element : undefined;

            if (parentElement && parentElement.prop('tagName').toLowerCase() === 'kt-date-picker') {
              scope.$emit('monthPicker:monthSelect');
            }
          };

          scope.previousYear = function () {
            scope.monthPicker.year = scope.monthPicker.year - 1;
          };

          scope.hasPreviousYear = function () {
            var date = moment({year: scope.monthPicker.year});
            date.subtract(1, 'year');
            return ktDateBounds.isDateWithinBounds(date, scope.minDate, scope.maxDate, 'year', []);
          };

          scope.nextYear = function () {
            scope.monthPicker.year = scope.monthPicker.year + 1;
          };

          scope.hasNextYear = function () {
            var date = moment({year: scope.monthPicker.year});
            date.add(1, 'year');
            return ktDateBounds.isDateWithinBounds(date, scope.minDate, scope.maxDate, 'year', []);
          };

          scope.yearClick = function () {
            var parentElement = scope.$parent.element ? scope.$parent.element : undefined;

            if (parentElement && parentElement.prop('tagName').toLowerCase() === 'kt-date-picker') {
              scope.$emit('monthPicker:yearClick');
            }
          };

          scope.canChooseYear = function () {
            var parentElement = scope.$parent.element ? scope.$parent.element : undefined;

            if (parentElement && parentElement.prop('tagName').toLowerCase() === 'kt-date-picker' && (scope.hasPreviousYear() || scope.hasNextYear())) {
              return true;
            }

            return false;
          };
        }
      };
    }]);
})();
