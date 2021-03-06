export const sin = (x) => Math.sin(x);
export const cos = (x) => Math.cos(x);
export const tan = (x) => Math.tan(x);
export const sqrt = (x) => Math.sqrt(x);
export const abs = (x) => Math.abs(x);
export const exp = (x) => Math.exp(x);
export const floor = (x) => Math.floor(x);
export const ceil = (x) => Math.ceil(x);
export const sign = (x) => Math.sign(x);

// var trapzWeights = function(N)
// {
// 	// Create a zeros NxN array and fill it accordinly
// 	var W = math.zeros([N,N]);
// 	for (var i = 1; i < N-1; i++) {
// 		W[i][0] = 2;
// 		W[i][N-1] = 2;
// 		W[0][i] = 2;
// 		W[N-1][i] = 2;
// 		for (var j = 1; j < N-1; j++) {
// 			W[i][j] = 4;
// 		}
// 	}
// 	W[0][0] = 1; W[0][N-1] = 1; W[N-1][0] = 1; W[N-1][N-1] = 1;
// 	return W;
// };
// var trapz = function(A,W)
// {
// 	I = 0;
// 	n = A.length;
// 	m = A[0].length;
// 	for (var i = 0; i < n; i++) {
// 		for (var j = 0; j < m; j++) {
// 			I = I + W[i][j]*A[i][j];
// 		}
// 	}
// 	return I;
// };
// var normalize = function(A,C)
// {
// 	// Create a zeros NxN array and fill it accordinly
// 	N = A.length;
// 	var out = math.zeros([N,N]);

// 	for (var i = 0; i < A.length; i++) {
// 		out[i] = A[i].map(function(x) { return math.divide(x,C); }).slice();
// 	}
// 	return out;
// };
// var F = function(psi,V,δs)
// {
// 	N = psi.length;
// 	var D2 = math.zeros([N,N]);
//  	// loop through the inner points
// 	for (var i = 1; i < N-1; i++) {
// 		for (var j = 1; j < N-1; j++) {
// 			D2[i][j] = 
// 			math.multiply(
// 				math.add(
// 					u[i-1][j], u[i+1][j], 
//              		u[i][j+1], u[i][j-1], 
//              		math.divide(u[i][j],4)
//          		), (1/δs^2)
//      		 );
// 		};
// 	};
	
// 	return math.multiply(math.i, math.subtract(D2, math.multiply(V,psi)));
// };
// var RK4 = function(psi,V,δs,δt)
// {
// 	var dt = δt;
// 	var dto2 = δt/2;
// 	var dto6 = δt/6;

// 	var k1 = F(psi,V,δs);
// 	var k2 = F(math.add(psi, math.multiply(dto2,k1)),V,δs);
// 	var k3 = F(math.add(psi, math.multiply(dto2,k2)),V,δs);
// 	var k4 = F(math.add(psi, math.multiply(dt,k3)),V,δs);

// 	return math.add(psi,math.multiply(math.add(k1,k2,k3,k4),dto6));
// };

// // // https://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
export const arraysEqual = (a, b) => {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (a.length !== b.length) return false;

	// If you don't care about the order of the elements inside
	// the array, you should sort both arrays here.

	for (var i = 0; i < a.length; ++i) {
		if (a[i] !== b[i]) return false;
	}
	return true;
}
