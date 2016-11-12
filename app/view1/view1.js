'use strict';

var app = angular.module('myApp.view1', ['ngRoute', 'ui.grid', 'ui.grid.selection', 'ui.bootstrap.contextMenu'])

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

var grid

app.controller('View1Ctrl', ['$scope', '$log', '$interval', function($scope, log, $interval) {

  $scope.selected = 'None';
  $scope.items = [
    { name: 'John', otherProperty: 'Foo' },
    { name: 'Joe', otherProperty: 'Bar' }
  ];

  $scope.menuOptions = [
    ['Select', function ($itemScope, $event, modelValue, text, $li) {
      $scope.selected = $itemScope.item;
      log.debug($itemScope);
    }],
    null, // Dividier
    ['Remove', function ($itemScope, $event, modelValue, text, $li) {
      $scope.items.splice($itemScope.$index, 1);
    }]
  ];

  $scope.selectedRows = {};

  $scope.showSelectedRow = function() {
    log.debug($scope.selectedRows);
  };

  $scope.loadData = function(){
    log.debug("h");
  $scope.data = [];
  for (var i = 0; i < 1000; i++){
    $scope.data.push({
      "firstName": i,
      "lastName": (Math.random()*i),
      "company": i*100,
      "Employed": i*1000
    })
  }
    $scope.gridOptions.data = $scope.data
  };
  //$scope.loadData();

  $scope.columnDefs = [
    { name: 'firstName'},
    { name: 'lastName'},
    { name: 'company', displayName: 'Age (not focusable)', allowCellFocus : false },
    { name: 'Employed' }
  ];

  $scope.handleClick = function(evt) {
    switch(evt.which) {
      case 1:
        console.log("button 1"); // this is left click
        break;
      case 2:
        console.log("button 2") // this is left click
        break;
      case 3:
        console.log("button 3") // this is left click
        break;
      default:
        alert("you have a strange mouse!");
        break;
    }
  };

  $scope.logit = function(){
    console.log("asdfasdf")
  };

  $scope.gridOptions = {
    enableRowSelection: true,
    multiSelect: true,
    id: "123",
    enableRowHeaderSelection: false,
    //selectionRowHeaderWidth: 35,
    rowHeight: 35,
    showGridFooter:true,
    //data: $scope.data,
    columnDefs: $scope.columnDefs,
    onRegisterApi: function( gridApi ) {
      $scope.gridApi = gridApi;
      $scope.gridApi.selection.on.rowSelectionChanged($scope, function(row){
        console.log(row)
        if (row.entity.firstName in $scope.selectedRows){
          log.debug("here")
          delete $scope.selectedRows[row.entity.firstName]
        } else {
          $scope.selectedRows[row.entity.firstName] = row
        }
        console.log($scope.selectedRows)
      });
      $scope.gridApi.selection.on.rowSelectionChangedBatch($scope, function(rows){
        console.log(rows);
        rows.forEach(function(row){
          if (row.entity.firstName in $scope.selectedRows){
            delete $scope.selectedRows[row.entity.firstName]
          } else {
            $scope.selectedRows[row.entity.firstName] = row
          }
          console.log($scope.selectedRows)
        }
        );

      });
      grid = gridApi
    }
  };

  $interval($scope.loadData, 5000);

  $scope.rightClick = function (event) {
    var scope = angular.element(event.toElement).scope();
    console.log(event);
    console.log(scope.rowIndexer);
    console.log('you clicked on row: ', scope.grid.api.core.getVisibleRows()[scope.rowRenderIndex].entity.firstName);
  };






}]);

app.directive('ngRightClick', function($parse) {
  return function(scope, element, attrs) {
    var fn = $parse(attrs.ngRightClick);
    element.bind('contextmenu', function(event) {
      scope.$apply(function() {
        event.preventDefault();
        fn(scope, {$event:event});
      });
    });
  };
});