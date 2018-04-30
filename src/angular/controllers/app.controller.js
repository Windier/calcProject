var MQ = MathQuill.getInterface(MathQuill.getInterface.MAX);
var colorWheel = ['#3090FF', '#FF304F','#AFFF30'];
config = {autoSubscriptNumerals: true};
app.controller('AppController', ['$scope', '$timeout', function ($scope, $timeout) {
  $scope.equations = [];

	$scope.addEquation = function () {
		$scope.equations.push({
		  'mq': '',
			'mathObject': '',
			'independent_variable': ''
		})
		$timeout(function () {
			var index = $scope.equations.length-1;
			span_dom = $('#equation' + index);
			var mq = MQ.MathField(span_dom[0],config);

			$scope.equations[index].mq = mq;
			$scope.equations[index].mathObject = new mathObject(NaN,calc.view,colorWheel[index%3]);
			span_dom.on('keyup', function() {
				$scope.equations[index].mathObject.latexParser(mq.latex())
			});
		}, 100)
	};

}])