var instaTag = angular.module('grafiti', ['ngResource'])
.controller('main', ['$scope', '$http', function($scope, $http) {
	$scope.photos = [];
	$scope.colors = [
		"0, 0, 0",
		"255, 0, 0",
		"0, 255, 0",
		"0, 0, 255",
		"255, 255, 0",
		"35, 253, 186",
		"9, 138, 255",
		"176, 9, 255",
		"255, 172, 9",
		"255, 9, 164"
	];
	$scope.feathers = [
		1, .8, .6, .3, 0
	];
	$scope.sizes = [
		2, 5, 10, 20, 30, 40, 50
	];
	$scope.savedimages = (window.savedImages) ? window.savedImages : [];
	$scope.savePhoto = function() {
		var image = $scope.drawimage.getDataUrl();
		$http.post('/save',{image: image}
		).then(function(res) {
			$scope.savedimages.push(image);
		}, function(res) {
			console.log(res);
		});
	};
	$scope.setColor = function(color) {
		$scope.selectedColor = color;
		$scope.drawimage.setColor(color);
	};
	$scope.setSize = function(size) {
		$scope.selectedSize = size;
		$scope.drawimage.setSize(size);
	};
	$scope.setFeather = function(feather) {
		$scope.selectedFeather = feather;
		$scope.drawimage.setFeather(feather);
	};
	$scope.drawImageReady = function() {
		$scope.setColor($scope.colors[0]);
		$scope.setSize($scope.sizes[0]);
		$scope.setFeather($scope.feathers[0]);
	};
	$scope.loadRecentPhotos = function() {
		$http.jsonp('https://api.instagram.com/v1/users/self/media/recent?access_token=' + accessToken + '&callback=JSON_CALLBACK')
			.then(function(response){
				$scope.photos = response.data.data.map(function(photo){
						return {
							image: {
								src: photo.images.standard_resolution.url,
								width: photo.images.standard_resolution.width,
								height: photo.images.standard_resolution.height
							},
							thumb: {
								src: photo.images.thumbnail.url,
								width: photo.images.thumbnail.width,
								height: photo.images.thumbnail.height
							}
						}
				});
		});
	}
	$scope.thumbClick = function(src) {
		//var image = $scope.photos[thumb].image;
		$scope.drawimage.addImage(src, 640, 640);
	}
}])
.directive('drawimage', function(){
	
	var canvas,
		context,
		drawing = false,
		brushSize,
		feather = .6,
		color = '0, 0, 0',
		opacity = '1',
		animInterval,
		mousePosition = {},
		addDrawImage = function(src, width, height) {
			var img = new Image();
			img.crossOrigin = "Anonymous";
			img.onload = function() {
				context.drawImage(img, 0, 0, width, height);
			}
			canvas.width = width;
			canvas.height = height;
			img.src = src;
		},
		startDrawing = function(e) {
			updateMousePosition(e);
			draw();
			animInterval = setInterval(draw, 20);
		},
		updateMousePosition = function(e) {
			mousePosition.x = e.offsetX;
			mousePosition.y = e.offsetY;
		},
		draw = function() {
			var radgrad = context.createRadialGradient(
				mousePosition.x,
				mousePosition.y,
				0,
				mousePosition.x,
				mousePosition.y,
				brushSize / 2);
			radgrad.addColorStop(0, 'rgba(' + color + ',1)');
			radgrad.addColorStop(feather, 'rgba(' + color + ',1)');
			radgrad.addColorStop(1, 'rgba(' + color + ',0)');
			context.fillStyle = radgrad;

			context.fillRect(mousePosition.x-brushSize/2, mousePosition.y-brushSize/2, brushSize, brushSize);
		},
		endDrawing = function(){
			drawing = false;
			clearInterval(animInterval);
		},
		setColor = function(c) {
			color = c;
		},
		setSize = function(s) {
			brushSize = s;
		},
		setFeather = function(f) {
			feather = f;
		},
		getDataUrl = function() {
			return canvas.toDataURL();
		};
	
	return {
		restrict: 'E',
		template: '<canvas></canvas>',
		controller: ['$scope', function($scope){
			$scope.drawimage = {
				addImage : addDrawImage,
				setColor: setColor,
				setSize: setSize,
				setFeather: setFeather,
				getDataUrl: getDataUrl
			}
		}],
		link: function(scope, element) {
			canvas = element.children()[0],
			context = canvas.getContext("2d");
			canvas.addEventListener("mousedown", startDrawing);
			canvas.addEventListener("mousemove", updateMousePosition);
			canvas.addEventListener("mouseup", endDrawing);
			scope.drawImageReady();
		}
	}
});